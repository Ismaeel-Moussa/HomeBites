using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public interface IDishRepository : IGenericRepository<Dish>
{
    Task<IEnumerable<Dish>> GetDishesWithDetailsAsync();
    Task<IEnumerable<Dish>> SearchDishesAsync(string? searchTerm, int? categoryId);
}

public class DishRepository : GenericRepository<Dish>, IDishRepository
{
    public DishRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Dish>> GetDishesWithDetailsAsync()
    {
        return await _dbSet
            .Include(d => d.Category)
            .Include(d => d.Family)
            .ToListAsync();
    }

    public async Task<IEnumerable<Dish>> SearchDishesAsync(string? searchTerm, int? categoryId)
    {
        var query = _dbSet
            .Include(d => d.Category)
            .Include(d => d.Family)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(d => d.Name.Contains(searchTerm) || (d.Description != null && d.Description.Contains(searchTerm)));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(d => d.CategoryId == categoryId.Value);
        }

        return await query.ToListAsync();
    }
}
