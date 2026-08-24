$url = "http://localhost:5284/api/whatsapp/webhook"
function Send-Webhook {
    param ($convId, $text)
    $payload = "{ `"action`": `"message_create`", `"actor`": { `"actor_type`": `"user`" }, `"data`": { `"message`": { `"conversation_id`": `"$convId`", `"id`": `"$([Guid]::NewGuid())`", `"message_parts`": [ { `"text`": { `"content`": `"$text`" } } ] } } }"
    Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $payload | Out-Null
    Start-Sleep -Seconds 4
}
function Query-Replies {
    param ($convId)
    $query = "SELECT Content FROM WhatsAppMessages WHERE ConversationId = (SELECT Id FROM WhatsAppConversations WHERE FreshchatConversationId = '$convId') AND Direction = 1 ORDER BY SentAt ASC"
    $replies = Invoke-Sqlcmd -Query $query -ConnectionString "Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True" -QueryTimeout 30
    if ($replies) { foreach ($r in $replies) { Write-Host "BOT: $($r.Content)" } }
}

Write-Host "SCENARIO 1"
$c1 = "c1_" + [Guid]::NewGuid().ToString().Substring(0, 4)
Send-Webhook $c1 "السلام عليكم"
Send-Webhook $c1 "هل عندكم دفع أقساط عبر تابي أو تمارا؟"
Send-Webhook $c1 "ممتاز، طيب كم فرع عندكم بالضبط وفين أماكنها؟"
Query-Replies $c1

Write-Host "SCENARIO 2"
$c2 = "c2_" + [Guid]::NewGuid().ToString().Substring(0, 4)
Send-Webhook $c2 "00"
Send-Webhook $c2 "3"
Send-Webhook $c2 "5"
Send-Webhook $c2 "99"
Send-Webhook $c2 "طيب كم بتاخذ وقت؟"
Query-Replies $c2

Write-Host "SCENARIO 3"
$c3 = "c3_" + [Guid]::NewGuid().ToString().Substring(0, 4)
Send-Webhook $c3 "00"
Send-Webhook $c3 "أبي احجز لتركيا شخصين لمدة اسبوع"
Send-Webhook $c3 "التاريخ من 1 اغسطس لـ 8 اغسطس"
Send-Webhook $c3 "يعطيكم العافية"
Query-Replies $c3

Write-Host "SCENARIO 4"
$c4 = "c4_" + [Guid]::NewGuid().ToString().Substring(0, 4)
Send-Webhook $c4 "كيف حالك؟"
Send-Webhook $c4 "وين موقعكم؟"
Query-Replies $c4
