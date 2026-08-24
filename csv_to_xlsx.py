import pandas as pd

try:
    df = pd.read_csv('Merged_Suspicious_Report.csv')
    df.to_excel('Merged_Suspicious_Report.xlsx', index=False)
    print("Successfully converted to Merged_Suspicious_Report.xlsx")
except Exception as e:
    print(f"Error: {e}")
