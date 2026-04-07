using Microsoft.AspNetCore.Http;

namespace BusinessLayer.DTOs;

public class CreateDishRequest
{
    public IFormFile File { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int FamilyId { get; set; }
    public int CategoryId { get; set; }
}
