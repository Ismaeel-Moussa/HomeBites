using BusinessLayer.DTOs;
using BusinessLayer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly IDishService _dishService;

    public DishesController(IDishService dishService)
    {
        _dishService = dishService;
    }

    // GET: api/dishes
    [HttpGet]
    public async Task<IActionResult> GetDishes()
    {
        var dishes = await _dishService.GetDishesAsync();
        return Ok(dishes);
    }

    // GET: api/dishes/search?q=kibbeh&category=3
    [HttpGet("search")]
    public async Task<IActionResult> SearchDishes([FromQuery] string? q, [FromQuery] int? category)
    {
        var results = await _dishService.SearchDishesAsync(q, category);
        return Ok(results);
    }

    // POST: api/dishes
    [HttpPost]
    [Consumes("multipart/form-data")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "FamilyOnly")]
    public async Task<IActionResult> CreateDish([FromForm] CreateDishRequest request)
    {
        try
        {
            var dish = await _dishService.CreateDishAsync(request);
            return Ok(dish);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT: api/dishes/{id}
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "FamilyOnly")]
    public async Task<IActionResult> UpdateDish(int id, [FromForm] UpdateDishRequest request)
    {
        try
        {
            var dish = await _dishService.UpdateDishAsync(id, request);
            if (dish == null) return NotFound("Dish not found.");
            return Ok(dish);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/dishes/{id}
    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "FamilyOnly")]
    public async Task<IActionResult> DeleteDish(int id)
    {
        var deleted = await _dishService.DeleteDishAsync(id);
        if (!deleted) return NotFound("Dish not found.");
        return NoContent();
    }
}