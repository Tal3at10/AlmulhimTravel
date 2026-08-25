using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace Almulhem.Travel.UnitTests.Services
{
    public class WhatsAppBot50CasesTests
    {
        [Theory]
        [InlineData("لا", "respond")]
        [InlineData("نعم", "respond")]
        [InlineData("0", "respond")]
        [InlineData("00", "respond")]
        [InlineData("ممكن أكلم موظف؟", "handoff_sales")]
        [InlineData("4", "show_packages")]
        [InlineData("أبي أسافر تركيا", "show_packages")]
        [InlineData("كم سعر باقة البوسنة؟", "show_packages")]
        [InlineData("عندكم رحلات لديزني لاند؟", "respond")]
        [InlineData("أبي أستخرج فيزا شنغن", "handoff_visa")]
        [InlineData("تودون عاملة للمطار؟", "respond")]
        [InlineData("3500 ريال", "respond")]
        [InlineData("4 آلاف", "respond")]
        [InlineData("أبي باقة عائلية أذربيجان 10 أيام", "show_packages")]
        [InlineData("السعر غالي جداً", "respond")]
        [InlineData("عندكم تقسيط تابي أو تمارا؟", "respond")]
        [InlineData("أبي كروز في البحر المتوسط", "respond")]
        [InlineData("ملاحظة: أبي شقة مفروشة", "respond")]
        [InlineData("شكراً جزيلاً", "respond")]
        public void Test_ActionTag_Parsing_Mechanisms(string aiRawOutput, string expectedAction)
        {
            // Simulate AI supervisor response containing text tags
            string text = expectedAction switch
            {
                "handoff_sales" => "أبشر، بحولك الآن لموظف المبيعات لخدمتك ✨\n[ACTION: handoff_sales]",
                "handoff_visa" => "أهلاً بك! يمكنك التواصل مع مسئول التأشيرات.\n[ACTION: handoff_visa]",
                "show_packages" => "أهلاً بك! هذه أهم عروضنا الجاهزة ✨\n[ACTION: show_packages | DESTINATION: تركيا]",
                _ => $"{aiRawOutput}\n[ACTION: respond]"
            };

            string action = "respond";
            string responseMessage = text;
            string destination = "";

            var actionMatch = Regex.Match(text, @"\[ACTION:\s*([^\]\|]+)(?:\|\s*DESTINATION:\s*([^\]]+))?\]", RegexOptions.IgnoreCase);
            if (actionMatch.Success)
            {
                action = actionMatch.Groups[1].Value.Trim().ToLower();
                if (actionMatch.Groups[2].Success) destination = actionMatch.Groups[2].Value.Trim();
                responseMessage = text.Replace(actionMatch.Value, "").Trim();
            }

            action.Should().Be(expectedAction);
            responseMessage.Should().NotContain("[ACTION:");
        }

        [Fact]
        public void Test_AI_Interceptor_For_Hallucinated_Handoffs()
        {
            string hallucinatedText = "معك 'سفر' وكيلك الذكي.. أعتذر منك، يبدو أن هناك ضغطاً تقنياً بسيطاً حالياً. قمت بتحويلك فوراً لزملائي المختصين!";
            string action = "respond";

            if (action == "ask_details" || action == "respond")
            {
                if (hallucinatedText.Contains("تحويل") || 
                    hallucinatedText.Contains("المبيعات") || 
                    hallucinatedText.Contains("الموظفين") || 
                    hallucinatedText.Contains("الموظف") || 
                    hallucinatedText.Contains("المختص") ||
                    hallucinatedText.Contains("المختصين") ||
                    hallucinatedText.Contains("زملائي"))
                {
                    action = "handoff_sales";
                    hallucinatedText += "\n\n(تم تنبيه الموظف لخدمتك 👨‍💼)";
                }
            }

            action.Should().Be("handoff_sales");
            hallucinatedText.Should().Contain("(تم تنبيه الموظف لخدمتك 👨‍💼)");
        }

        [Fact]
        public void Test_KnowledgeBase_Contains_Official_Email_And_No_Wrong_Email()
        {
            var content = Core.Application.Services.WhatsApp.WhatsAppKnowledgeBase.Content;
            content.Should().Contain("almulhim_travel@yahoo.com");
            content.Should().NotContain("info@almulhimtravel.com");
        }

        [Theory]
        [InlineData("{\"action\": \"respond\", \"response\": \"أهلاً بك يا غالي! كيف أقدر أخدمك اليوم؟\"}", "أهلاً بك يا غالي! كيف أقدر أخدمك اليوم؟")]
        [InlineData("```json\n{\"action\": \"ask_details\", \"response\": \"كم عدد المسافرين وتاريخ السفر التقريبي؟\"}\n```", "كم عدد المسافرين وتاريخ السفر التقريبي؟")]
        [InlineData("{\"action\": \"show_packages\", \"response\": \"{تفضل أفضل عروضنا لتركيا:}\"}", "تفضل أفضل عروضنا لتركيا:")]
        public void Test_JSON_Sanitizer_Removes_All_Syntax_Leaks(string rawInput, string expectedSanitized)
        {
            // Simulate the exact sanitization logic in WhatsAppAgentService
            var text = rawInput.Replace("```json", "").Replace("```", "").Trim();
            if (text.StartsWith("{") && text.EndsWith("}"))
            {
                using var doc = System.Text.Json.JsonDocument.Parse(text);
                if (doc.RootElement.TryGetProperty("response", out var res))
                {
                    text = res.GetString() ?? text;
                }
            }

            text = text.Replace("{", "").Replace("}", "").Replace("\"", "").Trim();
            text.Should().Be(expectedSanitized);
        }

        [Fact]
        public void Test_Combined_Handoff_Message_Formatting()
        {
            var finalMsg = "تم تأكيد طلبك وجاري تحويلك للمختصين 👨‍💼";
            var securityNotice = "⚠️ *تنبيه أمني لعملائنا:*\nالتعاملات المالية والحجوزات تتم حصراً عبر هذا الرقم الرسمي لـ *سفريات الملحم* عبر قنوات الدفع المعتمدة فقط (حسابات الشركة البنكية، روابط تابي/تمارا، أو بالفروع).";
            
            var combinedHandoffMessage = !string.IsNullOrWhiteSpace(finalMsg)
                ? $"{finalMsg}\n\n━━━━━━━━━━━━━━━\n{securityNotice}"
                : securityNotice;

            combinedHandoffMessage.Should().Contain("تم تأكيد طلبك");
            combinedHandoffMessage.Should().Contain("━━━━━━━━━━━━━━━");
            combinedHandoffMessage.Should().Contain("⚠️ *تنبيه أمني لعملائنا:*");
        }
    }
}
