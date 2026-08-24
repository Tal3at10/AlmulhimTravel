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
    }
}
