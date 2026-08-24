const { execSync } = require('child_process');
const crypto = require('crypto');

const url = "http://localhost:5284/api/whatsapp/webhook";

async function sendWebhook(convId, text) {
    console.log(`User sends: ${text}`);
    const payload = {
        action: "message_create",
        actor: { actor_type: "user" },
        data: {
            message: {
                conversation_id: convId,
                id: crypto.randomUUID(),
                message_parts: [{ text: { content: text } }]
            }
        }
    };
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    await new Promise(r => setTimeout(r, 6000));
}

function queryReplies(convId) {
    const query = `SELECT Content FROM WhatsAppMessages WHERE ConversationId = (SELECT Id FROM WhatsAppConversations WHERE FreshchatConversationId = '${convId}') AND Direction = 1 ORDER BY SentAt ASC`;
    try {
        const cmd = `Invoke-Sqlcmd -Query "${query}" -ConnectionString "Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True" -QueryTimeout 30`;
        const result = execSync(`powershell -Command "${cmd}"`, { encoding: 'utf8' });
        console.log("--- BOT REPLIES ---");
        const lines = result.split('\\n').filter(l => l.trim() !== '' && l.trim() !== 'Content' && !l.includes('-------'));
        if (lines.length > 0) {
            console.log(lines.join('\\n').trim());
        } else {
            console.log("(No replies)");
        }
    } catch (e) {
        console.error("DB Query failed:", e.message);
    }
}

async function run() {
    console.log("=== SCENARIO 1: Knowledge Base (Tabby/Branches) ===");
    let c1 = "c1_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c1, "السلام عليكم");
    await sendWebhook(c1, "هل عندكم دفع أقساط عبر تابي أو تمارا؟");
    await sendWebhook(c1, "ممتاز، طيب كم فرع عندكم بالضبط وفين أماكنها؟");
    queryReplies(c1);

    console.log("\\n=== SCENARIO 2: Visa Loop ===");
    let c2 = "c2_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c2, "00");
    await sendWebhook(c2, "3");
    await sendWebhook(c2, "5");
    await sendWebhook(c2, "99");
    await sendWebhook(c2, "طيب كم بتاخذ وقت؟");
    queryReplies(c2);

    console.log("\\n=== SCENARIO 3: Booking Inquiry Loop ===");
    let c3 = "c3_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c3, "00");
    await sendWebhook(c3, "أبي احجز لتركيا شخصين لمدة اسبوع");
    await sendWebhook(c3, "التاريخ من 1 اغسطس لـ 8 اغسطس");
    await sendWebhook(c3, "يعطيكم العافية");
    queryReplies(c3);

    console.log("\\n=== SCENARIO 4: Menu Injection Hallucination ===");
    let c4 = "c4_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c4, "كيف حالك؟");
    await sendWebhook(c4, "وين موقعكم؟");
    queryReplies(c4);

    console.log("All tests completed!");
}

run();
