$convs = @( "c1_", "c2_", "c3_", "c4_" )
$cs = "Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True"

foreach ($c in $convs) {
    Write-Host "`n=== CHAT FOR $c ==="
    $query = @"
        SELECT M.Direction, M.Content, M.SentAt 
        FROM WhatsAppMessages M 
        JOIN WhatsAppConversations C ON M.ConversationId = C.Id
        WHERE C.FreshchatConversationId LIKE '$c%'
        ORDER BY M.SentAt ASC
"@
    
    $res = Invoke-Sqlcmd -Query $query -ConnectionString $cs -QueryTimeout 30
    if ($res) {
        foreach ($r in $res) {
            $prefix = if ($r.Direction -eq 1) { "BOT: " } else { "USR: " }
            Write-Host "$prefix $($r.Content)"
            Write-Host "----------------"
        }
    } else {
        Write-Host "(No messages found)"
    }
}
