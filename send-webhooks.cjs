const crypto = require('crypto');
const url = "http://localhost:5284/api/whatsapp/webhook";

async function sendWebhook(convId, text, action = "message_create", additionalData = {}) {
    console.log(`Sending ${action}: ${text || ''}`);
    let payload = { action, data: {} };
    if (action === "message_create") {
        payload.actor = { actor_type: "user" };
        payload.data = {
            message: {
                conversation_id: convId,
                id: crypto.randomUUID(),
                message_parts: [{ text: { content: text } }]
            }
        };
    } else {
        payload.data = additionalData;
    }
    
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    await new Promise(r => setTimeout(r, 4000));
}

async function run() {
    let c1 = "c1_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c1, "السلام عليكم");
    await sendWebhook(c1, "هل عندكم دفع أقساط عبر تابي أو تمارا؟");
    await sendWebhook(c1, "ممتاز، طيب كم فرع عندكم بالضبط وفين أماكنها؟");
    console.log("C1_ID:" + c1);

    let c2 = "c2_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c2, "00");
    await sendWebhook(c2, "4"); // 4 is Visa!
    await sendWebhook(c2, "5");
    await sendWebhook(c2, "99");
    await sendWebhook(c2, "طيب كم بتاخذ وقت؟");
    console.log("C2_ID:" + c2);

    let c3 = "c3_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c3, "00");
    await sendWebhook(c3, "أبي احجز لتركيا شخصين لمدة اسبوع");
    await sendWebhook(c3, "التاريخ من 1 اغسطس لـ 8 اغسطس");
    await sendWebhook(c3, "يعطيكم العافية");
    console.log("C3_ID:" + c3);

    let c4 = "c4_" + crypto.randomUUID().substring(0, 4);
    await sendWebhook(c4, "كيف حالك؟");
    await sendWebhook(c4, "وين موقعكم؟");
    console.log("C4_ID:" + c4);

    console.log("DONE");
}
run();
