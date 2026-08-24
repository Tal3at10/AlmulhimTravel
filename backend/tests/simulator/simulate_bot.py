import requests
import json
import uuid
import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API_URL = "http://localhost:5284/api/whatsapp/webhook/simulate"

scenarios = [
    {
        "name": "Scenario 1: Ask about Sapanca (Inside Turkey Package)",
        "messages": ["1", "عندك صابنجا جروب ؟"]
    },
    {
        "name": "Scenario 2: Ask about Azerbaijan",
        "messages": ["1", "اريد السفر الى اذربيجان"]
    },
    {
        "name": "Scenario 3: Direct Booking",
        "messages": ["1", "حجز فندق ردسون"]
    },
    {
        "name": "Scenario 4: Greeting",
        "messages": ["حياك الله"]
    },
    {
        "name": "Scenario 5: Ask about Bosnia",
        "messages": ["1", "تفاصيل باقة البوسنة والهرسك لو سمحت"]
    }
]

def simulate_message(conversation_id, content):
    payload = {
        "conversationId": conversation_id,
        "content": content
    }
    
    print(f"User: {content}")
    try:
        response = requests.post(API_URL, json=payload, timeout=25)
        if response.status_code == 200:
            res_json = response.json()
            if "reply" in res_json:
                print(f"Bot : {res_json['reply']}")
            else:
                print(f"Bot : {res_json.get('message', 'No message')}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    print("-" * 40)

def main():
    print("Starting Simulation Tests...\n")
    for scenario in scenarios:
        print(f"=== {scenario['name']} ===")
        conv_id = str(uuid.uuid4())
        for msg in scenario['messages']:
            simulate_message(conv_id, msg)
            time.sleep(2)
        print("\n")

if __name__ == "__main__":
    main()
