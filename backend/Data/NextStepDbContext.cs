using Microsoft.EntityFrameworkCore;
using NextStepBackend.Models;

namespace NextStepBackend.Data;

public class NextStepDbContext : DbContext
{
    public NextStepDbContext(DbContextOptions<NextStepDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<UserCourse> UserCourses { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<LeaderboardActivity> LeaderboardActivities { get; set; }
    public DbSet<StudentRating> StudentRatings { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("datetime('now')");
        });

        // Profile configuration
        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithOne(e => e.Profile)
                  .HasForeignKey<Profile>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("datetime('now')");
        });

        // Course configuration
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
        });

        // UserCourse configuration
        modelBuilder.Entity<UserCourse>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(e => e.UserCourses)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Course)
                  .WithMany(e => e.UserCourses)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.EnrolledAt).HasDefaultValueSql("datetime('now')");
            entity.HasIndex(e => new { e.UserId, e.CourseId }).IsUnique();
        });

        // Project configuration
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(e => e.Projects)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
        });

        // Subscription configuration
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
        });

        // LeaderboardActivity configuration
        modelBuilder.Entity<LeaderboardActivity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            entity.HasIndex(e => new { e.UserId, e.ActivityType });
            entity.HasIndex(e => e.CreatedAt);
        });

        // StudentRating configuration
        modelBuilder.Entity<StudentRating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentUserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Expert)
                  .WithMany()
                  .HasForeignKey(e => e.ExpertUserId)
                  .OnDelete(DeleteBehavior.Restrict); // Don't delete ratings if expert is deleted
            entity.HasIndex(e => new { e.StudentUserId, e.ExpertUserId, e.Category });
            entity.HasIndex(e => e.StudentUserId);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Achievement configuration
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("datetime('now')");
        });

        // UserAchievement configuration
        modelBuilder.Entity<UserAchievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(e => e.UserAchievements)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Achievement)
                  .WithMany(e => e.UserAchievements)
                  .HasForeignKey(e => e.AchievementId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
            entity.Property(e => e.EarnedAt).HasDefaultValueSql("datetime('now')");
        });
    }
}
