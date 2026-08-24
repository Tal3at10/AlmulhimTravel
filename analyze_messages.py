
import csv
import re
import collections

with open("messages_4000.csv", "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    messages = [row["Content"] for row in reader if row["Direction"] == "0"]

weird_messages = []

for msg in messages:
    if not msg: continue
    
    msg_strip = msg.strip()
    
    if len(msg_strip) > 200:
        weird_messages.append(("Very Long", msg_strip))
        
    emoji_pattern = re.compile(r"^[\W\U00010000-\U0010ffff]+$", re.UNICODE)
    if emoji_pattern.match(msg_strip) and any(c >= "\U00010000" for c in msg_strip):
        weird_messages.append(("Only Emojis", msg_strip))
        
    if re.search(r"(.)\1{4,}", msg_strip):
        weird_messages.append(("Repeated Chars", msg_strip))
        
    if "http://" in msg_strip or "https://" in msg_strip:
        weird_messages.append(("Contains Link", msg_strip))
        
    if re.match(r"^[0-9]{5,20}$", msg_strip):
        weird_messages.append(("Large Number Only", msg_strip))

    if re.match(r"^[?.!]+$", msg_strip):
        weird_messages.append(("Punctuation Only", msg_strip))

grouped = collections.defaultdict(list)
for category, msg in weird_messages:
    if msg not in grouped[category]:
        grouped[category].append(msg)

for category, msgs in grouped.items():
    print(f"=== {category} ({len(msgs)} unique samples) ===")
    for m in msgs[:5]:
        print(f" - {m}")
    print()

