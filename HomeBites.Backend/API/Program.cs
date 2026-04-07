using System.Text;
using DataAccess;
using DataAccess.Repositories;
using BusinessLayer.Services;
using DataAccess.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// 1. Add Database Support
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

// 1.b Add Identity (API-style)
builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>(options =>
    {
        // Use default password rules (from plan) - can tweak later if needed
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// 1.c Configure JWT Authentication
var jwtKey = configuration["Jwt:Key"] ?? "development-secret-key-change-in-prod";
var jwtIssuer = configuration["Jwt:Issuer"] ?? "HomeBitesIssuer";
var jwtAudience = configuration["Jwt:Audience"] ?? "HomeBitesAudience";
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = signingKey
        };
    });

// 1.d Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("FamilyOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("user_type", nameof(UserType.Family));
    });
});

// 2. Add Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IDishRepository, DishRepository>();
builder.Services.AddScoped<IFamilyRepository, FamilyRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// 3. Add Business Services
builder.Services.AddScoped<PhotoService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IDishService, DishService>();
builder.Services.AddScoped<IFamilyService, FamilyService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Add CORS (Critical for React to talk to the API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"));
});

var app = builder.Build();

// 4. Middlewares
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(); // Essential for serving images from wwwroot
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();