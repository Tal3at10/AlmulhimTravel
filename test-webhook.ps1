$url = "http://localhost:5284/api/whatsapp/webhook"

function Send-Webhook {
    param ($action, $payloadJson)
    Write-Host "Sending $action webhook..."
    Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $payloadJson
    Start-Sleep -Seconds 4
}

$convId = "conv_" + [Guid]::NewGuid().ToString().Substring(0, 8)

# 1. message_create ("start")
$msg1 = @"
{
  "action": "message_create",
  "actor": { "actor_type": "user" },
  "data": {
    "message": {
      "conversation_id": "$convId",
      "id": "msg_1",
      "message_parts": [ { "text": { "content": "start" } } ]
    }
  }
}
"@
Send-Webhook "message_create (start)" $msg1

# 2. Assign to Human
$assign = @"
{
  "action": "conversation_assignment",
  "data": {
    "conversation_id": "$convId"
  }
}
"@
Send-Webhook "conversation_assignment" $assign

# 3. Resolve (Back to Bot)
$resolve = @"
{
  "action": "conversation_resolution",
  "data": {
    "resolve": {
        "conversation": {
            "conversation_id": "$convId"
        }
    }
  }
}
"@
Send-Webhook "conversation_resolution" $resolve

# 4. message_create ("3")
$msg2 = @"
{
  "action": "message_create",
  "actor": { "actor_type": "user" },
  "data": {
    "message": {
      "conversation_id": "$convId",
      "id": "msg_2",
      "message_parts": [ { "text": { "content": "3" } } ]
    }
  }
}
"@
Send-Webhook "message_create (3)" $msg2

Write-Host "Done!"
