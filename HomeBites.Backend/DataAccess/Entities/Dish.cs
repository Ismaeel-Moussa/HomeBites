using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public class Dish
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }

    // Foreign Keys
    public int FamilyId { get; set; }
    public Family Family { get; set; } = null!;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}