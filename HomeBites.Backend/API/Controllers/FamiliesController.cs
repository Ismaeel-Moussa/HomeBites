using API.DTOs;
using DataAccess;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BusinessLayer.Services;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FamiliesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PhotoService _photoService;
    private readonly IWebHostEnvironment _environment;

    public FamiliesController(AppDbContext context, PhotoService photoService, IWebHostEnvironment environment)
    {
        _context = context;
        _photoService = photoService;
        _environment = environment;
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

    // PUT: api/families/{id}
    // Updates a family's profile. All fields are optional — only provided fields are changed.
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateFamilyProfile(int id, [FromForm] UpdateFamilyRequest request)
    {
        var family = await _context.Families.FindAsync(id);
        if (family == null) return NotFound("Family not found.");

        // Apply updates only for fields that were provided
        if (!string.IsNullOrWhiteSpace(request.Name))
            family.Name = request.Name;

        if (!string.IsNullOrWhiteSpace(request.WhatsAppNumber))
            family.WhatsAppNumber = request.WhatsAppNumber;

        if (request.Location != null)
            family.Location = request.Location;

        if (request.Bio != null)
            family.Bio = request.Bio;

        // Replace profile image if a new file was uploaded
        if (request.ProfileImage != null && request.ProfileImage.Length > 0)
        {
            // Delete old profile image from disk
            if (!string.IsNullOrEmpty(family.ProfileImageUrl))
            {
                var oldPath = Path.Combine(_environment.WebRootPath, family.ProfileImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldPath))
                    System.IO.File.Delete(oldPath);
            }

            var newImageUrl = await _photoService.SavePhotoAsync(request.ProfileImage, "profiles");
            if (string.IsNullOrEmpty(newImageUrl)) return BadRequest("Image upload failed.");
            family.ProfileImageUrl = newImageUrl;
        }

        await _context.SaveChangesAsync();
        return Ok(family);
    }
}