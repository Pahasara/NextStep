using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public class LeaderboardService : ILeaderboardService
{
    private readonly NextStepDbContext _context;

    public LeaderboardService(NextStepDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<LeaderboardEntryDto>>> GetLeaderboardAsync(int page, int pageSize)
    {
        try
        {
            var skip = (page - 1) * pageSize;

            // Get users data first
            var users = await _context.Users
                .Include(u => u.Profile)
                .Where(u => u.Profile != null && u.Role == "student")
                .OrderByDescending(u => u.Profile!.Points)
                .ThenByDescending(u => u.Profile!.Level)
                .ThenByDescending(u => u.Profile!.Streak)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            // Convert to DTO with correct ranking
            var leaderboard = users.Select((u, index) => new LeaderboardEntryDto
            {
                UserId = u.Id,
                FullName = u.FullName,
                AvatarUrl = u.Profile!.AvatarUrl,
                Points = u.Profile.Points,
                Level = u.Profile.Level,
                Rank = skip + index + 1,
                University = u.Profile.University,
                Major = u.Profile.Major,
                CareerPath = u.Profile.CareerInterests, // This could be parsed from JSON
                Streak = u.Profile.Streak,
                CoursesCompleted = u.Profile.CoursesCompleted,
                ProjectsSubmitted = u.Profile.ProjectsSubmitted,
                AchievementsEarned = u.Profile.AchievementsEarned,
                LearningHours = u.Profile.LearningHours,
                MonthlyGrowthPercentage = u.Profile.MonthlyGrowthPercentage,
                CompetitionWins = u.Profile.CompetitionWins,
                MentorshipRating = u.Profile.MentorshipRating,
                ProfileViews = u.Profile.ProfileViews,
                SkillsAcquired = u.Profile.SkillsAcquired,
                LastActivityDate = u.Profile.LastActivityDate
            }).ToList();

            return new ApiResponse<IEnumerable<LeaderboardEntryDto>>
            {
                Success = true,
                Data = leaderboard
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<LeaderboardEntryDto>>
            {
                Success = false,
                Message = "Failed to retrieve leaderboard",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> GetUserRankAsync(int userId)
    {
        try
        {
            var userProfile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (userProfile == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = "User profile not found"
                };
            }

            var totalStudents = await _context.Profiles
                .Include(p => p.User)
                .CountAsync(p => p.User.Role == "student");

            var rank = await _context.Profiles
                .Include(p => p.User)
                .Where(p => p.User.Role == "student")
                .CountAsync(p => p.Points > userProfile.Points ||
                                (p.Points == userProfile.Points && p.Level > userProfile.Level) ||
                                (p.Points == userProfile.Points && p.Level == userProfile.Level && p.Streak > userProfile.Streak)) + 1;

            var percentile = totalStudents > 0 ? ((double)(totalStudents - rank + 1) / totalStudents) * 100 : 0;

            var rankData = new StudentRankDto
            {
                Rank = rank,
                Points = userProfile.Points,
                Level = userProfile.Level,
                TotalStudents = totalStudents,
                Percentile = Math.Round(percentile, 1)
            };

            return new ApiResponse<object>
            {
                Success = true,
                Data = rankData
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to get user rank",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> LogActivityAsync(int userId, string activityType, string? description, int points, string? metadata = null)
    {
        try
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            // Log the activity
            var activity = new LeaderboardActivity
            {
                UserId = userId,
                ActivityType = activityType,
                ActivityDescription = description,
                PointsEarned = points,
                Metadata = metadata,
                CreatedAt = DateTime.UtcNow
            };

            _context.LeaderboardActivities.Add(activity);

            // Update user profile
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null)
            {
                profile.Points += points;
                profile.LastActivityDate = DateTime.UtcNow;

                // Update streak
                await UpdateUserStreakAsync(profile);

                // Update specific counters based on activity type
                switch (activityType.ToLower())
                {
                    case "course_completed":
                        profile.CoursesCompleted++;
                        profile.LearningHours += ExtractLearningHours(metadata);
                        break;
                    case "project_submitted":
                        profile.ProjectsSubmitted++;
                        break;
                    case "achievement_earned":
                        profile.AchievementsEarned++;
                        break;
                    case "skill_acquired":
                        profile.SkillsAcquired++;
                        break;
                    case "quiz_completed":
                        profile.LearningHours += 1; // Assume 1 hour for quiz
                        break;
                }

                // Update level based on points
                profile.Level = CalculateLevel(profile.Points);

                // Calculate monthly growth
                await UpdateMonthlyGrowthAsync(profile);

                _context.Profiles.Update(profile);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new ApiResponse<object>
            {
                Success = true,
                Message = "Activity logged successfully",
                Data = new { ActivityId = activity.Id, NewPoints = profile?.Points ?? 0, NewLevel = profile?.Level ?? 1 }
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to log activity",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<ActivityLogDto>>> GetUserActivitiesAsync(int userId, int page = 1, int pageSize = 20)
    {
        try
        {
            var skip = (page - 1) * pageSize;
            
            var activities = await _context.LeaderboardActivities
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(a => new ActivityLogDto
                {
                    Id = a.Id,
                    ActivityType = a.ActivityType,
                    ActivityDescription = a.ActivityDescription,
                    PointsEarned = a.PointsEarned,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return new ApiResponse<IEnumerable<ActivityLogDto>>
            {
                Success = true,
                Data = activities
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<ActivityLogDto>>
            {
                Success = false,
                Message = "Failed to retrieve user activities",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> IncrementProfileViewAsync(int userId)
    {
        try
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null)
            {
                profile.ProfileViews++;
                _context.Profiles.Update(profile);
                await _context.SaveChangesAsync();
            }

            return new ApiResponse<object>
            {
                Success = true,
                Message = "Profile view incremented"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to increment profile view",
                Error = ex.Message
            };
        }
    }

    private async Task UpdateUserStreakAsync(Profile profile)
    {
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);
        var today = DateTime.UtcNow.Date;

        var lastActivity = profile.LastActivityDate?.Date;

        if (lastActivity == yesterday)
        {
            // Continue streak
            profile.Streak++;
        }
        else if (lastActivity != today)
        {
            // Reset streak if more than a day has passed
            profile.Streak = 1;
        }
        // If lastActivity is today, keep current streak
    }

    private int CalculateLevel(int points)
    {
        // Simple level calculation: Level = (Points / 100) + 1
        // You can make this more sophisticated
        return (points / 100) + 1;
    }

    private async Task UpdateMonthlyGrowthAsync(Profile profile)
    {
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        var monthStart = new DateTime(currentYear, currentMonth, 1);
        var lastMonthStart = monthStart.AddMonths(-1);

        var currentMonthPoints = await _context.LeaderboardActivities
            .Where(a => a.UserId == profile.UserId && a.CreatedAt >= monthStart)
            .SumAsync(a => a.PointsEarned);

        var lastMonthPoints = await _context.LeaderboardActivities
            .Where(a => a.UserId == profile.UserId && 
                       a.CreatedAt >= lastMonthStart && 
                       a.CreatedAt < monthStart)
            .SumAsync(a => a.PointsEarned);

        if (lastMonthPoints > 0)
        {
            profile.MonthlyGrowthPercentage = (int)Math.Round(((double)(currentMonthPoints - lastMonthPoints) / lastMonthPoints) * 100);
        }
        else if (currentMonthPoints > 0)
        {
            profile.MonthlyGrowthPercentage = 100; // First month with activity
        }
    }

    private int ExtractLearningHours(string? metadata)
    {
        // Try to extract learning hours from metadata JSON
        // For now, return a default value
        return 2; // Default 2 hours per course
    }
}
