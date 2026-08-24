import json

with open("ai_test_results.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

md = "# الردود الحقيقية للبوت المدعوم بالذكاء الاصطناعي على رسائل العملاء السابقة\n\n"

items = data.get("value", data) if isinstance(data, dict) else data

for item in items:
    md += f"**رسالة العميل:** {item.get('message', '')}\n\n"
    md += f"**رد البوت الذكي (النهائي):**\n{item.get('aiReply', '')}\n\n"
    md += "---\n\n"

with open("C:/Users/7oda/.gemini/antigravity/brain/6207a197-c110-4bd6-aac7-c46f6efb4071/ai_test_results.md", "w", encoding="utf-8") as f:
    f.write(md)
