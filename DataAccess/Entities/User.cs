using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public class User
{
    [Key]
    public int Id { get; set; }
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;

    // 1-to-1: A user has one family profile
    public Family? Family { get; set; }
}