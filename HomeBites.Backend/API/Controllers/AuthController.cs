using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.DTOs;
using BusinessLayer.Services;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly PhotoService _photoService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        AppDbContext dbContext,
        IConfiguration configuration,
        PhotoService photoService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _dbContext = dbContext;
        _configuration = configuration;
        _photoService = photoService;
    }

    [HttpPost("register-family")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> RegisterFamily([FromForm] RegisterFamilyRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { code = "email_in_use", message = "Email is already registered." });
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            UserType = UserType.Family
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToArray();
            return BadRequest(new { code = "registration_failed", errors });
        }

        // Ensure Family role exists and assign
        var familyRoleName = "Family";
        if (!await _roleManager.RoleExistsAsync(familyRoleName))
        {
            await _roleManager.CreateAsync(new ApplicationRole { Name = familyRoleName });
        }
        await _userManager.AddToRoleAsync(user, familyRoleName);

        // Handle photo upload
        string? profileImageUrl = null;
        if (request.ProfileImage != null && request.ProfileImage.Length > 0)
        {
            profileImageUrl = await _photoService.SavePhotoAsync(request.ProfileImage, "profiles");
        }

        // Create family profile
        var family = new Family
        {
            UserId = user.Id,
            Name = request.Name,
            WhatsAppNumber = request.WhatsAppNumber,
            Location = request.Location,
            Bio = request.Bio,
            ProfileImageUrl = profileImageUrl
        };

        _dbContext.Families.Add(family);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Family registered successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return Unauthorized(new { code = "invalid_credentials", message = "Invalid email or password." });
        }

        if (user.UserType != UserType.Family)
        {
            return Unauthorized(new { code = "not_family_user", message = "Only family users can sign in here." });
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
        {
            return Unauthorized(new { code = "invalid_credentials", message = "Invalid email or password." });
        }

        var token = GenerateJwtToken(user);
        return Ok(token);
    }

    private AuthResponse GenerateJwtToken(ApplicationUser user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "development-secret-key-change-in-prod";
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "HomeBitesIssuer";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "HomeBitesAudience";
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var expires = DateTime.UtcNow.AddHours(12);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new("user_type", user.UserType.ToString())
        };

        var tokenDescriptor = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenString = tokenHandler.WriteToken(tokenDescriptor);

        return new AuthResponse
        {
            Token = tokenString,
            ExpiresAt = expires
        };
    }
}

