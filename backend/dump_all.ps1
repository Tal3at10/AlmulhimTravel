$connString = "Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True;"
$query = @"
SELECT 
    c.Id as ConvId,
    c.FreshchatConversationId,
    c.CustomerName,
    c.StartedAt,
    c.Mode,
    c.Notes,
    m.Content,
    m.SentAt,
    m.SenderType,
    m.Direction
FROM WhatsAppConversations c
LEFT JOIN WhatsAppMessages m ON c.Id = m.ConversationId
ORDER BY c.StartedAt DESC, m.SentAt ASC
"@

$conn = New-Object System.Data.SqlClient.SqlConnection($connString)
$cmd = $conn.CreateCommand()
$cmd.CommandText = $query
$conn.Open()
$reader = $cmd.ExecuteReader()
$results = @()
while ($reader.Read()) {
    $results += @{
        ConvId = $reader["ConvId"].ToString()
        FreshchatId = $reader["FreshchatConversationId"].ToString()
        Name = $reader["CustomerName"].ToString()
        StartedAt = $reader["StartedAt"].ToString()
        Mode = $reader["Mode"].ToString()
        Notes = $reader["Notes"].ToString()
        Content = $reader["Content"].ToString()
        SentAt = $reader["SentAt"].ToString()
        SenderType = $reader["SenderType"].ToString()
        Direction = $reader["Direction"].ToString()
    }
}
$conn.Close()
$results | ConvertTo-Json -Depth 5 > e:\Projects\AlMulhim-Travel\backend\convs_all.json
