namespace BusinessLayer.DTOs;

public class FamilyDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Bio { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string WhatsAppNumber { get; set; } = string.Empty;
    public string? KitchenCategory { get; set; }
    public List<DishDto> Dishes { get; set; } = new();
}
