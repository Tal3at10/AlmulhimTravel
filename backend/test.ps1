$body = Get-Content -Path 'e:\Projects\AlMulhim-Travel\backend\test.json' -Raw -Encoding UTF8
$response = Invoke-RestMethod -Uri 'http://localhost:5001/api/whatsapp/webhook/simulate' -Method Post -Body $body -ContentType 'application/json; charset=utf-8'
$response | ConvertTo-Json
