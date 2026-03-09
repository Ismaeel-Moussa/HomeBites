using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Families",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WhatsAppNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Families", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Families_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dishes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dishes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dishes_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dishes_Families_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Families",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Main Dishes" },
                    { 2, "Sweets" },
                    { 3, "Appetizers" },
                    { 4, "Bakery" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Password" },
                values: new object[,]
                {
                    { 1, "sham@homebites.com", "password123" },
                    { 2, "iraqi@homebites.com", "password123" }
                });

            migrationBuilder.InsertData(
                table: "Families",
                columns: new[] { "Id", "Bio", "Location", "Name", "ProfileImageUrl", "UserId", "WhatsAppNumber" },
                values: new object[,]
                {
                    { 1, "Authentic Syrian home-cooked meals prepared with love in Istanbul.", "Fatih, Istanbul", "Sham Kitchen", "/images/profiles/sham_kitchen.jpg", 1, "+905311111111" },
                    { 2, "The best Mansaf, Mandi, and traditional Iraqi dishes in the city.", "Esenyurt, Istanbul", "Iraqi Flavors", "/images/profiles/iraqi_flavors.jpg", 2, "+905322222222" }
                });

            migrationBuilder.InsertData(
                table: "Dishes",
                columns: new[] { "Id", "CategoryId", "Description", "FamilyId", "ImageUrl", "Name", "Price" },
                values: new object[,]
                {
                    { 1, 1, "Slow-cooked whole chicken on a bed of spiced rice with nuts and raisins.", 1, "/images/dishes/oozi.jpg", "Chicken Oozi", 250.00m },
                    { 2, 3, "Crispy bulgur shells stuffed with seasoned ground beef, onions, and pine nuts.", 1, "/images/dishes/kibbeh.jpg", "Fried Kibbeh", 150.00m },
                    { 3, 2, "Soft semolina cake soaked in rose-water syrup, topped with almonds.", 1, "/images/dishes/basbousa.jpg", "Basbousa", 100.00m },
                    { 4, 1, "Tender slow-roasted lamb over fragrant basmati rice cooked in a tandoor oven.", 2, "/images/dishes/mandi.jpg", "Lamb Mandi", 350.00m },
                    { 5, 4, "Traditional diamond-shaped Iraqi bread, fresh out of the oven — fluffy inside, crispy outside.", 2, "/images/dishes/samoon.jpg", "Samoon Bread", 20.00m },
                    { 6, 1, "Grape leaves and vegetables stuffed with spiced rice and minced meat, cooked in tomato broth.", 2, "/images/dishes/dolma.jpg", "Baghdadi Dolma", 300.00m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dishes_CategoryId",
                table: "Dishes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Dishes_FamilyId",
                table: "Dishes",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Families_UserId",
                table: "Families",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dishes");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Families");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
