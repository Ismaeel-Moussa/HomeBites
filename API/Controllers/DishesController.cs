using API.DTOs;
using DataAccess;
using DataAccess.Entities;
using BusinessLayer.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PhotoService _photoService;
    private readonly IWebHostEnvironment _environment;

    public DishesController(AppDbContext context, PhotoService photoService, IWebHostEnvironment environment)
    {
        _context = context;
        _photoService = photoService;
        _environment = environment;
    }

    // GET: api/dishes
    // Returns all dishes with category and family info
    [HttpGet]
    public async Task<IActionResult> GetDishes()
    {
        var dishes = await _context.Dishes
            .Include(d => d.Category)
            .Include(d => d.Family)
            .Select(d => new DishDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                Price = d.Price,
                ImageUrl = d.ImageUrl,
                CategoryId = d.CategoryId,
                CategoryName = d.Category.Name,
                FamilyId = d.FamilyId,
                FamilyName = d.Family.Name,
                WhatsAppNumber = d.Family.WhatsAppNumber
            })
            .ToListAsync();

        return Ok(dishes);
    }

    // GET: api/dishes/search?q=kibbeh&category=3
    // Searches dishes by name (optional) and filters by category (optional)
    [HttpGet("search")]
    public async Task<IActionResult> SearchDishes([FromQuery] string? q, [FromQuery] int? category)
    {
        var query = _context.Dishes
            .Include(d => d.Category)
            .Include(d => d.Family)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(d => d.Name.Contains(q) || (d.Description != null && d.Description.Contains(q)));

        if (category.HasValue)
            query = query.Where(d => d.CategoryId == category.Value);

        var results = await query
            .Select(d => new DishDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                Price = d.Price,
                ImageUrl = d.ImageUrl,
                CategoryId = d.CategoryId,
                CategoryName = d.Category.Name,
                FamilyId = d.FamilyId,
                FamilyName = d.Family.Name,
                WhatsAppNumber = d.Family.WhatsAppNumber
            })
            .ToListAsync();

        return Ok(results);
    }

    // POST: api/dishes
    // Creates a new dish with an uploaded image
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateDish([FromForm] CreateDishRequest request)
    {
        // 1. Save image using Business Layer
        var imageUrl = await _photoService.SavePhotoAsync(request.File, "dishes");

        if (string.IsNullOrEmpty(imageUrl)) return BadRequest("Image upload failed.");

        // 2. Create the entity
        var dish = new Dish
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = imageUrl,
            FamilyId = request.FamilyId,
            CategoryId = request.CategoryId
        };

        // 3. Save to Database
        _context.Dishes.Add(dish);
        await _context.SaveChangesAsync();

        return Ok(dish);
    }

    // PUT: api/dishes/{id}
    // Updates an existing dish. All fields are optional — only provided fields are changed.
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateDish(int id, [FromForm] UpdateDishRequest request)
    {
        var dish = await _context.Dishes.FindAsync(id);
        if (dish == null) return NotFound("Dish not found.");

        // Apply updates only for fields that were provided
        if (!string.IsNullOrWhiteSpace(request.Name))
            dish.Name = request.Name;

        if (request.Description != null)
            dish.Description = request.Description;

        if (request.Price.HasValue)
            dish.Price = request.Price.Value;

        if (request.CategoryId.HasValue)
            dish.CategoryId = request.CategoryId.Value;

        // Replace image if a new file was uploaded
        if (request.File != null && request.File.Length > 0)
        {
            // Delete old image from disk
            if (!string.IsNullOrEmpty(dish.ImageUrl))
            {
                var oldPath = Path.Combine(_environment.WebRootPath, dish.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldPath))
                    System.IO.File.Delete(oldPath);
            }

            var newImageUrl = await _photoService.SavePhotoAsync(request.File, "dishes");
            if (string.IsNullOrEmpty(newImageUrl)) return BadRequest("Image upload failed.");
            dish.ImageUrl = newImageUrl;
        }

        await _context.SaveChangesAsync();
        return Ok(dish);
    }

    // DELETE: api/dishes/{id}
    // Deletes a dish and removes its image from disk
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDish(int id)
    {
        var dish = await _context.Dishes.FindAsync(id);
        if (dish == null) return NotFound("Dish not found.");

        // Remove image file from disk
        if (!string.IsNullOrEmpty(dish.ImageUrl))
        {
            var imagePath = Path.Combine(_environment.WebRootPath, dish.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }

        _context.Dishes.Remove(dish);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}