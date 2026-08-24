using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Hotels_CityId_Stars_Rating_IsActive",
                table: "Hotels",
                columns: new[] { "CityId", "Stars", "Rating", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_IsActive",
                table: "Hotels",
                column: "IsActive",
                filter: "IsActive = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Hotels_CityId_Stars_Rating_IsActive",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_IsActive",
                table: "Hotels");
        }
    }
}
