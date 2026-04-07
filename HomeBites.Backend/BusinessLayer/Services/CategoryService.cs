using DataAccess.Entities;
using DataAccess.Repositories;
using System.Linq;

namespace BusinessLayer.Services;

public interface ICategoryService
{
    Task<IEnumerable<object>> GetCategoriesForDropdownAsync();
}

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<object>> GetCategoriesForDropdownAsync()
    {
        var categories = await _repository.GetCategoriesForDropdownAsync();
        return categories.Select(c => new { c.Id, c.Name });
    }
}
