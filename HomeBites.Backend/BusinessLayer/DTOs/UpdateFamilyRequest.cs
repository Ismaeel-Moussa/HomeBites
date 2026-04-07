using Microsoft.AspNetCore.Http;

namespace BusinessLayer.DTOs;

public class UpdateFamilyRequest
{
    public string? Name { get; set; }
    public string? WhatsAppNumber { get; set; }
    public string? Location { get; set; }
    public string? Bio { get; set; }

    // Optional: only provide if replacing the profile image
    public IFormFile? ProfileImage { get; set; }
}
