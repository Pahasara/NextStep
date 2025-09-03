using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextStep.Data.Migrations
{
    /// <inheritdoc />
    public partial class LeaderboardEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AchievementsEarned",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompetitionWins",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CoursesCompleted",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastActivityDate",
                table: "Profiles",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LearningHours",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "MentorshipRating",
                table: "Profiles",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "MonthlyGrowthPercentage",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProfileViews",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectsSubmitted",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SkillsAcquired",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Streak",
                table: "Profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "LeaderboardActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ActivityType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ActivityDescription = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    PointsEarned = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')"),
                    Metadata = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaderboardActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaderboardActivities_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LeaderboardActivities_CreatedAt",
                table: "LeaderboardActivities",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LeaderboardActivities_UserId_ActivityType",
                table: "LeaderboardActivities",
                columns: new[] { "UserId", "ActivityType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LeaderboardActivities");

            migrationBuilder.DropColumn(
                name: "AchievementsEarned",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "CompetitionWins",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "CoursesCompleted",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LastActivityDate",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LearningHours",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "MentorshipRating",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "MonthlyGrowthPercentage",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ProfileViews",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ProjectsSubmitted",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "SkillsAcquired",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Streak",
                table: "Profiles");
        }
    }
}
