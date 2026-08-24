import re
import csv
import html

with open('Merged_Suspicious_Report_files/sheet001.htm', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract table
table_match = re.search(r'<table[^>]*>(.*?)</table>', content, re.IGNORECASE | re.DOTALL)
if table_match:
    table_html = table_match.group(1)
    
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
    
    with open('Merged_Suspicious_Report.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
        writer = csv.writer(csvfile)
        
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.IGNORECASE | re.DOTALL)
            row_data = []
            for cell in cells:
                # Remove inner html tags
                text = re.sub(r'<[^>]+>', '', cell)
                text = text.replace('&nbsp;', ' ')
                text = html.unescape(text)
                text = text.strip()
                row_data.append(text)
            writer.writerow(row_data)
            
    print("Successfully converted to Merged_Suspicious_Report.csv")
else:
    print("Table not found in HTML.")
