using BusinessLayer.DTOs;
using DataAccess.Entities;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Hosting;

namespace BusinessLayer.Services;

public interface IDishService
{
    Task<IEnumerable<DishDto>> GetDishesAsync();
    Task<IEnumerable<DishDto>> SearchDishesAsync(string? q, int? categoryId);
    Task<Dish> CreateDishAsync(CreateDishRequest request);
    Task<Dish?> UpdateDishAsync(int id, UpdateDishRequest request);
    Task<bool> DeleteDishAsync(int id);
}

public class DishService : IDishService
{
    private readonly IDishRepository _repository;
    private readonly PhotoService _photoService;
    private readonly IWebHostEnvironment _environment;

    public DishService(IDishRepository repository, PhotoService photoService, IWebHostEnvironment environment)
    {
        _repository = repository;
        _photoService = photoService;
        _environment = environment;
    }

    public async Task<IEnumerable<DishDto>> GetDishesAsync()
    {
        var dishes = await _repository.GetDishesWithDetailsAsync();
        return dishes.Select(MapToDto);
    }

    public async Task<IEnumerable<DishDto>> SearchDishesAsync(string? q, int? categoryId)
    {
        var dishes = await _repository.SearchDishesAsync(q, categoryId);
        return dishes.Select(MapToDto);
    }

    public async Task<Dish> CreateDishAsync(CreateDishRequest request)
    {
        var imageUrl = await _photoService.SavePhotoAsync(request.File, "dishes");
        
        if (string.IsNullOrEmpty(imageUrl))
            throw new Exception("Image upload failed.");

        var dish = new Dish
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = imageUrl,
            FamilyId = request.FamilyId,
            CategoryId = request.CategoryId
        };

        await _repository.AddAsync(dish);
        await _repository.SaveAsync();
        return dish;
    }

    public async Task<Dish?> UpdateDishAsync(int id, UpdateDishRequest request)
    {
        var dish = await _repository.GetByIdAsync(id);
        if (dish == null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name))
            dish.Name = request.Name;

        if (request.Description != null)
            dish.Description = request.Description;

        if (request.Price.HasValue)
            dish.Price = request.Price.Value;

        if (request.CategoryId.HasValue)
            dish.CategoryId = request.CategoryId.Value;

        if (request.File != null && request.File.Length > 0)
        {
            // Delete old image
            DeleteImageFromDisk(dish.ImageUrl);

            var newImageUrl = await _photoService.SavePhotoAsync(request.File, "dishes");
            if (string.IsNullOrEmpty(newImageUrl))
                throw new Exception("Image upload failed.");
            
            dish.ImageUrl = newImageUrl;
        }

        _repository.Update(dish);
        await _repository.SaveAsync();
        return dish;
    }

    public async Task<bool> DeleteDishAsync(int id)
    {
        var dish = await _repository.GetByIdAsync(id);
        if (dish == null) return false;

        DeleteImageFromDisk(dish.ImageUrl);

        _repository.Delete(dish);
        await _repository.SaveAsync();
        return true;
    }

    private void DeleteImageFromDisk(string? imageUrl)
    {
        if (!string.IsNullOrEmpty(imageUrl))
        {
            var path = Path.Combine(_environment.WebRootPath, imageUrl.TrimStart('/'));
            if (File.Exists(path))
                File.Delete(path);
        }
    }

    private DishDto MapToDto(Dish d)
    {
        return new DishDto
        {
            Id = d.Id,
            Name = d.Name,
            Description = d.Description,
            Price = d.Price,
            ImageUrl = d.ImageUrl,
            CategoryId = d.CategoryId,
            CategoryName = d.Category?.Name ?? string.Empty,
            FamilyId = d.FamilyId,
            FamilyName = d.Family?.Name ?? string.Empty,
            FamilyProfileImageUrl = d.Family?.ProfileImageUrl,
            WhatsAppNumber = d.Family?.WhatsAppNumber ?? string.Empty
        };
    }
}
