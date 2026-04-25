using DataAccess.Entities;
using DataAccess.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace DataAccess;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Family> Families { get; set; }
    public DbSet<Dish> Dishes { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Family>()
            .HasOne(f => f.User)
            .WithOne(u => u.Family)
            .HasForeignKey<Family>(f => f.UserId);

        modelBuilder.Entity<Dish>()
            .Property(d => d.Price)
            .HasPrecision(18, 2);

        SeedInitialData(modelBuilder);
    }

    private void SeedInitialData(ModelBuilder modelBuilder)
    {
        // Roles
        var familyRole = new ApplicationRole
        {
            Id = 1,
            Name = "Family",
            NormalizedName = "FAMILY",
            ConcurrencyStamp = "1"
        };

        var customerRole = new ApplicationRole
        {
            Id = 2,
            Name = "Customer",
            NormalizedName = "CUSTOMER",
            ConcurrencyStamp = "2"
        };

        var adminRole = new ApplicationRole
        {
            Id = 3,
            Name = "Admin",
            NormalizedName = "ADMIN",
            ConcurrencyStamp = "3"
        };

        modelBuilder.Entity<ApplicationRole>().HasData(familyRole, customerRole, adminRole);

        // Users (password hashes hardcoded for deterministic seeding)
        var familyUser1 = new ApplicationUser
        {
            Id = 1,
            UserName = "family1@homebites.test",
            NormalizedUserName = "FAMILY1@HOMEBITES.TEST",
            Email = "family1@homebites.test",
            NormalizedEmail = "FAMILY1@HOMEBITES.TEST",
            EmailConfirmed = true,
            UserType = UserType.Family,
            SecurityStamp = "SEC-STAMP-1",
            ConcurrencyStamp = "CONC-STAMP-1",
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnabled = false,
            AccessFailedCount = 0,
            PasswordHash = "AQAAAAIAAYagAAAAEPwvwfU5ZE23+bFoi0kK8vBrvyXTnCgpgoCFvrl3dL6LNL8YQWuaTAFk28CSaUEqdw=="
        };

        var familyUser2 = new ApplicationUser
        {
            Id = 2,
            UserName = "family2@homebites.test",
            NormalizedUserName = "FAMILY2@HOMEBITES.TEST",
            Email = "family2@homebites.test",
            NormalizedEmail = "FAMILY2@HOMEBITES.TEST",
            EmailConfirmed = true,
            UserType = UserType.Family,
            SecurityStamp = "SEC-STAMP-2",
            ConcurrencyStamp = "CONC-STAMP-2",
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnabled = false,
            AccessFailedCount = 0,
            PasswordHash = "AQAAAAIAAYagAAAAEPwvwfU5ZE23+bFoi0kK8vBrvyXTnCgpgoCFvrl3dL6LNL8YQWuaTAFk28CSaUEqdw=="
        };

        var familyUser3 = new ApplicationUser
        {
            Id = 3,
            UserName = "family3@homebites.test",
            NormalizedUserName = "FAMILY3@HOMEBITES.TEST",
            Email = "family3@homebites.test",
            NormalizedEmail = "FAMILY3@HOMEBITES.TEST",
            EmailConfirmed = true,
            UserType = UserType.Family,
            SecurityStamp = "SEC-STAMP-3",
            ConcurrencyStamp = "CONC-STAMP-3",
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnabled = false,
            AccessFailedCount = 0,
            PasswordHash = "AQAAAAIAAYagAAAAEPwvwfU5ZE23+bFoi0kK8vBrvyXTnCgpgoCFvrl3dL6LNL8YQWuaTAFk28CSaUEqdw=="
        };

        var familyUser4 = new ApplicationUser
        {
            Id = 4,
            UserName = "family4@homebites.test",
            NormalizedUserName = "FAMILY4@HOMEBITES.TEST",
            Email = "family4@homebites.test",
            NormalizedEmail = "FAMILY4@HOMEBITES.TEST",
            EmailConfirmed = true,
            UserType = UserType.Family,
            SecurityStamp = "SEC-STAMP-4",
            ConcurrencyStamp = "CONC-STAMP-4",
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnabled = false,
            AccessFailedCount = 0,
            PasswordHash = "AQAAAAIAAYagAAAAEHIsl1bRy51jouxwrUOXCspQJvpodAgNdJjasSgkv3Uklh48s/F8X5eTMNiV7mFmwg=="
        };

        modelBuilder.Entity<ApplicationUser>().HasData(familyUser1, familyUser2, familyUser3, familyUser4);

        // User roles
        modelBuilder.Entity<IdentityUserRole<int>>().HasData(
            new IdentityUserRole<int> { UserId = familyUser1.Id, RoleId = familyRole.Id },
            new IdentityUserRole<int> { UserId = familyUser2.Id, RoleId = familyRole.Id },
            new IdentityUserRole<int> { UserId = familyUser3.Id, RoleId = familyRole.Id },
            new IdentityUserRole<int> { UserId = familyUser4.Id, RoleId = familyRole.Id }
        );

        // Families
        modelBuilder.Entity<Family>().HasData(
            new Family
            {
                Id = 1,
                Name = "Ahmed Family Kitchen",
                WhatsAppNumber = "+201000000001",
                Location = "Cairo",
                Bio = "Traditional Egyptian home-cooked meals.",
                ProfileImageUrl = null,
                KitchenCategory = "Traditional",
                UserId = familyUser1.Id
            },
            new Family
            {
                Id = 2,
                Name = "Hassan Home Bites",
                WhatsAppNumber = "+201000000002",
                Location = "Alexandria",
                Bio = "Seafood specials from our family to yours.",
                ProfileImageUrl = null,
                KitchenCategory = "Grill",
                UserId = familyUser2.Id
            },
            new Family
            {
                Id = 3,
                Name = "Fatima's Sweet Corner",
                WhatsAppNumber = "+201000000003",
                Location = "Giza",
                Bio = "Homemade desserts and baked goods.",
                ProfileImageUrl = null,
                KitchenCategory = "Bakery",
                UserId = familyUser3.Id
            },
            new Family
            {
                Id = 4,
                Name = "Samir's Grill House",
                WhatsAppNumber = "+201000000004",
                Location = "Mansoura",
                Bio = "Grilled meats and hearty mains.",
                ProfileImageUrl = null,
                KitchenCategory = "Grill",
                UserId = familyUser4.Id
            }
        );

        // Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Mains" },
            new Category { Id = 2, Name = "Desserts" },
            new Category { Id = 3, Name = "Drinks" },
            new Category { Id = 4, Name = "Appetizers" }
        );

        // Dishes (20 total)
        modelBuilder.Entity<Dish>().HasData(
            // Family 1 - Mains & Appetizers
            new Dish { Id = 1, Name = "Molokhia with Rice", Description = "Classic Molokhia served with white rice.", Price = 80m, ImageUrl = null, FamilyId = 1, CategoryId = 1 },
            new Dish { Id = 2, Name = "Stuffed Vine Leaves", Description = "Warak enab stuffed with rice and herbs.", Price = 70m, ImageUrl = null, FamilyId = 1, CategoryId = 4 },
            new Dish { Id = 3, Name = "Koshari Plate", Description = "Lentils, pasta, rice with spicy sauce.", Price = 60m, ImageUrl = null, FamilyId = 1, CategoryId = 1 },
            new Dish { Id = 4, Name = "Lentil Soup", Description = "Warm Egyptian lentil soup.", Price = 40m, ImageUrl = null, FamilyId = 1, CategoryId = 4 },
            new Dish { Id = 5, Name = "Grilled Chicken with Rice", Description = "Marinated grilled chicken with rice.", Price = 95m, ImageUrl = null, FamilyId = 1, CategoryId = 1 },

            // Family 2 - Seafood
            new Dish { Id = 6, Name = "Grilled Sea Bass", Description = "Fresh sea bass grilled with herbs.", Price = 150m, ImageUrl = null, FamilyId = 2, CategoryId = 1 },
            new Dish { Id = 7, Name = "Fried Calamari", Description = "Crispy fried calamari rings.", Price = 110m, ImageUrl = null, FamilyId = 2, CategoryId = 4 },
            new Dish { Id = 8, Name = "Shrimp Tagine", Description = "Shrimp cooked in clay pot with veggies.", Price = 140m, ImageUrl = null, FamilyId = 2, CategoryId = 1 },
            new Dish { Id = 9, Name = "Fish Soup", Description = "Rich seafood soup.", Price = 65m, ImageUrl = null, FamilyId = 2, CategoryId = 4 },
            new Dish { Id = 10, Name = "Lemon Mint Juice", Description = "Fresh lemon mint drink.", Price = 30m, ImageUrl = null, FamilyId = 2, CategoryId = 3 },

            // Family 3 - Desserts
            new Dish { Id = 11, Name = "Basbousa", Description = "Traditional semolina cake with syrup.", Price = 45m, ImageUrl = null, FamilyId = 3, CategoryId = 2 },
            new Dish { Id = 12, Name = "Kunafa with Cream", Description = "Crispy kunafa filled with cream.", Price = 55m, ImageUrl = null, FamilyId = 3, CategoryId = 2 },
            new Dish { Id = 13, Name = "Rice Pudding", Description = "Creamy rice pudding with nuts.", Price = 35m, ImageUrl = null, FamilyId = 3, CategoryId = 2 },
            new Dish { Id = 14, Name = "Baklava", Description = "Layers of filo with nuts and syrup.", Price = 60m, ImageUrl = null, FamilyId = 3, CategoryId = 2 },
            new Dish { Id = 15, Name = "Turkish Coffee", Description = "Strong Turkish-style coffee.", Price = 25m, ImageUrl = null, FamilyId = 3, CategoryId = 3 },

            // Family 4 - Grills
            new Dish { Id = 16, Name = "Mixed Grill Platter", Description = "Kebab, kofta, and shish tawook.", Price = 180m, ImageUrl = null, FamilyId = 4, CategoryId = 1 },
            new Dish { Id = 17, Name = "Kofta with Tahini", Description = "Grilled kofta served with tahini sauce.", Price = 120m, ImageUrl = null, FamilyId = 4, CategoryId = 1 },
            new Dish { Id = 18, Name = "Chicken Wings", Description = "Spicy grilled chicken wings.", Price = 90m, ImageUrl = null, FamilyId = 4, CategoryId = 4 },
            new Dish { Id = 19, Name = "Fattoush Salad", Description = "Fresh salad with toasted bread.", Price = 50m, ImageUrl = null, FamilyId = 4, CategoryId = 4 },
            new Dish { Id = 20, Name = "Fresh Hibiscus Drink", Description = "Cold karkade drink.", Price = 30m, ImageUrl = null, FamilyId = 4, CategoryId = 3 }
        );
    }
}