using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public interface IFamilyRepository : IGenericRepository<Family>
{
    Task<Family?> GetFamilyWithDishesAsync(int id);
    Task<IEnumerable<Family>> SearchFamiliesAsync(string? searchTerm);
    Task<IEnumerable<Family>> GetFamiliesByCategoryAsync(string? category);
}

public class FamilyRepository : GenericRepository<Family>, IFamilyRepository
{
    public FamilyRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Family?> GetFamilyWithDishesAsync(int id)
    {
        return await _dbSet
            .Include(f => f.Dishes)
                .ThenInclude(d => d.Category)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<Family>> SearchFamiliesAsync(string? searchTerm)
    {
        var query = _dbSet.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(f => f.Name.Contains(searchTerm));
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Family>> GetFamiliesByCategoryAsync(string? category)
    {
        var query = _dbSet.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(f => f.KitchenCategory == category);
        }

        return await query.ToListAsync();
    }
}
