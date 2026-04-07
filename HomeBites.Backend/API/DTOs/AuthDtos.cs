namespace API.DTOs;

public class RegisterFamilyRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string WhatsAppNumber { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Bio { get; set; }
    public string? ProfileImageUrl { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

