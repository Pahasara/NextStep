using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextStep.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentRatings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudentRatings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StudentUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ExpertUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentRatings_Users_ExpertUserId",
                        column: x => x.ExpertUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentRatings_Users_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_CreatedAt",
                table: "StudentRatings",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_ExpertUserId",
                table: "StudentRatings",
                column: "ExpertUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_StudentUserId",
                table: "StudentRatings",
                column: "StudentUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_StudentUserId_ExpertUserId_Category",
                table: "StudentRatings",
                columns: new[] { "StudentUserId", "ExpertUserId", "Category" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentRatings");
        }
    }
}
