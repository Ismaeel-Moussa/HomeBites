using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDummyData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, 2 });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, 3 });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, 4 });

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Dishes",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 4);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName", "UserType" },
                values: new object[,]
                {
                    { 1, 0, "CONC-STAMP-1", "family1@homebites.test", true, false, null, "FAMILY1@HOMEBITES.TEST", "FAMILY1@HOMEBITES.TEST", "AQAAAAIAAYagAAAAEPwvwfU5ZE23+bFoi0kK8vBrvyXTnCgpgoCFvrl3dL6LNL8YQWuaTAFk28CSaUEqdw==", null, false, "SEC-STAMP-1", false, "family1@homebites.test", 1 },
                    { 2, 0, "CONC-STAMP-2", "family2@homebites.test", true, false, null, "FAMILY2@HOMEBITES.TEST", "FAMILY2@HOMEBITES.TEST", "AQAAAAIAAYagAAAAEPwvwfU5ZE23+bFoi0kK8vBrvyXTnCgpgoCFvrl3dL6LNL8YQWuaTAFk28CSaUEqdw==", null, false, "SEC-STAMP-2", false, "family2@homebites.test", 1 },
                    { 3, 0, "CONC-STAMP-3", "family3@homebites.test", true, false, null, "FAMILY3@HOMEBITES.TEST", "FAMILY3@HOMEBITES.TEST", "AQAAAAIAAYagAAAAEPwvwfU5ZE23+bFoi0kK8vBrvyXTnCgpgoCFvrl3dL6LNL8YQWuaTAFk28CSaUEqdw==", null, false, "SEC-STAMP-3", false, "family3@homebites.test", 1 },
                    { 4, 0, "CONC-STAMP-4", "family4@homebites.test", true, false, null, "FAMILY4@HOMEBITES.TEST", "FAMILY4@HOMEBITES.TEST", "AQAAAAIAAYagAAAAEHIsl1bRy51jouxwrUOXCspQJvpodAgNdJjasSgkv3Uklh48s/F8X5eTMNiV7mFmwg==", null, false, "SEC-STAMP-4", false, "family4@homebites.test", 1 }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 1, 2 },
                    { 1, 3 },
                    { 1, 4 }
                });

            migrationBuilder.InsertData(
                table: "Families",
                columns: new[] { "Id", "Bio", "KitchenCategory", "Location", "Name", "ProfileImageUrl", "UserId", "WhatsAppNumber" },
                values: new object[,]
                {
                    { 1, "Traditional Egyptian home-cooked meals.", "Traditional", "Cairo", "Ahmed Family Kitchen", null, 1, "+201000000001" },
                    { 2, "Seafood specials from our family to yours.", "Grill", "Alexandria", "Hassan Home Bites", null, 2, "+201000000002" },
                    { 3, "Homemade desserts and baked goods.", "Bakery", "Giza", "Fatima's Sweet Corner", null, 3, "+201000000003" },
                    { 4, "Grilled meats and hearty mains.", "Grill", "Mansoura", "Samir's Grill House", null, 4, "+201000000004" }
                });

            migrationBuilder.InsertData(
                table: "Dishes",
                columns: new[] { "Id", "CategoryId", "Description", "FamilyId", "ImageUrl", "Name", "Price" },
                values: new object[,]
                {
                    { 1, 1, "Classic Molokhia served with white rice.", 1, null, "Molokhia with Rice", 80m },
                    { 2, 4, "Warak enab stuffed with rice and herbs.", 1, null, "Stuffed Vine Leaves", 70m },
                    { 3, 1, "Lentils, pasta, rice with spicy sauce.", 1, null, "Koshari Plate", 60m },
                    { 4, 4, "Warm Egyptian lentil soup.", 1, null, "Lentil Soup", 40m },
                    { 5, 1, "Marinated grilled chicken with rice.", 1, null, "Grilled Chicken with Rice", 95m },
                    { 6, 1, "Fresh sea bass grilled with herbs.", 2, null, "Grilled Sea Bass", 150m },
                    { 7, 4, "Crispy fried calamari rings.", 2, null, "Fried Calamari", 110m },
                    { 8, 1, "Shrimp cooked in clay pot with veggies.", 2, null, "Shrimp Tagine", 140m },
                    { 9, 4, "Rich seafood soup.", 2, null, "Fish Soup", 65m },
                    { 10, 3, "Fresh lemon mint drink.", 2, null, "Lemon Mint Juice", 30m },
                    { 11, 2, "Traditional semolina cake with syrup.", 3, null, "Basbousa", 45m },
                    { 12, 2, "Crispy kunafa filled with cream.", 3, null, "Kunafa with Cream", 55m },
                    { 13, 2, "Creamy rice pudding with nuts.", 3, null, "Rice Pudding", 35m },
                    { 14, 2, "Layers of filo with nuts and syrup.", 3, null, "Baklava", 60m },
                    { 15, 3, "Strong Turkish-style coffee.", 3, null, "Turkish Coffee", 25m },
                    { 16, 1, "Kebab, kofta, and shish tawook.", 4, null, "Mixed Grill Platter", 180m },
                    { 17, 1, "Grilled kofta served with tahini sauce.", 4, null, "Kofta with Tahini", 120m },
                    { 18, 4, "Spicy grilled chicken wings.", 4, null, "Chicken Wings", 90m },
                    { 19, 4, "Fresh salad with toasted bread.", 4, null, "Fattoush Salad", 50m },
                    { 20, 3, "Cold karkade drink.", 4, null, "Fresh Hibiscus Drink", 30m }
                });
        }
    }
}
