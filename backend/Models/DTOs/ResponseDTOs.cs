namespace NextStepBackend.Models.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public object? Error { get; set; }
}

public class LeaderboardEntryDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int Points { get; set; }
    public int Level { get; set; }
    public int Rank { get; set; }
    public string? University { get; set; }
    public string? Major { get; set; }
    public string? CareerPath { get; set; }
    public int Streak { get; set; }
    public int CoursesCompleted { get; set; }
    public int ProjectsSubmitted { get; set; }
    public int AchievementsEarned { get; set; }
    public int LearningHours { get; set; }
    public int MonthlyGrowthPercentage { get; set; }
    public int CompetitionWins { get; set; }
    public double MentorshipRating { get; set; }
    public int ProfileViews { get; set; }
    public int SkillsAcquired { get; set; }
    public DateTime? LastActivityDate { get; set; }
}

// Achievement DTOs
public class AchievementResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public int XpReward { get; set; }
    public string? IconName { get; set; }
    public string? BadgeColor { get; set; }
    public int Progress { get; set; } = 0; // 0-100 percentage
}

public class UserAchievementResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public int XpEarned { get; set; }
    public string? IconName { get; set; }
    public string? BadgeColor { get; set; }
    public DateTime EarnedAt { get; set; }
    public string? Notes { get; set; }
}

public class UserAchievementSummary
{
    public int TotalEarned { get; set; }
    public int TotalAvailable { get; set; }
    public int TotalXpEarned { get; set; }
    public List<UserAchievementResponse> EarnedAchievements { get; set; } = new();
    public List<AchievementResponse> AvailableAchievements { get; set; } = new();
}

public class ManualAwardRequest
{
    public int AchievementId { get; set; }
    public string? Notes { get; set; }
}

public class UserAchievementDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AchievementId { get; set; }
    public DateTime EarnedAt { get; set; }
    public int XpEarned { get; set; }
    public string? Notes { get; set; }
    public Achievement? Achievement { get; set; }
}

public class CourseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Level { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int XpPoints { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? ExternalUrl { get; set; }
    public int EstimatedHours { get; set; }
    public bool IsEnrolled { get; set; }
    public bool IsCompleted { get; set; }
    public int Progress { get; set; }
}

public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ProjectUrl { get; set; }
    public string? GithubUrl { get; set; }
    public List<string>? Technologies { get; set; }
    public List<string>? ImageUrls { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserName { get; set; } = string.Empty;
}

public class StudentRankDto
{
    public int Rank { get; set; }
    public int Points { get; set; }
    public int Level { get; set; }
    public int TotalStudents { get; set; }
    public double Percentile { get; set; }
}

public class ActivityLogDto
{
    public int Id { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public string? ActivityDescription { get; set; }
    public int PointsEarned { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class StudentRatingDto
{
    public int Id { get; set; }
    public int StudentUserId { get; set; }
    public int ExpertUserId { get; set; }
    public string ExpertName { get; set; } = string.Empty;
    public string? ExpertCompany { get; set; }
    public string? ExpertPosition { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public string? Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class RatingStatsDto
{
    public double AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public Dictionary<string, double> CategoryRatings { get; set; } = new();
    public List<StudentRatingDto> RecentRatings { get; set; } = new();
}
