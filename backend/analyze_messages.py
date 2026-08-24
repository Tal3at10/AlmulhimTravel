import re
from collections import defaultdict

def analyze_conversations(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    conversations = content.split("============================================================")[1:]
    
    total_convs = 0
    modes = defaultdict(int)
    states = defaultdict(int)
    
    handoffs = 0
    errors_invalid_number = 0
    ai_fallbacks = 0
    ai_misunderstandings = 0
    drop_offs = 0
    
    for conv in conversations:
        if not conv.strip():
            continue
            
        total_convs += 1
        
        # Parse metadata
        mode_match = re.search(r'Mode: (\w+)', conv)
        if mode_match:
            modes[mode_match.group(1)] += 1
            
        state_match = re.search(r"Notes/State: '(.*?)'", conv)
        if state_match:
            states[state_match.group(1)] += 1
            
        # Parse messages
        messages = re.split(r'\[(Inbound|Outbound)/.*? @ .*?\]', conv)
        
        # Look for specific patterns in the conversation text
        if "أبشر! سيتواصل معك أحد المختصين" in conv or "جاري تحويلك" in conv or "تم تنبيه فريق المبيعات" in conv:
            handoffs += 1
            
        if "عذراً، الرقم غير صحيح" in conv or "عفواً، يرجى اختيار رقم من القائمة" in conv:
            errors_invalid_number += 1
            
        if "عذراً، لم أتمكن من فهم طلبك بشكل صحيح" in conv:
            ai_misunderstandings += 1
            
        # Drop-off analysis: Does the conversation end with an outbound message and no inbound reply?
        # A rough heuristic: The last message is Outbound and not a handoff
        if messages and len(messages) > 2:
            last_type = messages[-2] # The type comes before the content in the split
            last_content = messages[-1]
            if last_type == 'Outbound' and "أبشر! سيتواصل معك" not in last_content and "جاري تحويلك" not in last_content:
                drop_offs += 1

    print("===== CONVERSATION ANALYSIS =====")
    print(f"Total Conversations: {total_convs}")
    print(f"Modes: {dict(modes)}")
    print(f"Top States: {sorted(dict(states).items(), key=lambda x: x[1], reverse=True)[:5]}")
    print(f"Agent Handoffs: {handoffs} ({(handoffs/total_convs)*100:.1f}%)")
    print(f"Invalid Number Errors: {errors_invalid_number} ({(errors_invalid_number/total_convs)*100:.1f}%)")
    print(f"AI Misunderstandings: {ai_misunderstandings} ({(ai_misunderstandings/total_convs)*100:.1f}%)")
    print(f"Potential Drop-offs: {drop_offs} ({(drop_offs/total_convs)*100:.1f}%)")

analyze_conversations(r"E:\Projects\AlMulhim-Travel\backend\conversations_dump.txt")
