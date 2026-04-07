f## Backend seed data (EF Core)

This backend uses EF Core `HasData` seeding (see `HomeBites.Backend/DataAccess/AppDbContext.cs`) and migrations to populate a fresh database with sample data for development.

### What gets seeded

- **Roles**: `Family`, `Customer`, `Admin`
- **Users**: 4 family users, all assigned to the **Family** role
- **Families**: 4 families linked 1:1 to those users
- **Categories**: 4 categories
- **Dishes**: 20 dishes

### Seeded logins (dev only)

All seeded family users share the same password:

- **Password**: `Password123!`

Users:

- `family1@homebites.test`
- `family2@homebites.test`
- `family3@homebites.test`
- `family4@homebites.test`

### Applying the seed

From `HomeBites.Backend/`:

```bash
dotnet ef database update -p DataAccess/DataAccess.csproj -s API/API.csproj
```

### Notes

- This data is intended for **development only**.
