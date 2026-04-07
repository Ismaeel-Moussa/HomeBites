using System.ComponentModel.DataAnnotations;
using DataAccess.Identity;

namespace DataAccess.Entities;

public class Family
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WhatsAppNumber { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Bio {  get; set; }
    public string? ProfileImageUrl { get; set; }

    // Foreign Key to Identity User
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    // 1-to-Many: A family has many dishes
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
}