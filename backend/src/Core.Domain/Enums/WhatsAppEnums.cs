namespace Core.Domain.Enums
{
    public enum ConversationMode
    {
        Bot = 0,
        Human = 1,
        Closed = 2
    }

    public enum MessageDirection
    {
        Inbound = 0,  // From Customer to System
        Outbound = 1  // From System to Customer
    }

    public enum MessageSender
    {
        Customer = 0,
        Bot = 1,
        Human = 2
    }
}
