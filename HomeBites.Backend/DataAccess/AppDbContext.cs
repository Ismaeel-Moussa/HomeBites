using DataAccess.Entities;
using DataAccess.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace DataAccess;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
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

        // --- 1. SEED CATEGORIES  ---
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Main Dishes" },
            new Category { Id = 2, Name = "Sweets" },
            new Category { Id = 3, Name = "Appetizers" },
            new Category { Id = 4, Name = "Bakery" }
        );

        // --- 2. SEED FAMILIES ---
        modelBuilder.Entity<Family>().HasData(
            new Family
            {
                Id = 1,
                UserId = 1,
                Name = "Sham Kitchen",
                WhatsAppNumber = "+905311111111",
                Location = "Fatih, Istanbul",
                Bio = "Authentic Syrian home-cooked meals prepared with love in Istanbul.",
                ProfileImageUrl = "/images/profiles/sham_kitchen.jpg"
            },
            new Family
            {
                Id = 2,
                UserId = 2,
                Name = "Iraqi Flavors",
                WhatsAppNumber = "+905322222222",
                Location = "Esenyurt, Istanbul",
                Bio = "The best Mansaf, Mandi, and traditional Iraqi dishes in the city.",
                ProfileImageUrl = "/images/profiles/iraqi_flavors.jpg"
            }
        );

        
        modelBuilder.Entity<Dish>().HasData(
            // Sham Kitchen (Family 1)
            new Dish { Id = 1, FamilyId = 1, CategoryId = 1, Name = "Chicken Oozi", Description = "Slow-cooked whole chicken on a bed of spiced rice with nuts and raisins.", Price = 250.00m, ImageUrl = "/images/dishes/oozi.jpg" },
            new Dish { Id = 2, FamilyId = 1, CategoryId = 3, Name = "Fried Kibbeh", Description = "Crispy bulgur shells stuffed with seasoned ground beef, onions, and pine nuts.", Price = 150.00m, ImageUrl = "/images/dishes/kibbeh.jpg" },
            new Dish { Id = 3, FamilyId = 1, CategoryId = 2, Name = "Basbousa", Description = "Soft semolina cake soaked in rose-water syrup, topped with almonds.", Price = 100.00m, ImageUrl = "/images/dishes/basbousa.jpg" },

            // Iraqi Flavors (Family 2)
            new Dish { Id = 4, FamilyId = 2, CategoryId = 1, Name = "Lamb Mandi", Description = "Tender slow-roasted lamb over fragrant basmati rice cooked in a tandoor oven.", Price = 350.00m, ImageUrl = "/images/dishes/mandi.jpg" },
            new Dish { Id = 5, FamilyId = 2, CategoryId = 4, Name = "Samoon Bread", Description = "Traditional diamond-shaped Iraqi bread, fresh out of the oven — fluffy inside, crispy outside.", Price = 20.00m, ImageUrl = "/images/dishes/samoon.jpg" },
            new Dish { Id = 6, FamilyId = 2, CategoryId = 1, Name = "Baghdadi Dolma", Description = "Grape leaves and vegetables stuffed with spiced rice and minced meat, cooked in tomato broth.", Price = 300.00m, ImageUrl = "/images/dishes/dolma.jpg" }
        );
    }
}