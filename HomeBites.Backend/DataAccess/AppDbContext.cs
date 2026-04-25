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
        modelBuilder.Entity<ApplicationRole>().HasData(
            new ApplicationRole { Id = 1, Name = "Family", NormalizedName = "FAMILY", ConcurrencyStamp = "1" },
            new ApplicationRole { Id = 2, Name = "Customer", NormalizedName = "CUSTOMER", ConcurrencyStamp = "2" },
            new ApplicationRole { Id = 3, Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "3" }
        );

        // Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Mains" },
            new Category { Id = 2, Name = "Desserts" },
            new Category { Id = 3, Name = "Drinks" },
            new Category { Id = 4, Name = "Appetizers" }
        );
    }
}