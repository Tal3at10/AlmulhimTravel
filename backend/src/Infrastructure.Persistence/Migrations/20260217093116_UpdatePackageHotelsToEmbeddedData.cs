using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePackageHotelsToEmbeddedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PackageHotels_Hotels_HotelId",
                table: "PackageHotels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PackageHotels",
                table: "PackageHotels");

            migrationBuilder.AlterColumn<Guid>(
                name: "HotelId",
                table: "PackageHotels",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "PackageHotels",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "DayImageUrl",
                table: "PackageHotels",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "PackageHotels",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "PackageHotels",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NightImageUrl",
                table: "PackageHotels",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Stars",
                table: "PackageHotels",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PackageHotels",
                table: "PackageHotels",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PackageHotels_PackageId",
                table: "PackageHotels",
                column: "PackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_PackageHotels_Hotels_HotelId",
                table: "PackageHotels",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PackageHotels_Hotels_HotelId",
                table: "PackageHotels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PackageHotels",
                table: "PackageHotels");

            migrationBuilder.DropIndex(
                name: "IX_PackageHotels_PackageId",
                table: "PackageHotels");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PackageHotels");

            migrationBuilder.DropColumn(
                name: "DayImageUrl",
                table: "PackageHotels");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "PackageHotels");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "PackageHotels");

            migrationBuilder.DropColumn(
                name: "NightImageUrl",
                table: "PackageHotels");

            migrationBuilder.DropColumn(
                name: "Stars",
                table: "PackageHotels");

            migrationBuilder.AlterColumn<Guid>(
                name: "HotelId",
                table: "PackageHotels",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PackageHotels",
                table: "PackageHotels",
                columns: new[] { "PackageId", "HotelId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PackageHotels_Hotels_HotelId",
                table: "PackageHotels",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
