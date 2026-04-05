namespace API.DTOs;

public class FamilyListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Bio { get; set; }
    public string? ProfileImageUrl { get; set; }
}
