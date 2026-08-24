import json

with open("rag_test_results.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

md = "# نتائج اختبار الذكاء الاصطناعي (RAG) على آخر 40 محادثة حقيقية\n\n"

items = data.get("value", data) if isinstance(data, dict) else data

for item in items:
    md += f"### رسالة العميل: {item.get('message', '')}\n\n"
    md += "**ما وجده الذكاء الاصطناعي في قاعدة المعرفة:**\n"
    for rag in item.get('ragFound', []):
        md += f"- {rag}\n"
    md += "\n---\n"

with open("C:/Users/7oda/.gemini/antigravity/brain/6207a197-c110-4bd6-aac7-c46f6efb4071/rag_test_results.md", "w", encoding="utf-8") as f:
    f.write(md)
