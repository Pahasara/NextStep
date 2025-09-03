using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class Achievement
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty; // e.g., "course", "project", "streak", "skill", "community"

    [Required]
    [StringLength(20)]
    public string Rarity { get; set; } = "Common"; // Common, Uncommon, Rare, Epic, Legendary

    [Required]
    public int XpReward { get; set; } = 0;

    [StringLength(100)]
    public string? IconName { get; set; } // Icon identifier for frontend

    [StringLength(50)]
    public string? BadgeColor { get; set; } = "#3B82F6"; // Hex color code

    // Condition fields for automatic achievement detection
    [StringLength(100)]
    public string? ConditionType { get; set; } // e.g., "course_count", "project_count", "streak_days", "skill_count"

    public int? ConditionValue { get; set; } // Target value for the condition

    [StringLength(200)]
    public string? ConditionMetadata { get; set; } // Additional JSON metadata for complex conditions

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}

public class UserAchievement
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int AchievementId { get; set; }

    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    public int XpEarned { get; set; } = 0;

    [StringLength(500)]
    public string? Notes { get; set; } // Optional notes about how it was earned

    // Navigation properties
    public User User { get; set; } = null!;
    public Achievement Achievement { get; set; } = null!;
}
