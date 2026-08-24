using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;

namespace Core.Application.Services.WhatsApp
{
    public class IntentClassificationResult
    {
        [JsonPropertyName("intent")]
        public string Intent { get; set; } = "GeneralQuestion"; // BookingInquiry, MultiDestinationInquiry, VisaInquiry, TalkToAgent, MenuNavigation, GeneralQuestion
        
        [JsonPropertyName("extractedEntities")]
        public Dictionary<string, string>? ExtractedEntities { get; set; }
        
        [JsonPropertyName("confidence")]
        public double Confidence { get; set; }
    }

    public class WhatsAppIntentClassifier
    {
        private readonly IAiService _aiService;

        public WhatsAppIntentClassifier(IAiService aiService)
        {
            _aiService = aiService;
        }

        public async Task<IntentClassificationResult> ClassifyIntentAsync(string messageContent, string? currentState = null, string? chatHistory = null)
        {
            var contextString = string.IsNullOrEmpty(currentState) ? "" : $"\n\nIMPORTANT CONTEXT: The user is currently looking at the '{currentState}' menu/state in the WhatsApp bot. You MUST use this context! For example, if they are in 'VisaMenu' or 'VisaDetails' and simply type a country name like 'فيتنام', their intent is definitively 'VisaInquiry', NOT 'BookingInquiry'. If they are in a packages state and say 'احجز', it's a 'BookingInquiry'.";
            var historyContext = string.IsNullOrEmpty(chatHistory) ? "" : $"\n\nRECENT CONVERSATION HISTORY (For context only):\n{chatHistory}";

            var systemPrompt = $@"You are an expert NLP intent classifier for a Travel Agency WhatsApp bot (AlMulhim Travel).
Analyze the customer's NEW message and determine their primary intent from the following list:{contextString}{historyContext}
- BookingInquiry: The user wants to book a hotel, tourist package, or asks about destinations and tourism programs. 
  CRITICAL: If the user mentions ANY country, city, or destination name (e.g., 'البوسنة', 'جورجيا', 'لندن', 'تركيا', 'ماليزيا', 'اندونيسيا') along with details like dates or number of people (e.g., 'البوسنه شخصين'), this MUST be classified as BookingInquiry, even if they don't explicitly say the words 'احجز' or 'باقة'.
  CRITICAL 2: If the user mentions ONLY passenger counts (e.g., '6 اشخاص', 'شخصين وطفلين') or dates while looking at a specific package, classify as BookingInquiry.
  Examples: 'ابي احجز', 'فيه عروض لتركيا؟', 'بكم البكج لماليزيا؟', 'البوسنه شخصين ٧ ايام', '6 اشخاص'. Note: Do NOT use this for general policy questions.
- MultiDestinationInquiry: The user specifically asks for or mentions MULTIPLE destinations in the same message, or inputs multiple numbers corresponding to a menu (e.g., '8 6', 'البوسنة وجورجيا', 'لندن وباريس', 'ابي ازور اكثر من دولة').
- FlightInquiry: The user is specifically asking to book or inquire about flight tickets ONLY (e.g. 'حجز طيران', 'تذاكر', 'رحلة جوية'). Do NOT use this if they mention 'packages' or 'tourism programs' alongside flights.
- CarRental: The user wants to rent a car, asking for car hires, or transportation.
- VisaInquiry: The user is asking about visa requirements, Schengen, UK visa, etc.
- OrderTracking: The user wants to track a previous booking, ask about a ticket status, or follow up.
- Complaint: The user is angry, complaining about bad service, or expressing dissatisfaction.
- UrgentSupport: The user is facing an immediate critical issue (e.g. 'احنا بالمطار', 'السواق ما جاء', 'الفندق مغلق', 'مساعدة عاجلة').
- TalkToAgent: The user wants to talk to a human agent or employee.
- SpamOrMarketing: The user is sending marketing messages.
- MenuNavigation: The user entered a number to navigate the menu.
- GeneralQuestion: The user is asking a general question, saying hello, or making small talk. IMPORTANT: Questions about company policies, branches, contact info, how to reach us, payment methods, or whether prices include flights (e.g., 'هل السعر يشمل الطيران؟', 'وش طرق الدفع؟', 'كيف اتواصل معاكم؟', 'هل لكم فروع؟') MUST be classified as GeneralQuestion so the FAQ agent can answer them. EXCEPTION: If the user explicitly asks for a package INCLUDING flights (e.g., 'ابي بكج شامل الطيران'), this is a BookingInquiry, NOT a GeneralQuestion.

CRITICAL INSTRUCTIONS FOR ENTITY EXTRACTION:
If the intent is BookingInquiry, FlightInquiry, CarRental, or VisaInquiry, you MUST extract any relevant details from the Arabic text.
Always use exactly these keys for extractedEntities if the data is present:
- 'Destination': The SPECIFIC country or city they want to go to (e.g. 'طرابزون', 'تركيا', 'لندن'). CRITICAL: If they do NOT explicitly name a real geographic location, you MUST OMIT this key entirely. Do NOT extract words like 'عروض' or 'باقات'.
- 'Departure': Where they are flying from (e.g. 'القصيم', 'الرياض').
- 'TravelDates': The dates of travel (e.g. 'من 8/1 الى 8/15', 'شهر اغسطس').
- 'NumberOfPeople': The total number of people, adults, and children (e.g. 'شخصين وطفلين', '4 اشخاص').
- 'Duration': How long they want to stay (e.g. '10 ايام', 'اسبوعين').

You MUST respond in valid JSON format ONLY, matching this structure:
{{
    ""intent"": ""FlightInquiry"",
    ""extractedEntities"": {{
        ""Departure"": ""القصيم"",
        ""Destination"": ""طرابزون"",
        ""TravelDates"": ""8/1 الى 8/15"",
        ""NumberOfPeople"": ""شخصين وطفلين اعمارهم 7 و 3 سنوات""
    }},
    ""confidence"": 0.99
}}
Do NOT include any markdown formatting like ```json. Return ONLY the raw JSON.";

            try
            {
                var aiResponse = await _aiService.GenerateResponseAsync(
                    messageContent,
                    new List<ChatMessage>(),
                    systemPrompt
                );

                var jsonResponse = aiResponse.Text.Trim();
                
                // Robustly extract JSON block even if AI adds conversational text before or after
                var match = System.Text.RegularExpressions.Regex.Match(jsonResponse, @"\{.*\}", System.Text.RegularExpressions.RegexOptions.Singleline);
                if (match.Success)
                {
                    jsonResponse = match.Value;
                }
                
                var result = JsonSerializer.Deserialize<IntentClassificationResult>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return result ?? new IntentClassificationResult { Intent = "GeneralQuestion" };
            }
            catch (Exception)
            {
                // Fallback to basic heuristics if AI fails
                return FallbackHeuristicClassification(messageContent);
            }
        }

        private IntentClassificationResult FallbackHeuristicClassification(string input)
        {
            var result = new IntentClassificationResult { Confidence = 0.5 };
            string normInput = input.Trim().ToLower().Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه");

            if (int.TryParse(input, out _) || normInput == "٠" || normInput == "١" || normInput == "٢" || normInput == "٣" || normInput == "٤" || normInput == "٥" || normInput == "٦" || normInput == "٧" || normInput == "٨" || normInput == "٩")
            {
                result.Intent = "MenuNavigation";
            }
            else if (normInput.Contains("موظف") || normInput.Contains("خدمة عملاء") || normInput.Contains("كلمني") || normInput.Contains("بشر"))
            {
                result.Intent = "TalkToAgent";
            }
            else if (normInput.Contains("فيزا") || normInput.Contains("تأشيرة") || normInput.Contains("تاشيرة") || normInput.Contains("شنغن") || normInput.Contains("فيزة"))
            {
                result.Intent = "VisaInquiry";
            }
            else if (normInput.Contains("طيران") || normInput.Contains("تذكرة") || normInput.Contains("تذاكر") || normInput.Contains("رحلة جوية"))
            {
                result.Intent = "FlightInquiry";
            }
            else if (normInput.Contains("سيارة") || normInput.Contains("ايجار") || normInput.Contains("تاجير") || normInput.Contains("سواق") || normInput.Contains("سياره"))
            {
                result.Intent = "CarRental";
            }
            else if (normInput.Contains("زفت") || normInput.Contains("سيء") || normInput.Contains("نصابين") || normInput.Contains("شكوى") || normInput.Contains("قرف"))
            {
                result.Intent = "Complaint";
            }
            else if (normInput.Contains("شركة") && (normInput.Contains("نقدم") || normInput.Contains("تسويق") || normInput.Contains("خدماتنا")))
            {
                result.Intent = "SpamOrMarketing";
            }
            else if (normInput.Contains("حجزي") || normInput.Contains("تتبع") || normInput.Contains("طلبي") || normInput.Contains("رقم الحجز") || normInput.Contains("التذكرة طلعت"))
            {
                result.Intent = "OrderTracking";
            }
            else if (normInput.Contains("حجز") || normInput.Contains("سياحة") || normInput.Contains("برنامج") || normInput.Contains("سفر") || normInput.Contains("باقة") || normInput.Contains("بكج") || normInput.Contains("فندق") || 
                     normInput.Contains("بوسنه") || normInput.Contains("بوسنة") || normInput.Contains("تركيا") || normInput.Contains("جورجيا") || 
                     normInput.Contains("ماليزيا") || normInput.Contains("اذربيجان") || normInput.Contains("تايلاند") || normInput.Contains("تايلند") || 
                     normInput.Contains("اندونيسيا") || normInput.Contains("بالي") || normInput.Contains("موريشيوس") || normInput.Contains("روسيا") || 
                     normInput.Contains("لندن") || normInput.Contains("نمسا") || normInput.Contains("المانيا") || normInput.Contains("ايطاليا") || 
                     normInput.Contains("اسبانيا") || normInput.Contains("فرنسا") || normInput.Contains("سويسرا") || normInput.Contains("دبي") || 
                     normInput.Contains("مصر") || normInput.Contains("قاهرة") || normInput.Contains("مغرب") || normInput.Contains("امريكا") || normInput.Contains("فيتنام"))
            {
                result.Intent = "BookingInquiry";
                
                // Attempt basic entity extraction for fallback
                result.ExtractedEntities = new Dictionary<string, string>();
                var popularDestinations = new[] { "البوسنه", "تركيا", "جورجيا", "ماليزيا", "اذربيجان", "تايلاند", "اندونيسيا", "بالي", "موريشيوس", "روسيا", "لندن", "النمسا", "المانيا", "ايطاليا", "اسبانيا", "فرنسا", "سويسرا", "دبي", "مصر", "المغرب", "امريكا", "فيتنام" };
                foreach (var dest in popularDestinations)
                {
                    if (normInput.Contains(dest.Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه")))
                    {
                        result.ExtractedEntities["Destination"] = dest;
                        break;
                    }
                }
            }
            else
            {
                result.Intent = "GeneralQuestion";
            }

            return result;
        }
    }
}
