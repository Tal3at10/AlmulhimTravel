using Microsoft.AspNetCore.Mvc;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Application.Services.WhatsApp;
using System.Diagnostics;
using System.Text;

namespace APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WhatsAppTesterController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IAiService _aiService;
        private readonly WhatsAppIntentClassifier _intentClassifier;
        private readonly Core.Application.Abstraction.Services.Reservations.IVoucherProIntegrationService _voucherService;
        private readonly IEmbeddingService _embeddingService;
        private readonly IVectorDbService _vectorDbService;

        public WhatsAppTesterController(
            IUnitOfWork unitOfWork,
            IConfiguration configuration,
            IAiService aiService,
            WhatsAppIntentClassifier intentClassifier,
            Core.Application.Abstraction.Services.Reservations.IVoucherProIntegrationService voucherService,
            IEmbeddingService embeddingService,
            IVectorDbService vectorDbService)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _aiService = aiService;
            _intentClassifier = intentClassifier;
            _voucherService = voucherService;
            _embeddingService = embeddingService;
            _vectorDbService = vectorDbService;
        }

        [HttpPost("test-audio-local")]
        public async Task<IActionResult> TestAudioLocal([FromQuery] string filePath = @"E:\Projects\AlMulhim-Travel\WhatsApp Ptt 2026-07-25 at 8.30.29 AM.ogg")
        {
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"Audio file not found at: {filePath}");
            }

            try
            {
                var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
                var groqService = HttpContext.RequestServices.GetRequiredService<Infrastructure.Shared.Services.GroqAiService>();
                
                var transcript = await groqService.TranscribeAudioAsync(bytes, Path.GetFileName(filePath));
                
                var mockProvider = new MockWhatsAppProvider();
                var agentService = new WhatsAppAgentService(
                    _unitOfWork,
                    mockProvider,
                    _configuration,
                    _aiService,
                    _intentClassifier,
                    _voucherService,
                    _embeddingService,
                    _vectorDbService);

                string conversationId = $"test_audio_conv_{Guid.NewGuid().ToString().Substring(0, 8)}";
                
                // First simulate starting conversation
                await agentService.HandleIncomingMessageAsync(conversationId, "Test Customer", "start", "+966500000000");
                var welcomeMsg = mockProvider.SentMessage;
                mockProvider.SentMessage = null;

                // Now simulate sending the voice transcript directly
                await agentService.HandleIncomingMessageAsync(conversationId, "Test Customer", transcript, "+966500000000");
                var botResponse = mockProvider.SentMessage;

                return Ok(new
                {
                    AudioFilePath = filePath,
                    AudioSizeBytes = bytes.Length,
                    TranscribedText = transcript,
                    WelcomeMessageSent = welcomeMsg,
                    BotResponseToAudio = botResponse
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpPost("run-100-cases")]
        public async Task<IActionResult> RunTests()
        {
            var testCases = GetTestCases();
            var report = new StringBuilder();
            report.AppendLine("# 🧪 تقرير اختبار المستشار السياحي الذكي (100 سيناريو معقد)");
            report.AppendLine("هذا التقرير يستعرض استجابات البوت وتتبعه الدقيق لكل رسالة (شامل وقت الاستجابة، التصرف، والرسالة المُرسلة).\n");
            report.AppendLine("| رقم | العميل (Input) | تصرف الذكاء (Action) | رد البوت (Output) | الوقت (ms) |");
            report.AppendLine("|---|---|---|---|---|");

            int index = 1;
            foreach (var testCase in testCases)
            {
                var mockProvider = new MockWhatsAppProvider();
                var agentService = new WhatsAppAgentService(
                    _unitOfWork,
                    mockProvider,
                    _configuration,
                    _aiService,
                    _intentClassifier,
                    _voucherService,
                    _embeddingService,
                    _vectorDbService);

                var sw = Stopwatch.StartNew();
                try
                {
                    // Generate a random freshchat ID to simulate a fresh conversation state each time
                    string conversationId = $"test_conv_{Guid.NewGuid().ToString().Substring(0, 8)}";
                    await agentService.HandleIncomingMessageAsync(conversationId, "Test User", testCase, "+966500000000");
                }
                catch (Exception ex)
                {
                    mockProvider.SentMessage = $"Error: {ex.Message}";
                }
                sw.Stop();

                string actionType = string.IsNullOrEmpty(mockProvider.SentMessage) ? "Handoff to Sales" : "Respond (AI)";
                string outputText = string.IsNullOrEmpty(mockProvider.SentMessage) ? "*(انسحاب صامت وتحويل للموظف)*" : mockProvider.SentMessage.Replace("\n", "<br>");
                
                report.AppendLine($"| {index} | {testCase} | {actionType} | {outputText} | {sw.ElapsedMilliseconds} |");
                index++;
            }

            string artifactPath = @"C:\Users\7oda\.gemini\antigravity\brain\6207a197-c110-4bd6-aac7-c46f6efb4071\ai_100_cases_report.md";
            await System.IO.File.WriteAllTextAsync(artifactPath, report.ToString());

            return Ok($"تم الاختبار بنجاح وتم حفظ الملف في {artifactPath}");
        }

        private List<string> GetTestCases()
        {
            // Building 100 complex scenarios based on Saudi dialect and travel inquiries.
            var cases = new List<string>
            {
                // 1. Hallucination Traps
                "أبي باقة سياحية لكوكب المريخ",
                "كم سعر تذكرة الطيران لديزني لاند امريكا؟",
                "عندكم رحلات لمدينة أتلانتس المفقودة؟",
                "ابي برنامج سياحي لكولومبيا وتشيلي",
                "سمعت عن جزيرة هواي عندكم عرض لها؟",
                "احتاج استخرج فيزا سياحية للسودان",
                "ممكن ترتبولي رحلة للقمر؟",
                "عندكم باقات للصومال؟",
                "ابي رحلة سياحية لمدينة غوثام",
                "تسوون برامج للاسكا في الشتاء؟",

                // 2. Exact RAG Hits & Query Expansion Tests
                "أبي عرض طرابزون الي فيه تلفريك بـ 2500 ريال",
                "ابي باقة البوسنة وسراييفو الاقتصادية",
                "عندكم عرض حق جورجيا فيه جبال القوقاز؟",
                "بسال عن باقة ماليزيا حق شهر العسل",
                "ابي برنامج اوروبا فرنسا وسويسرا",
                "كم سعر رحلة تايلاند بانكوك وبوكيت؟",
                "ابي فندق خمس نجوم في دبي قريب من المول",
                "باقة تركيا 10 ايام موجودة؟",
                "ايش يشمل عرض اذربيجان؟",
                "وين اماكن الجولات في عرض صبنجا ومعشوقية؟",

                // 3. Missing Fields Tracking
                "أبي أسافر",
                "ابي برنامج سياحي",
                "عندكم باقات شهر عسل؟",
                "ابي اسافر ماليزيا",
                "بدي اروح تركيا",
                "محتاجين عرض اوروبا عايلة",
                "ابي عرض اقتصادي",
                "ممكن ترتبلي رحلة انا وزوجي",
                "ابي اسافر بعد العيد",
                "ابغى فندق زين",

                // 4. Fuzzy Dates & Complex inputs
                "ابي اسافر بعد العيد بيومين",
                "تاريخ السفر نص اوت تقريبا",
                "السفر اخر شهر 9",
                "رحلتي اول ويكند من رمضان",
                "بسافر بداية الاجازة الصيفية",
                "بعد اسبوعين من الان",
                "تاريخ المغادرة 15 او 16 سبتمبر",
                "نهاية السنة الهجرية",
                "في الكريسمس",
                "اول نوفمبر",

                // 5. Handoffs and Sales requests
                "ممكن اكلم موظف؟",
                "ابي اصمم باقتي بنفسي مابي عروض جاهزة",
                "محتاج انسان يكلمني",
                "ابي خدمة تفصيل باقة",
                "ممكن رقم المبيعات؟",
                "ياخي حولني على احد افهمه",
                "ابي ارتب جدول خاص فيني انا",
                "عندكم حجز فنادق فقط بدون طيران؟ ابي موظف يسويها",
                "مابي الذكاء الاصطناعي",
                "بدي احكي مع الادارة",

                // 6. Mixed and Very Complex
                "السلام عليكم ابي اسافر جورجيا انا وزوجتي وثلاث اطفال اعمارهم 5 و 7 و 10، الميزانية 10 الاف ريال شامل الطيران، تاريخ السفر 20 اغسطس لمدة اسبوع",
                "ابي البوسنة بكرة شخص واحد",
                "مرحبا، هل باقة تركيا 5 ايام تشمل تذاكر الطيران وتأشيرة الدخول؟ انا من السعودية.",
                "وش ارخص ديرة عندكم الحين؟",
                "ابي اسافر مكان بارد وممطر ورخيص، ميزانيتي 3000 ريال، وش تقترحون؟",
                "ابي اسافر اوروبا بس ماعندي فيزا شنجن، وش الحل؟",
                "كم تاخذ وقت فيزا بريطانيا؟ وهل تطلعونها لي؟",
                "ابغى الغي رحلتي لجورجيا، كيف الطريقة؟",
                "ممكن تعديل على باقة ماليزيا؟ ابي ازيد يوم في لنكاوي",
                "احتاج استقبال من المطار فقط في دبي",

                // 7. Short/Edge cases
                "1", "0", "00", "hi", "سلام", "وش السالفة", "ممتاز", "شكرا", "لا", "نعم",

                // Fill the rest up to 100 with random challenging dialect
                "ابي احجز تذكرة ذهاب واياب للرياض",
                "هل في تامين طبي في باقاتكم؟",
                "وين موقعكم بالرياض؟",
                "اقدر ادفع بالتقسيط تابي او تمارا؟",
                "ابي رحلة صيد في جنوب افريقيا",
                "تنظمون رحلات غوص في البحر الاحمر؟",
                "وش افضل وقت لزيارة اليابان؟",
                "عندكم عروض لليوم الوطني؟",
                "ابي احجز كروز في البحر المتوسط",
                "ممكن جدول سياحي لاندونيسيا بالي",
                "اسعاركم غالية جدا ليش؟",
                "هل الطيران مباشر ولا ترانزيت؟",
                "كم الوزن المسموح في طيران ناس؟",
                "اقدر اغير تاريخ الرحلة بعد الحجز؟",
                "هل في ضريبة على الباقات؟",
                "ابي باقة لشخصين كبار وطفل رضيع",
                "هل الفنادق تقدم اكل حلال؟",
                "في مرشد سياحي يتكلم عربي؟",
                "هل في انترنت في الفنادق؟",
                "كم ساعة طيران من الرياض لباريس؟",
                "وش الاوراق المطلوبة لفيزا الشنجن؟",
                "اقدر اطلع فيزا تركيا اونلاين؟",
                "هل لازم تطعيم كورونا للسفر؟",
                "ابي اسافر بعد بكرة في امكانية؟",
                "وش ارخص يوم للسفر في الاسبوع؟",
                "ابي فندق بمسبح خاص في المالديف",
                "عندكم باقات لكاس العالم؟",
                "ابي رحلة علاجية للتشيك",
                "تنظمون معسكرات رياضية؟",
                "ابي احجز سيارة في المانيا",
                "هل رخصتي السعودية مقبولة في اوروبا؟",
                "وش الافضل احول الفلوس من هنا ولا هناك؟",
                "ابي باقة سياحية لكبار السن بدون مشي كثير",
                "عندكم رحلات شبابية ومغامرات؟",
                "ابي احجز شقة فندقية مو غرفة",
                "هل الدفع كاش ولا بطاقة؟",
                "ابي فاتورة ضريبية",
                "وين فرعكم في جدة؟",
                "رقمكم الثاني ما يردون!",
                "وش الحسابات البنكية حقكم؟",
                "ممكن ترسلون لي اللوكيشن",
                "هل مكتبكم معتمد من وزارة السياحة؟",
                "كيف اقدم شكوى؟",
                "ابي تقييمات العملاء اللي سافروا معكم",
                "عندكم تطبيق على الجوال؟",
                "وش افضل شركة طيران؟",
                "اقدر اخذ قطوتي معي بالسفر؟",
                "ابي رحلة بالقطار في اوروبا",
                "هل اسعاركم تشمل كل شي؟"
            };

            return cases.Take(100).ToList();
        }
    }

    // Mock provider to capture messages instead of sending them
    public class MockWhatsAppProvider : IWhatsAppProvider
    {
        public string? SentMessage { get; set; }

        public Task<string> GetAgentIdAsync() => Task.FromResult("mock_agent_id");

        public Task SendTextMessageAsync(string phoneNumber, string message)
        {
            SentMessage = message;
            return Task.CompletedTask;
        }

        public Task SendImageMessageAsync(string phoneNumber, string imageUrl, string? caption)
        {
            SentMessage = $"[IMAGE] {caption}";
            return Task.CompletedTask;
        }

        public Task SendDocumentMessageAsync(string phoneNumber, string documentUrl, string? caption)
        {
            SentMessage = $"[DOCUMENT] {caption}";
            return Task.CompletedTask;
        }

        public Task AssignConversationToGroupAsync(string conversationId, string groupId)
        {
            SentMessage = string.IsNullOrEmpty(SentMessage) ? $"[ASSIGN] {groupId}" : SentMessage;
            return Task.CompletedTask;
        }

        public Task SendPrivateNoteAsync(string conversationId, string note)
        {
            // Internal note, not sent to user
            return Task.CompletedTask;
        }



        public Task SendQuickReplyButtonsAsync(string conversationId, string bodyText, List<(string Label, string ReplyText)> buttons)
        {
            SentMessage = bodyText;
            return Task.CompletedTask;
        }

        public Task SendListMessageAsync(string conversationId, string bodyText, string buttonLabel, List<(string Label, string ReplyText)> items)
        {
            SentMessage = bodyText;
            return Task.CompletedTask;
        }
    }
}

