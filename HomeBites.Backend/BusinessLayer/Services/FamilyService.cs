using BusinessLayer.DTOs;
using DataAccess.Entities;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Hosting;

namespace BusinessLayer.Services;

public interface IFamilyService
{
    Task<IEnumerable<FamilyListDto>> GetAllFamiliesAsync();
    Task<IEnumerable<FamilyListDto>> SearchFamiliesAsync(string? searchTerm);
    Task<FamilyDetailDto?> GetFamilyDetailsAsync(int id);
    Task<UpdateFamilyResponseDto?> UpdateFamilyProfileAsync(int id, UpdateFamilyRequest request);
}

public class FamilyService : IFamilyService
{
    private readonly IFamilyRepository _repository;
    private readonly PhotoService _photoService;
    private readonly IWebHostEnvironment _environment;

    public FamilyService(IFamilyRepository repository, PhotoService photoService, IWebHostEnvironment environment)
    {
        _repository = repository;
        _photoService = photoService;
        _environment = environment;
    }

    public async Task<IEnumerable<FamilyListDto>> GetAllFamiliesAsync()
    {
        var families = await _repository.GetAllAsync();
        return families.Select(MapToListDto);
    }

    public async Task<IEnumerable<FamilyListDto>> SearchFamiliesAsync(string? searchTerm)
    {
        var families = await _repository.SearchFamiliesAsync(searchTerm);
        return families.Select(MapToListDto);
    }

    public async Task<FamilyDetailDto?> GetFamilyDetailsAsync(int id)
    {
        var family = await _repository.GetFamilyWithDishesAsync(id);
        if (family == null) return null;

        return new FamilyDetailDto
        {
            Id = family.Id,
            Name = family.Name,
            Location = family.Location,
            Bio = family.Bio,
            ProfileImageUrl = family.ProfileImageUrl,
            WhatsAppNumber = family.WhatsAppNumber,
            Dishes = family.Dishes.Select(d => new DishDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                Price = d.Price,
                ImageUrl = d.ImageUrl,
                CategoryId = d.CategoryId,
                CategoryName = d.Category?.Name ?? string.Empty,
                FamilyId = family.Id,
                FamilyName = family.Name,
                WhatsAppNumber = family.WhatsAppNumber
            }).ToList()
        };
    }

    public async Task<UpdateFamilyResponseDto?> UpdateFamilyProfileAsync(int id, UpdateFamilyRequest request)
    {
        var family = await _repository.GetByIdAsync(id);
        if (family == null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name))
            family.Name = request.Name;

        if (!string.IsNullOrWhiteSpace(request.WhatsAppNumber))
            family.WhatsAppNumber = request.WhatsAppNumber;

        if (request.Location != null)
            family.Location = request.Location;

        if (request.Bio != null)
            family.Bio = request.Bio;

        if (request.ProfileImage != null && request.ProfileImage.Length > 0)
        {
            // Delete old profile image
            if (!string.IsNullOrEmpty(family.ProfileImageUrl))
            {
                var oldPath = Path.Combine(_environment.WebRootPath, family.ProfileImageUrl.TrimStart('/'));
                if (File.Exists(oldPath))
                    File.Delete(oldPath);
            }

            var newImageUrl = await _photoService.SavePhotoAsync(request.ProfileImage, "profiles");
            if (string.IsNullOrEmpty(newImageUrl))
                throw new Exception("Image upload failed.");

            family.ProfileImageUrl = newImageUrl;
        }

        _repository.Update(family);
        await _repository.SaveAsync();

        return new UpdateFamilyResponseDto
        {
            Id = family.Id,
            Name = family.Name,
            Location = family.Location,
            Bio = family.Bio,
            ProfileImageUrl = family.ProfileImageUrl,
            WhatsAppNumber = family.WhatsAppNumber
        };
    }

    private FamilyListDto MapToListDto(Family f)
    {
        return new FamilyListDto
        {
            Id = f.Id,
            Name = f.Name,
            Location = f.Location,
            Bio = f.Bio,
            ProfileImageUrl = f.ProfileImageUrl
        };
    }
}
