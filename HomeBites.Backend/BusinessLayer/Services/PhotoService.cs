using Microsoft.AspNetCore.Http;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;

namespace BusinessLayer.Services;

public class PhotoService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;

    public PhotoService(IConfiguration configuration)
    {
        var connectionString = configuration["AzureBlobStorage:ConnectionString"];
        _containerName = configuration["AzureBlobStorage:ContainerName"] ?? "homebites-uploads";

        if (!string.IsNullOrEmpty(connectionString))
        {
            _blobServiceClient = new BlobServiceClient(connectionString);
        }
    }

    public async Task<string?> SavePhotoAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0 || _blobServiceClient == null) return null;

        var blobContainerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        
        // Ensure container exists and is public
        await blobContainerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var fileName = $"{subFolder}/{Guid.NewGuid()}_{file.FileName}";
        var blobClient = blobContainerClient.GetBlobClient(fileName);

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return blobClient.Uri.ToString();
    }
}