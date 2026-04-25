using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddKitchenCategoryToFamily : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KitchenCategory",
                table: "Families",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Families", 
                keyColumn: "Id",
                keyValue: 1,
                column: "KitchenCategory",
                value: "Traditional");

            migrationBuilder.UpdateData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 2,
                column: "KitchenCategory",
                value: "Grill");

            migrationBuilder.UpdateData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 3,
                column: "KitchenCategory",
                value: "Bakery");

            migrationBuilder.UpdateData(
                table: "Families",
                keyColumn: "Id",
                keyValue: 4,
                column: "KitchenCategory",
                value: "Grill");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KitchenCategory",
                table: "Families");
        }
    }
}
