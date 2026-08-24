using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroSlideNewColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ButtonLink",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtonText",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubtitleAr",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SubtitleEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "BoardMembers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BoardMembers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "BoardMembers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "BoardMembers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterHandle",
                table: "BoardMembers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ButtonLink",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "ButtonText",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "SubtitleAr",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "SubtitleEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "BoardMembers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BoardMembers");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "BoardMembers");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "BoardMembers");

            migrationBuilder.DropColumn(
                name: "TwitterHandle",
                table: "BoardMembers");
        }
    }
}
