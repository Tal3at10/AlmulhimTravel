import re
import json
import random
from collections import defaultdict

def extract_scenarios(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    conversations = content.split("============================================================")[1:]
    
    scenarios = []
    
    for conv in conversations:
        if not conv.strip():
            continue
            
        messages_raw = re.split(r'\[(Inbound|Outbound)/.*? @ .*?\]', conv)
        
        # messages_raw contains: [intro text, "Inbound", message content, "Outbound", message content...]
        if len(messages_raw) < 3:
            continue
            
        msgs = []
        for i in range(1, len(messages_raw), 2):
            msg_type = messages_raw[i]
            msg_content = messages_raw[i+1].strip()
            msgs.append((msg_type, msg_content))
            
        # Identify price objections
        full_text = " ".join([m[1] for m in msgs])
        
        category = "General"
        if "غالي" in full_text or "سعر" in full_text or "بكام" in full_text:
            category = "Pricing/Objection"
        elif "تعديل" in full_text or "يومين" in full_text or "نقص" in full_text or "زود" in full_text:
            category = "Package Modification"
        elif "جاري تحويلك" in full_text:
            category = "Agent Handoff"
            
        # Simple extraction: just the conversation history as a scenario
        history = [{"role": "user" if t == "Inbound" else "assistant", "content": c} for t, c in msgs]
        if len(history) > 0:
            scenarios.append({
                "category": category,
                "turns": len(history),
                "history": history[-6:] # Last 6 messages for context
            })

    # Pick up to 1000
    selected = scenarios[:1000]
    
    with open("scenarios_1000.json", "w", encoding="utf-8") as out:
        json.dump(selected, out, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(selected)} scenarios. Categorization breakdown:")
    cats = defaultdict(int)
    for s in selected:
        cats[s["category"]] += 1
    for c, count in cats.items():
        print(f" - {c}: {count}")

if __name__ == "__main__":
    extract_scenarios(r"E:\Projects\AlMulhim-Travel\backend\conversations_dump.txt")
