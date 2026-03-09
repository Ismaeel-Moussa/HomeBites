using API.DTOs;
using DataAccess;
using DataAccess.Entities;
using BusinessLayer.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PhotoService _photoService;

    public DishesController(AppDbContext context, PhotoService photoService)
    {
        _context = context;
        _photoService = photoService;
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
}