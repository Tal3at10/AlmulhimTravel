using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFeaturedToDestinationsAndPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastAgentMessageAt",
                table: "WhatsAppConversations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FeaturedOrder",
                table: "Packages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Packages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "FeaturedOrder",
                table: "Destinations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Destinations",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastAgentMessageAt",
                table: "WhatsAppConversations");

            migrationBuilder.DropColumn(
                name: "FeaturedOrder",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "FeaturedOrder",
                table: "Destinations");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Destinations");
        }
    }
}
