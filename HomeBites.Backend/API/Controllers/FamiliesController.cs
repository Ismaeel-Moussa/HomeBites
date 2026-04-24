using BusinessLayer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer.Services;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FamiliesController : ControllerBase
{
    private readonly IFamilyService _familyService;

    public FamiliesController(IFamilyService familyService)
    {
        _familyService = familyService;
    }

    // GET: api/families
    // GET: api/families?category=Traditional
    [HttpGet]
    public async Task<IActionResult> GetAllFamilies([FromQuery] string? category)
    {
        if (!string.IsNullOrWhiteSpace(category))
        {
            var filtered = await _familyService.GetFamiliesByCategoryAsync(category);
            return Ok(filtered);
        }

        var families = await _familyService.GetAllFamiliesAsync();
        return Ok(families);
    }

    // GET: api/families/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFamilyDetails(int id)
    {
        var dto = await _familyService.GetFamilyDetailsAsync(id);
        if (dto == null) return NotFound("Family not found.");
        return Ok(dto);
    }

    // GET: api/families/search?q=sham
    [HttpGet("search")]
    public async Task<IActionResult> SearchFamilies([FromQuery] string? q)
    {
        var results = await _familyService.SearchFamiliesAsync(q);
        return Ok(results);
    }

    // PUT: api/families/{id}
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "FamilyOnly")]
    public async Task<IActionResult> UpdateFamilyProfile(int id, [FromForm] UpdateFamilyRequest request)
    {
        try
        {
            var family = await _familyService.UpdateFamilyProfileAsync(id, request);
            if (family == null) return NotFound("Family not found.");
            return Ok(family);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}