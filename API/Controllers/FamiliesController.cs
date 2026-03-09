using API.DTOs;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FamiliesController : ControllerBase
{
    private readonly AppDbContext _context;

    public FamiliesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/families
    // Returns a list of all home-based businesses
    [HttpGet]
    public async Task<IActionResult> GetAllFamilies()
    {
        var families = await _context.Families
            .Select(f => new FamilyListDto
            {
                Id = f.Id,
                Name = f.Name,
                Location = f.Location,
                Bio = f.Bio,
                ProfileImageUrl = f.ProfileImageUrl
            })
            .ToListAsync();

        return Ok(families);
    }

    // GET: api/families/{id}
    // Returns a specific family's profile and all their dishes
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFamilyDetails(int id)
    {
        var family = await _context.Families
            .Include(f => f.Dishes)
                .ThenInclude(d => d.Category)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (family == null) return NotFound("Family not found.");

        var dto = new FamilyDetailDto
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
                CategoryName = d.Category.Name,
                FamilyId = family.Id,
                FamilyName = family.Name,
                WhatsAppNumber = family.WhatsAppNumber
            }).ToList()
        };

        return Ok(dto);
    }

    // GET: api/families/search?q=sham
    // Searches families by name
    [HttpGet("search")]
    public async Task<IActionResult> SearchFamilies([FromQuery] string? q)
    {
        var query = _context.Families.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(f => f.Name.Contains(q));

        var results = await query
            .Select(f => new FamilyListDto
            {
                Id = f.Id,
                Name = f.Name,
                Location = f.Location,
                Bio = f.Bio,
                ProfileImageUrl = f.ProfileImageUrl
            })
            .ToListAsync();

        return Ok(results);
    }
}