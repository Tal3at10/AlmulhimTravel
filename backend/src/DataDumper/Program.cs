using System;
using Microsoft.Data.SqlClient;

class Program
{
    static void Main()
    {
        string conn = "Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True;";
        using (SqlConnection c = new SqlConnection(conn))
        {
            c.Open();
            var cmd1 = new SqlCommand("SELECT COUNT(*) FROM WhatsAppConversations WHERE StartedAt >= '2026-07-08'", c);
            var cmd2 = new SqlCommand("SELECT COUNT(*) FROM WhatsAppConversations WHERE StartedAt >= '2026-08-07'", c);
            var cmd3 = new SqlCommand("SELECT MIN(StartedAt), MAX(StartedAt) FROM WhatsAppConversations", c);
            
            Console.WriteLine($"Total >= July 8: {cmd1.ExecuteScalar()}");
            Console.WriteLine($"Total >= Aug 7: {cmd2.ExecuteScalar()}");
            
            using(var r = cmd3.ExecuteReader()){
                if(r.Read()){
                    Console.WriteLine($"Min Date: {r[0]} | Max Date: {r[1]}");
                }
            }
        }
    }
}
