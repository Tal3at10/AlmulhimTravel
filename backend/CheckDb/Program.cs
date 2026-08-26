using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;

Console.OutputEncoding = System.Text.Encoding.UTF8;

var connString = "Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True;";

var convIds = new[]
{
    "239a6af6-7e8b-49bb-b956-f5e5edc2d63b",
    "3b87722a-1992-41ba-853b-9517ff3580d0",
    "dd05c9f4-a6af-479a-bd80-de8c2a32dc4c",
    "e202560b-088e-43ac-8ffc-f04e21239ea5",
    "ac79cc8e-7ee6-45ec-8724-cbfd5face776",
    "09ac14ec-fd45-41aa-9c80-6c1a7efe388a",
    "94e9ed7f-125d-439c-8d3b-1caf4dc338cc",
    "7510a13d-e35e-451a-86b4-bf484ff2c1e4",
    "c66c014a-5f22-47e8-a785-0434eb67d7e4",
    "bc0564a3-755d-413b-ab06-bd8523d6e478"
};

var idList = string.Join("','", convIds);
var query = $"SELECT Id, CustomerPhone, CustomerName, StartedAt, FreshchatConversationId FROM WhatsAppConversations WHERE Id IN ('{idList}')";

using (var conn = new SqlConnection(connString))
{
    conn.Open();
    using var cmd = new SqlCommand(query, conn);
    using var reader = cmd.ExecuteReader();
    
    while (reader.Read())
    {
        var id = reader["Id"].ToString();
        var phone = reader["CustomerPhone"]?.ToString();
        var name = reader["CustomerName"]?.ToString();
        var startedAt = reader["StartedAt"]?.ToString();
        var freshchatId = reader["FreshchatConversationId"]?.ToString();
        
        Console.WriteLine($"ConvId: {id} | Phone: {phone} | Name: {name} | StartedAt: {startedAt} | Freshchat: {freshchatId}");
    }
}







