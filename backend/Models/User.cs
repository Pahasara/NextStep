using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Role { get; set; } = "student"; // student, industry_expert

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Profile? Profile { get; set; }
    public ICollection<UserCourse> UserCourses { get; set; } = new List<UserCourse>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}
