using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public class AchievementService : IAchievementService
{
    private readonly NextStepDbContext _context;

    public AchievementService(NextStepDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<Achievement>>> GetAchievementsAsync()
    {
        try
        {
            var achievements = await _context.Achievements
                .Where(a => a.IsActive)
                .OrderBy(a => a.XpReward)
                .ToListAsync();

            return new ApiResponse<IEnumerable<Achievement>>
            {
                Success = true,
                Data = achievements
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<Achievement>>
            {
                Success = false,
                Message = "Failed to retrieve achievements",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<UserAchievementDto>>> GetUserAchievementsAsync(int userId)
    {
        try
        {
            var userAchievements = await _context.UserAchievements
                .Include(ua => ua.Achievement)
                .Where(ua => ua.UserId == userId)
                .OrderByDescending(ua => ua.EarnedAt)
                .ToListAsync();

            var userAchievementDtos = userAchievements.Select(ua => new UserAchievementDto
            {
                Id = ua.Id,
                UserId = ua.UserId,
                AchievementId = ua.AchievementId,
                EarnedAt = ua.EarnedAt,
                XpEarned = ua.XpEarned,
                Notes = ua.Notes,
                Achievement = ua.Achievement
            });

            return new ApiResponse<IEnumerable<UserAchievementDto>>
            {
                Success = true,
                Data = userAchievementDtos
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<UserAchievementDto>>
            {
                Success = false,
                Message = "Failed to retrieve user achievements",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<UserAchievementDto>>> CheckAndAwardUserAchievementsAsync(int userId)
    {
        try
        {
            var newAchievements = new List<UserAchievementDto>();

            // Get user profile with current stats
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                return new ApiResponse<IEnumerable<UserAchievementDto>>
                {
                    Success = false,
                    Message = "User profile not found"
                };
            }

            // Get all achievements the user hasn't earned yet
            var earnedAchievementIds = await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AchievementId)
                .ToListAsync();

            var availableAchievements = await _context.Achievements
                .Where(a => a.IsActive && !earnedAchievementIds.Contains(a.Id))
                .ToListAsync();

            // Check each achievement condition
            foreach (var achievement in availableAchievements)
            {
                bool shouldAward = false;

                switch (achievement.ConditionType?.ToLower())
                {
                    case "course_count":
                        var courseCount = await _context.UserCourses
                            .CountAsync(uc => uc.UserId == userId && uc.IsCompleted);
                        shouldAward = courseCount >= (achievement.ConditionValue ?? 0);
                        break;

                    case "project_count":
                        var projectCount = await _context.Projects
                            .CountAsync(p => p.UserId == userId);
                        shouldAward = projectCount >= (achievement.ConditionValue ?? 0);
                        break;

                    case "streak_days":
                        // For now, use a simplified streak calculation
                        // In a real app, you'd track daily login streaks
                        shouldAward = profile.Streak >= (achievement.ConditionValue ?? 0);
                        break;

                    case "xp_total":
                        shouldAward = profile.Points >= (achievement.ConditionValue ?? 0);
                        break;

                    case "achievement_count":
                        var achievementCount = await _context.UserAchievements
                            .CountAsync(ua => ua.UserId == userId);
                        shouldAward = achievementCount >= (achievement.ConditionValue ?? 0);
                        break;

                    case "first_action":
                        // Special case for "first" achievements
                        if (achievement.Title.Contains("First Steps"))
                        {
                            var hasCourse = await _context.UserCourses
                                .AnyAsync(uc => uc.UserId == userId && uc.IsCompleted);
                            shouldAward = hasCourse;
                        }
                        else if (achievement.Title.Contains("Project Pioneer"))
                        {
                            var hasProject = await _context.Projects
                                .AnyAsync(p => p.UserId == userId);
                            shouldAward = hasProject;
                        }
                        break;

                    case "time_based":
                        // For early bird achievement
                        if (achievement.Title.Contains("Early Bird"))
                        {
                            var currentHour = DateTime.Now.Hour;
                            shouldAward = currentHour < 8; // Before 8 AM
                        }
                        break;
                }

                if (shouldAward)
                {
                    var result = await AwardAchievementAsync(userId, achievement.Id, $"Auto-awarded for meeting condition: {achievement.ConditionType}");
                    if (result.Success && result.Data != null)
                    {
                        newAchievements.Add(result.Data);
                    }
                }
            }

            return new ApiResponse<IEnumerable<UserAchievementDto>>
            {
                Success = true,
                Data = newAchievements,
                Message = $"Checked achievements. {newAchievements.Count} new achievements awarded."
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<UserAchievementDto>>
            {
                Success = false,
                Message = "Failed to check and award achievements",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<UserAchievementDto>> AwardAchievementAsync(int userId, int achievementId, string? notes = null)
    {
        try
        {
            // Check if user already has this achievement
            var existingAchievement = await _context.UserAchievements
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);

            if (existingAchievement != null)
            {
                return new ApiResponse<UserAchievementDto>
                {
                    Success = false,
                    Message = "User already has this achievement"
                };
            }

            var achievement = await _context.Achievements.FindAsync(achievementId);
            if (achievement == null)
            {
                return new ApiResponse<UserAchievementDto>
                {
                    Success = false,
                    Message = "Achievement not found"
                };
            }

            // Create user achievement
            var userAchievement = new UserAchievement
            {
                UserId = userId,
                AchievementId = achievementId,
                XpEarned = achievement.XpReward,
                Notes = notes
            };

            _context.UserAchievements.Add(userAchievement);

            // Update user profile XP
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null)
            {
                profile.Points += achievement.XpReward;
                profile.AchievementsEarned++;
                profile.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // Return the created achievement with full data
            var result = await _context.UserAchievements
                .Include(ua => ua.Achievement)
                .FirstOrDefaultAsync(ua => ua.Id == userAchievement.Id);

            var userAchievementDto = new UserAchievementDto
            {
                Id = result!.Id,
                UserId = result.UserId,
                AchievementId = result.AchievementId,
                EarnedAt = result.EarnedAt,
                XpEarned = result.XpEarned,
                Notes = result.Notes,
                Achievement = result.Achievement
            };

            return new ApiResponse<UserAchievementDto>
            {
                Success = true,
                Data = userAchievementDto,
                Message = $"Achievement '{achievement.Title}' awarded! +{achievement.XpReward} XP"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<UserAchievementDto>
            {
                Success = false,
                Message = "Failed to award achievement",
                Error = ex.Message
            };
        }
    }
}
