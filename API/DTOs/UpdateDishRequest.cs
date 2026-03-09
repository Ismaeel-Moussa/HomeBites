using Microsoft.AspNetCore.Http;

namespace API.DTOs;

public class UpdateDishRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? CategoryId { get; set; }

    // Optional: only provide if replacing the image
    public IFormFile? File { get; set; }
}
