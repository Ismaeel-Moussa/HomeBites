# Use the .NET 10 SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the entire backend repository (API, DataAccess, BusinessLayer)
COPY . .

# Restore dependencies for the API project (this automatically restores the referenced projects too)
RUN dotnet restore "API/API.csproj"

# Build and publish the release version
RUN dotnet publish "API/API.csproj" -c Release -o /app/publish

# Use the smaller ASP.NET 10 runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy the published files from the build stage
COPY --from=build /app/publish .

# Tell Docker how to start your API
ENTRYPOINT ["dotnet", "API.dll"]