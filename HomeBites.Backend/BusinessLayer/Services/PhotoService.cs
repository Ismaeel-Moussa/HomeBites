using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace BusinessLayer.Services;

public class PhotoService
{
    private readonly IWebHostEnvironment _environment;

    public PhotoService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SavePhotoAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0) return null;

        // 1. Define where to save the file
        var wwwRootPath = _environment.WebRootPath;
        var fileName = Guid.NewGuid().ToString() + "_" + file.FileName;
        var path = Path.Combine(wwwRootPath, "images", subFolder, fileName);

        // 2. Save the file to the hard drive
        using (var fileStream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // 3. Return the relative URL for the database
        return $"/images/{subFolder}/{fileName}";
    }
}