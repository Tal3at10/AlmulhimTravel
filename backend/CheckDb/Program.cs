using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Infrastructure.Shared.Services;
using Core.Application.Services.WhatsApp;

Console.OutputEncoding = System.Text.Encoding.UTF8;
Console.WriteLine("===============================================================");
Console.WriteLine("🧪 فحص محلي نهائي ومؤكد للردود الموجهة للواتساب");
Console.WriteLine("===============================================================\n");

var config = new ConfigurationBuilder()
    .AddInMemoryCollection(new Dictionary<string, string?>
    {
        {"AiSettings:OpenRouterApiKey", Environment.GetEnvironmentVariable("OPENROUTER_API_KEY") ?? ""},
        {"AiSettings:OpenRouterModel", "google/gemini-2.5-flash"}
    })
    .Build();

var httpClient = new HttpClient();
var aiService = new OpenRouterAiService(httpClient, config);

string CleanResponse(string raw)
{
    if (string.IsNullOrWhiteSpace(raw)) return "";
    
    // 0. Extract JSON response if raw JSON block
    raw = raw.Replace("```json", "").Replace("```", "").Trim();
    int firstBrace = raw.IndexOf('{');
    int lastBrace = raw.LastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace)
    {
        try
        {
            using var doc = JsonDocument.Parse(raw.Substring(firstBrace, lastBrace - firstBrace + 1));
            if (doc.RootElement.TryGetProperty("response", out var r))
            {
                raw = r.GetString() ?? "";
            }
        }
        catch { }
    }

    // 1. Initial trim
    raw = raw.TrimStart('!', '،', ',', '.', ':', '-', ' ', '\n', '\r');

    // 2. Pass 1: Strip greeting/filler words at start (أبشر، تمام، حياك الله، أهلاً بك، يسعدنا...)
    raw = Regex.Replace(
        raw, 
        @"^(أبشر\s*(طال\s*عمرك)?|سم\s*(طال\s*عمرك)?|تمام|حياك\s*الله|أهلاً?\s*بك|اهلاً?\s*بك|يسعدنا)[،\.!؟\n\s]+", 
        "", 
        RegexOptions.IgnoreCase).Trim();

    // 3. Pass 2: HARD Direct Question Extractor — if there is any preamble before the question, extract ONLY the question
    if (raw.Contains("؟") || raw.Contains("?"))
    {
        var qMatch = Regex.Match(
            raw,
            @"(من\s+أي\s+مطار|كم\s+عدد|تاريخ\s+السفر|متى\s+تبون|متى\s+موعد|هل\s+تفضلون|هل\s+تم|في\s+أي\s+مدينة|ما\s+هي\s+فئة|ما\s+هو\s+تاريخ)[^؟\?]*[؟\?]",
            RegexOptions.Singleline | RegexOptions.IgnoreCase);

        if (qMatch.Success)
        {
            raw = qMatch.Value.Trim();
        }
    }

    // 4. Pass 3: Strip any remaining recap preamble sentences
    raw = Regex.Replace(
        raw, 
        @"^(لتجهيز|لتصميم|بناءً?\s*على|بما\s+أن[^\s]*)\s+[^؟\?]*[،,\.:]\s*", 
        "", 
        RegexOptions.IgnoreCase).Trim();

    // 5. Pass 4: HARD Multi-Question Cutter
    {
        var mqMatch = Regex.Match(raw, @"[،,]\s*و(هل|ما\s|كم\s|من\s|أي\s|كيف\s|متى\s)");
        if (mqMatch.Success)
        {
            raw = raw.Substring(0, mqMatch.Index).TrimEnd('،', ',', ' ') + "؟";
        }
    }

    // 6. Final trim
    raw = raw.TrimStart('!', '،', ',', '.', ':', '-', ' ', '\n', '\r');

    return raw;
}

var scenarios = new[]
{
    new {
        Title = "سيناريو التأشيرات العام (كم مدة استخراج الفيزا بدون ذكر الدولة)",
        History = "",
        Input = "كم مدة استخراج الفيزا"
    },
    new {
        Title = "سيناريو فيزا بريطانيا (مدة استخراج فيزا بريطانيا)",
        History = "",
        Input = "كم مدة استخراج فيزا بريطانيا؟"
    },
    new {
        Title = "سيناريو زنجبار (الصورة السابقة)",
        History = "العميل: مرحبا\nالبوت: مرحباً بك! أنا المساعد الذكي لسفريات الملحم 🌍 لخدمتك بشكل أسرع، يرجى اختيار أحد الأقسام التالية\nالعميل: ممكن تفاصيل اكثر عن رحلة الى زنجبار عدد ٢ السفر في نوفمبر",
        Input = "ممكن تفاصيل اكثر عن رحلة الى زنجبار عدد ٢ السفر في نوفمبر"
    }
};

foreach (var sc in scenarios)
{
    Console.WriteLine($"\n=======================================================");
    Console.WriteLine($"🔍 اختبار: {sc.Title}");
    Console.WriteLine($"💬 رسالة العميل: \"{sc.Input}\"");

    var promptBuilder = new System.Text.StringBuilder();
    promptBuilder.AppendLine("أنت المشرف الذكي (Super AI Agent) لبوت واتساب سفريات الملحم.");
    promptBuilder.AppendLine($"التاريخ الحالي للنظام: {DateTime.UtcNow:yyyy-MM-dd} (السنة الحالية: {DateTime.UtcNow.Year}). جميع التواريخ التي يذكرها أو يطلبها العميل تخص السنة الحالية {DateTime.UtcNow.Year} أو السنة القادمة.");
    promptBuilder.AppendLine("مهمتك مراجعة المحادثة كاملة واتخاذ القرار الصحيح. لا تقم أبداً بتأليف باقات أو أسعار من خيالك، نحن لدينا قاعدة بيانات جاهزة.");
    promptBuilder.AppendLine();
    promptBuilder.AppendLine("قاعدة المعرفة الخاصة بنا:");
    promptBuilder.AppendLine(WhatsAppKnowledgeBase.Content);
    promptBuilder.AppendLine();
    promptBuilder.AppendLine(@"الخيارات المتاحة للقرار (Action):
- ""show_packages"": لعرض الباقات السياحية الجاهزة عند استفسار العميل عن وجهة.
- ""ask_details"": إذا طلب العميل تفاصيل باقة أو تصميم رحلة، واسأله مباشرة عن البيانات الناقصة فقط دون تكرار.
- ""handoff_sales"": لحجوزات الباقات بعد اكتمال البيانات الأساسية (الوجهة، المدة/التاريخ، عدد الأشخاص، مطار المغادرة) أو بطلب صريح.
- ""handoff_flights"": لحجوزات تذاكر الطيران المستقلة فقط.
- ""handoff_transport"": للمواصلات وتوصيل المطارات مع الأخ جعفر (0502447741).
- ""respond"": للرد المباشر والإجابة عن الاستفسارات.

الأسئلة الـ 5 الأساسية لتجميع طلب العميل (اسأل سؤال واحد فقط في كل رسالة):
1. 👥 **عدد المسافرين** (كم شخص بالغ وأطفال وأعمارهم؟).
2. 📅 **تاريخ السفر** (متى تبون تسافرون تقريباً؟).
3. ✈️ **مطار المغادرة** (من أي مطار تفضلون المغادرة؟). ⚠️ إذا قال العميل ""شامل كل شيء"" أو ""بكج كامل"" أو ""مع الطيران""، فهذا يعني أنه يريد الوكالة تحجز الطيران، فلا تسأله ""هل تم حجز الطيران؟"" أبداً.
4. 🏨 **فئة الفنادق** (4 نجوم أم 5 نجوم أم شقق فندقية؟).
5. 💰 **الميزانية** (هل في ميزانية تقديرية؟).

قواعد صارمة:
0. قاعدة الاستخلاص الفوري ومنع التكرار.
1. منع الديباجات والمقدمات والتلخيص نهائياً (Zero Preamble & Zero Echoing).
4. الإيجاز والتركيز (سؤال واحد فقط في الرسالة).
5. استيعاب الكلمات (شامل كل شيء = الطيران والفنادق والجولات معاً).

الرد بصيغة JSON:
{
  ""action"": ""..."",
  ""response"": ""..."",
  ""parameters"": {
     ""destination"": ""..."",
     ""check_in"": ""YYYY-MM-DD"",
     ""duration_days"": 5,
     ""adults"": 2,
     ""children"": 0,
     ""cabin_class"": ""Business / Economy / unspecified"",
     ""max_budget"": 0
  }
}");

    var userMsg = $"=== تاريخ المحادثة ===\n{sc.History}\n\nالحالة الحالية للعميل: WaitingForBookingDetails\nالرسالة الحالية من العميل: \"{sc.Input}\"";

    var response = await aiService.GenerateResponseAsync(userMsg, new List<Core.Application.Abstraction.Services.ChatMessage>(), promptBuilder.ToString());
    var rawText = response.Text?.Trim() ?? "";
    string finalClean = CleanResponse(rawText);

    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine($"[الرد الخام من الـ AI]:\n{rawText}");
    
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine($"\n[الرد الفعلي الذي يرسله النظام للمستخدم في واتساب]:\n👉 \"{finalClean}\"");
    Console.ResetColor();

    // Verification Checks
    bool hasPreamble = finalClean.StartsWith("أبشر") || finalClean.StartsWith("تمام") || finalClean.StartsWith("زنجبار") || finalClean.StartsWith("لتجهيز") || finalClean.StartsWith("بما أن");
    bool hasMultipleQuestions = finalClean.Count(c => c == '؟' || c == '?') > 1;

    if (!hasPreamble && !hasMultipleQuestions && !string.IsNullOrWhiteSpace(finalClean))
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("✅ فحص الجودة: نجاح تام (بدون ديباجة، سؤال واحد فقط، بدون ثرثرة).");
        Console.ResetColor();
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"❌ تنبيه: hasPreamble={hasPreamble}, hasMultipleQuestions={hasMultipleQuestions}");
        Console.ResetColor();
    }
}

Console.WriteLine("\n===============================================================");
Console.WriteLine("🏁 انتهى الفحص المحلي المؤكد.");
Console.WriteLine("===============================================================");



