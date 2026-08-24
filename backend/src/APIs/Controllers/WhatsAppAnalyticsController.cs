using Core.Application.Abstraction.Interfaces;
using Core.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Core.Domain.Entities.Reservations;

namespace APIs.Controllers
{
    [ApiController]
    [Route("api/admin/whatsapp/analytics")]
    public class WhatsAppAnalyticsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public WhatsAppAnalyticsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardMetrics([FromQuery] int days = 14)
        {
            var cutoff = DateTime.UtcNow.AddDays(-days);

            // 1. Fetch conversations in range
            var conversations = (await _unitOfWork.WhatsAppConversations
                .FindAllAsync(c => c.StartedAt >= cutoff)).ToList();

            if (!conversations.Any())
            {
                return Ok(new
                {
                    totalConversations = 0, botSuccessRate = 0.0, botErrors = 0, botErrorRate = 0.0,
                    totalRouted = 0, agentNeglected = 0, neglectRate = 0.0, totalBotOnlyResolved = 0,
                    dailyStats = Array.Empty<object>(), agentPerformance = Array.Empty<object>(),
                    revenueGenerated = 0m, confirmedBookings = 0
                });
            }

            var conversationIds = conversations.Select(c => c.Id).ToHashSet();

            // 2. Fetch all messages for these conversations
            var allMessages = (await _unitOfWork.WhatsAppMessages
                .FindAllAsync(m => conversationIds.Contains(m.ConversationId))).ToList();

            // Group messages by conversation
            var messagesByConvo = allMessages.GroupBy(m => m.ConversationId)
                .ToDictionary(g => g.Key, g => g.OrderBy(m => m.SentAt).ToList());

            // 3. Analyze each conversation
            var dailyStatsDict = new Dictionary<string, DailyStat>();
            var agentStatsDict = new Dictionary<string, AgentStat>();
            int totalRouted = 0, totalNeglected = 0, totalBotErrors = 0, totalBotSuccess = 0;
            int validConvos = 0;

            // Booking confirmation keywords (from employee messages)
            var bookingConfirmationKws = new[] {
                "تم تأكيد حجز", "تم تأكيد الحجز", "حجزك مؤكد", "تأكيد حجز",
                "بأكد الحجز", "باكد الحجز",
                "تم تأكيد حجز الطيران", "تم تأكيد حجز الفنادق",
                "ارسلك الحجوزات مؤكده", "حجوزات مؤكده", "الحجز مؤكد"
            };

            foreach (var convo in conversations)
            {
                if (!messagesByConvo.TryGetValue(convo.Id, out var msgs) || msgs.Count == 0)
                    continue;

                validConvos++;
                var date = convo.StartedAt.ToString("yyyy-MM-dd");

                if (!dailyStatsDict.ContainsKey(date))
                    dailyStatsDict[date] = new DailyStat { Date = date };

                var daily = dailyStatsDict[date];
                daily.Total++;

                var allText = string.Join("\n", msgs.Select(m => m.Content ?? ""));
                
                var hasAgentMsg = msgs.Any(m => m.SenderType == MessageSender.Human) || convo.LastAgentMessageAt.HasValue;
                var hasBotMsg = msgs.Any(m => m.SenderType == MessageSender.Bot);
                var isAssigned = !string.IsNullOrEmpty(convo.AssignedAgentName);
                var isRoutedToHuman = isAssigned || hasAgentMsg || convo.Mode == ConversationMode.Human;

                // Robust bot error & frustration detection
                var hasBotError = allText.Contains("عذراً، لم أتمكن من فهم طلبك") || allText.Contains("للشخص الواحد");

                if (!hasBotError)
                {
                    // 1. Loop detection: customer sends the exact same short input 3+ times consecutively
                    string? lastContent = null;
                    int repeatCount = 0;
                    foreach (var m in msgs.Where(m => m.SenderType == MessageSender.Customer))
                    {
                        var clean = m.Content?.Trim();
                        if (string.IsNullOrEmpty(clean) || clean.Length > 10) continue;
                        
                        if (clean == lastContent)
                        {
                            repeatCount++;
                            if (repeatCount >= 2)
                            {
                                hasBotError = true;
                                break;
                            }
                        }
                        else
                        {
                            lastContent = clean;
                            repeatCount = 0;
                        }
                    }
                }

                if (!hasBotError && msgs.Any(m => m.SenderType == MessageSender.Bot))
                {
                    // 2. Frustration keywords detection when interacting with the bot
                    var frustrationKws = new[] {
                        "معلق", "مشكلة", "خطأ", "غلط", "ما فهمتني", "البوت غبي",
                        "ما فهمت", "مو شغال", "مو راضي", "مب راضي", "ما ضبط",
                        "موجهني غلط", "معلق البوت", "البوت خربان", "الرد الالي خربان",
                        "ما يشتغل", "الرد الآلي", "رد آلي", "الرد التلقائي", "رد تلقائي"
                    };
                    
                    foreach (var kw in frustrationKws)
                    {
                        if (allText.Contains(kw))
                        {
                            hasBotError = true;
                            break;
                        }
                    }
                }

                if (isRoutedToHuman)
                {
                    totalRouted++;
                    daily.Routed++;

                    if (hasAgentMsg)
                    {
                        daily.AgentReplied++;

                        // Track agent performance
                        var agentMsgs = msgs.Where(m => m.SenderType == MessageSender.Human).ToList();
                        var agentName = convo.AssignedAgentName ?? "غير محدد";

                        if (!agentStatsDict.ContainsKey(agentName))
                            agentStatsDict[agentName] = new AgentStat { AgentName = agentName };

                        var agentStat = agentStatsDict[agentName];
                        agentStat.ConversationsHandled++;
                        agentStat.TotalMessagesSent += agentMsgs.Count;

                        // Calculate response time using MEDIAN-friendly collection
                        // Time between last customer msg before agent reply and first agent reply
                        var firstAgentMsg = msgs.FirstOrDefault(m => m.SenderType == MessageSender.Human);
                        if (firstAgentMsg != null)
                        {
                            var lastCustomerMsgBeforeAgent = msgs
                                .Where(m => m.SenderType == MessageSender.Customer && m.SentAt < firstAgentMsg.SentAt)
                                .OrderByDescending(m => m.SentAt)
                                .FirstOrDefault();

                            if (lastCustomerMsgBeforeAgent != null)
                            {
                                var diffMin = (firstAgentMsg.SentAt - lastCustomerMsgBeforeAgent.SentAt).TotalMinutes;
                                if (diffMin > 0) // No upper cap - include ALL response times
                                    agentStat.ResponseTimes.Add(diffMin);
                            }
                        }

                        // Check for Checkout Attempts and Confirmed Sales (Timeline Analysis)
                        var paymentKeywords = new[] { "سداد", "رابط دفع", "رابط الدفع", "apple pay", "ابل باي", "ايبان", "IBAN" };
                        // STRICT 100% certainty keywords
                        var postPaymentAgentKws = new[] { "تم حجز", "حجزك جاهز", "تم تأكيد الحجز", "تم اصدار التذكرة", "تم اصدار الفاوتشر" };
                        var postPaymentCustomerKws = new[] { "تم الدفع", "تم التحويل", "حولت المبلغ" };
                        
                        bool hasCheckoutAttempt = false;
                        bool hasConfirmedSale = false;
                        int paymentMsgIndex = -1;

                        for (int i = 0; i < msgs.Count; i++)
                        {
                            var m = msgs[i];
                            if (m.SenderType == MessageSender.Human)
                            {
                                var content = m.Content ?? "";
                                if (paymentKeywords.Any(k => content.Contains(k, StringComparison.OrdinalIgnoreCase)))
                                {
                                    hasCheckoutAttempt = true;
                                    paymentMsgIndex = i;
                                    break;
                                }
                            }
                        }

                        if (hasCheckoutAttempt)
                        {
                            agentStat.CheckoutAttempts++;
                            for (int i = paymentMsgIndex + 1; i < msgs.Count; i++)
                            {
                                var m = msgs[i];
                                var content = m.Content ?? "";
                                
                                if (m.SenderType == MessageSender.Human && postPaymentAgentKws.Any(k => content.Contains(k)))
                                {
                                    hasConfirmedSale = true; break;
                                }
                                else if (m.SenderType == MessageSender.Customer && postPaymentCustomerKws.Any(k => content.Contains(k)))
                                {
                                    hasConfirmedSale = true; break;
                                }
                            }
                        }
                        else
                        {
                            // Silent sale check (Agent sent tickets without payment link)
                            var lastFew = msgs.Where(m => m.SenderType == MessageSender.Human).TakeLast(3);
                            foreach (var m in lastFew)
                            {
                                var content = m.Content ?? "";
                                if (postPaymentAgentKws.Any(k => content.Contains(k)))
                                {
                                    hasConfirmedSale = true; break;
                                }
                            }
                        }

                        if (hasConfirmedSale) agentStat.ConfirmedSales++;
                    }
                    else
                    {
                        totalNeglected++;
                        daily.Neglected++;
                    }
                }
                else if (!hasBotError && !hasAgentMsg && hasBotMsg)
                {
                    totalBotSuccess++;
                    daily.BotSuccess++;
                }

                if (hasBotError)
                {
                    totalBotErrors++;
                    daily.BotErrors++;
                }
            }

            // 4. Build response
            var botSuccessRate = validConvos > 0 ? Math.Round((double)totalRouted / validConvos * 100, 1) : 0;
            var botErrorRate = validConvos > 0 ? Math.Round((double)totalBotErrors / validConvos * 100, 1) : 0;
            var neglectRate = totalRouted > 0 ? Math.Round((double)totalNeglected / totalRouted * 100, 1) : 0;

            // Calculate total conversations handled by all agents for scoring
            var totalAgentConvos = agentStatsDict.Values.Sum(a => a.ConversationsHandled);

            return Ok(new
            {
                totalConversations = validConvos,
                botSuccessRate,
                botErrors = totalBotErrors,
                botErrorRate,
                totalRouted,
                agentNeglected = totalNeglected,
                neglectRate,
                totalBotOnlyResolved = totalBotSuccess,
                dailyStats = dailyStatsDict.Values.OrderBy(d => d.Date).Select(d => new
                {
                    date = d.Date,
                    total = d.Total,
                    routed = d.Routed,
                    agentReplied = d.AgentReplied,
                    neglected = d.Neglected,
                    botErrors = d.BotErrors,
                    botSuccess = d.BotSuccess
                }),
                agentPerformance = agentStatsDict.Values
                    .OrderByDescending(a => a.ConversationsHandled)
                    .Select(a => {
                        // MEDIAN response time (more accurate than average)
                        var medianResponseTime = 0;
                        if (a.ResponseTimes.Any())
                        {
                            var sorted = a.ResponseTimes.OrderBy(x => x).ToList();
                            var mid = sorted.Count / 2;
                            medianResponseTime = (int)Math.Round(sorted.Count % 2 == 0 
                                ? (sorted[mid - 1] + sorted[mid]) / 2.0 
                                : sorted[mid]);
                        }

                        // First hour response rate
                        var firstHourRate = a.ResponseTimes.Any() 
                            ? Math.Round((double)a.ResponseTimes.Count(t => t <= 60) / a.ResponseTimes.Count * 100, 1) 
                            : 0.0;

                        // Composite performance score (0-100)
                        // 40% response speed + 30% volume + 30% sales indicators
                        var speedScore = medianResponseTime <= 30 ? 100 
                            : medianResponseTime <= 60 ? 85
                            : medianResponseTime <= 120 ? 70
                            : medianResponseTime <= 360 ? 50
                            : medianResponseTime <= 720 ? 30 : 10;

                        var volumeScore = totalAgentConvos > 0 
                            ? Math.Min(100, (int)((double)a.ConversationsHandled / totalAgentConvos * 500))
                            : 0;

                        var salesScore = a.ConversationsHandled > 0
                            ? Math.Min(100, (int)((double)(a.ConfirmedSales * 3 + a.CheckoutAttempts) / a.ConversationsHandled * 100))
                            : 0;

                        var compositeScore = (int)(speedScore * 0.4 + volumeScore * 0.3 + salesScore * 0.3);

                        return new
                        {
                            agentName = a.AgentName,
                            conversationsHandled = a.ConversationsHandled,
                            totalMessagesSent = a.TotalMessagesSent,
                            avgResponseTimeMinutes = medianResponseTime,
                            firstHourResponseRate = firstHourRate,
                            checkoutAttempts = a.CheckoutAttempts,
                            confirmedSales = a.ConfirmedSales,
                            performanceScore = compositeScore
                        };
                    }),
                revenueGenerated = 0m,
                confirmedBookings = agentStatsDict.Values.Sum(a => a.ConfirmedSales)
            });
        }

        private class DailyStat
        {
            public string Date { get; set; } = "";
            public int Total { get; set; }
            public int Routed { get; set; }
            public int AgentReplied { get; set; }
            public int Neglected { get; set; }
            public int BotErrors { get; set; }
            public int BotSuccess { get; set; }
        }

        private class AgentStat
        {
            public string AgentName { get; set; } = "";
            public int ConversationsHandled { get; set; }
            public int TotalMessagesSent { get; set; }
            public List<double> ResponseTimes { get; set; } = new();
            public int CheckoutAttempts { get; set; }
            public int ConfirmedSales { get; set; }
        }
    }
}
