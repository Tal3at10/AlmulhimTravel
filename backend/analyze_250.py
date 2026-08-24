import json
import sys
import re
from collections import Counter, defaultdict

sys.stdout.reconfigure(encoding='utf-8')

with open(r"e:\Projects\AlMulhim-Travel\backend\recent_250_conversations.json", "r", encoding="utf-8") as f:
    conversations = json.load(f)

# Sort conversations by StartedAt
conversations.sort(key=lambda x: x.get("StartedAt", ""))

post_update_convs = [c for c in conversations if c.get("StartedAt", "") >= "2026-07-22"]
pre_update_convs = [c for c in conversations if c.get("StartedAt", "") < "2026-07-22"]

output_lines = []

def p(text=""):
    output_lines.append(text)

p(f"# 📊 تقرير تحليل الـ 250 محادثة (الفترة من 22 يوليو إلى 25 يوليو 2026)")
p()
p(f"- **إجمالي المحادثات في العينة:** {len(conversations)}")
p(f"- **المحادثات بعد التحديث الأخير (من 22 إلى 25 يوليو):** {len(post_update_convs)}")
p(f"- **المحادثات قبل التحديث الأخير (قبل 22 يوليو):** {len(pre_update_convs)}")
p()

# Analyze modes in post-update
modes = Counter(c.get("Mode") for c in post_update_convs)
p(f"## 📈 التوزيع العام للمحادثات (آخر 3 أيام):")
p(f"- **محادثات تم معالجتها بالكامل عبر البوت (Bot Mode):** {modes.get('Bot', 0)} ({modes.get('Bot', 0)/len(post_update_convs)*100:.1f}%)")
p(f"- **محادثات تم تحويلها لموظف بشري (Human Mode):** {modes.get('Human', 0)} ({modes.get('Human', 0)/len(post_update_convs)*100:.1f}%)")
p()

# Analyze Visa Queries
visa_convs = []
for c in post_update_convs:
    msgs = c.get("Messages", [])
    cust_msgs = [m.get("Content", "") for m in msgs if m.get("Sender") == "Customer"]
    bot_msgs = [m.get("Content", "") for m in msgs if m.get("Sender") == "Bot"]
    
    if any(re.search(r"فيزا|تأشيرة|تاشيرة", m) for m in cust_msgs):
        phone = c.get("Phone")
        date = c.get("StartedAt")
        # Check if handoff_visa triggered or visa number given
        gave_visa_num = any("0532737645" in b or "التأشيرات" in b for b in bot_msgs)
        said_not_available = any("ما عندنا فيزا" in b or "لا تتوفر" in b for b in bot_msgs)
        visa_convs.append({
            "phone": phone,
            "date": date,
            "gave_visa_num": gave_visa_num,
            "said_not_available": said_not_available,
            "cust_msgs": cust_msgs,
            "bot_msgs": bot_msgs
        })

p(f"## 🛂 تحليل استفسارات التأشيرات والفيزا (Visa Handoff Check):")
p(f"- **إجمالي استفسارات التأشيرات:** {len(visa_convs)}")
correct_visa = sum(1 for v in visa_convs if v['gave_visa_num'])
failed_visa = sum(1 for v in visa_convs if v['said_not_available'])
p(f"- **تم إعطاء رقم موظف التأشيرات المباشر (0532737645) بنجاح:** {correct_visa} محادثة")
p(f"- **تم قول 'ما عندنا فيزا' (هلوسة قديمة قبل التعديل):** {failed_visa} محادثة")
p()

# Analyze Loops and Repeat Issues
loop_convs = []
for c in post_update_convs:
    msgs = c.get("Messages", [])
    bot_msgs = [m.get("Content", "").strip() for m in msgs if m.get("Sender") == "Bot" and m.get("Content")]
    if not bot_msgs: continue
    
    # check if any long message repeated >= 2 times sequentially or 3 times total
    counts = Counter(bot_msgs)
    for text, count in counts.items():
        if count >= 3 and len(text) > 15:
            loop_convs.append({
                "phone": c.get("Phone"),
                "date": c.get("StartedAt"),
                "text": text[:60],
                "count": count
            })
            break

p(f"## 🔄 تحليل اللوبات والتكرار (Bot Loops):")
p(f"- **عدد المحادثات التي ظهر بها تكرار رسالة أكثر من 3 مرات:** {len(loop_convs)}")
for l in loop_convs:
    p(f"  - هاتف: `{l['phone']}` | التاريخ: `{l['date']}` | عدد التكرار: `{l['count']}`")
    p(f"    الرسالة المكررة: _{l['text']}..._")
p()

# Analyze Customer Frustration & AI Misunderstandings
frustration_convs = []
for c in post_update_convs:
    msgs = c.get("Messages", [])
    cust_msgs = [m for m in msgs if m.get("Sender") == "Customer"]
    bot_msgs = [m for m in msgs if m.get("Sender") == "Bot"]
    
    for m in cust_msgs:
        content = m.get("Content", "")
        if any(kw in content for kw in ["غبي", "ما فهمت", "مو فاهم", "مايرد", "خطأ", "انتم مين", "كلم موظف", "وين الموظف", "ليه كدا", "يا اخي"]):
            frustration_convs.append({
                "phone": c.get("Phone"),
                "date": c.get("StartedAt"),
                "trigger": content,
                "bot_responses": [bm.get("Content") for bm in bot_msgs[:4]]
            })
            break

p(f"## ⚠️ تحليل أخطاء الفهم وشكاوى العملاء (AI Misunderstandings & Frustration):")
p(f"- **عدد المحادثات التي عبر فيها العميل عن عدم الفهم أو الشكوى:** {len(frustration_convs)}")
for f in frustration_convs:
    p(f"- **هاتف:** `{f['phone']}` | **تاريخ:** `{f['date']}`")
    p(f"  - **رسالة العميل:** `{f['trigger']}`")
p()

# Write to file
with open(r"e:\Projects\AlMulhim-Travel\backend\250_analysis_report.md", "w", encoding="utf-8") as f:
    f.write("\n".join(output_lines))

print("Analysis report generated successfully at e:\\Projects\\AlMulhim-Travel\\backend\\250_analysis_report.md")
