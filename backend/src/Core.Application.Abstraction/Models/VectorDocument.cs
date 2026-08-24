namespace Core.Application.Abstraction.Models;

public class VectorDocument
{
    public string Id { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public float[] Vector { get; set; } = Array.Empty<float>();
    public string Type { get; set; } = string.Empty; // e.g., "Package", "Visa", "Knowledge"
    public string ReferenceId { get; set; } = string.Empty; // e.g., PackageId
}
