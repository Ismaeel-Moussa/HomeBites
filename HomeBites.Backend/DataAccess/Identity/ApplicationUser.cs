using DataAccess.Entities;
using Microsoft.AspNetCore.Identity;

namespace DataAccess.Identity;

public enum UserType
{
    Family = 1,
    Customer = 2,
    Admin = 3
}

public class ApplicationUser : IdentityUser
{
    public UserType UserType { get; set; } = UserType.Family;

    // 1-to-1: A user has one family profile
    public Family? Family { get; set; }
}

