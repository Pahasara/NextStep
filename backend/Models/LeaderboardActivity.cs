using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class LeaderboardActivity
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(50)]
    public string ActivityType { get; set; } = string.Empty; // course_completed, project_submitted, achievement_earned, quiz_completed, skill_acquired

    [StringLength(100)]
    public string? ActivityDescription { get; set; }

    public int PointsEarned { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Additional metadata
    public string? Metadata { get; set; } // JSON string for additional data

    // Navigation property
    public User User { get; set; } = null!;
}
