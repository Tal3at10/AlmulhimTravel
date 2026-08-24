namespace Core.Domain.Exceptions
{
    /// <summary>
    /// Base exception for all domain-specific exceptions
    /// </summary>
    public abstract class DomainException : Exception
    {
        protected DomainException(string message) : base(message)
        {
        }

        protected DomainException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }

    /// <summary>
    /// Exception thrown when an entity is not found
    /// </summary>
    public class EntityNotFoundException : DomainException
    {
        public EntityNotFoundException(string entityName, object key)
            : base($"{entityName} with key '{key}' was not found")
        {
        }

        public EntityNotFoundException(string message) : base(message)
        {
        }
    }

    /// <summary>
    /// Exception thrown when a business rule is violated
    /// </summary>
    public class BusinessRuleViolationException : DomainException
    {
        public BusinessRuleViolationException(string message) : base(message)
        {
        }

        public BusinessRuleViolationException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }

    /// <summary>
    /// Exception thrown when validation fails
    /// </summary>
    public class ValidationException : DomainException
    {
        public Dictionary<string, string[]> Errors { get; }

        public ValidationException(Dictionary<string, string[]> errors)
            : base("One or more validation errors occurred")
        {
            Errors = errors;
        }

        public ValidationException(string propertyName, string errorMessage)
            : base($"Validation failed for {propertyName}: {errorMessage}")
        {
            Errors = new Dictionary<string, string[]>
            {
                { propertyName, new[] { errorMessage } }
            };
        }
    }

    /// <summary>
    /// Exception thrown when a duplicate entity is detected
    /// </summary>
    public class DuplicateEntityException : DomainException
    {
        public DuplicateEntityException(string entityName, string propertyName, object value)
            : base($"{entityName} with {propertyName} '{value}' already exists")
        {
        }

        public DuplicateEntityException(string message) : base(message)
        {
        }
    }

    /// <summary>
    /// Exception thrown when insufficient resources are available
    /// </summary>
    public class InsufficientResourceException : DomainException
    {
        public InsufficientResourceException(string resourceName, int requested, int available)
            : base($"Insufficient {resourceName}. Requested: {requested}, Available: {available}")
        {
        }

        public InsufficientResourceException(string message) : base(message)
        {
        }
    }
}
