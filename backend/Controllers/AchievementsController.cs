using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;
using System.Security.Claims;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementsController : ControllerBase
{
    private readonly NextStepDbContext _context;

    public AchievementsController(NextStepDbContext context)
    {
        _context = context;
    }

    // GET: api/Achievements
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Achievement>>>> GetAchievements()
    {
        try
        {
            var achievements = await _context.Achievements
                .Where(a => a.IsActive)
                .OrderBy(a => a.Type)
                .ThenBy(a => a.XpReward)
                .ToListAsync();

            return Ok(new ApiResponse<List<Achievement>>
            {
                Success = true,
                Message = "Achievements retrieved successfully",
                Data = achievements
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<List<Achievement>>
            {
                Success = false,
                Message = "Failed to retrieve achievements",
                Error = ex.Message
            });
        }
    }

    // GET: api/Achievements/user/{userId}
    [HttpGet("user/{userId}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<List<UserAchievementResponse>>>> GetUserAchievements(int userId)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            
            // Only allow users to see their own achievements or if they're viewing a public profile
            if (currentUserId != userId)
            {
                // Add additional authorization logic here if needed
            }

            var userAchievements = await _context.UserAchievements
                .Include(ua => ua.Achievement)
                .Where(ua => ua.UserId == userId)
                .OrderByDescending(ua => ua.EarnedAt)
                .Select(ua => new UserAchievementResponse
                {
                    Id = ua.Id,
                    Title = ua.Achievement.Title,
                    Description = ua.Achievement.Description,
                    Type = ua.Achievement.Type,
                    Rarity = ua.Achievement.Rarity,
                    XpEarned = ua.XpEarned,
                    IconName = ua.Achievement.IconName,
                    BadgeColor = ua.Achievement.BadgeColor,
                    EarnedAt = ua.EarnedAt,
                    Notes = ua.Notes
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<UserAchievementResponse>>
            {
                Success = true,
                Message = "User achievements retrieved successfully",
                Data = userAchievements
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<List<UserAchievementResponse>>
            {
                Success = false,
                Message = "Failed to retrieve user achievements",
                Error = ex.Message
            });
        }
    }

    // GET: api/Achievements/my
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserAchievementSummary>>> GetMyAchievements()
    {
        try
        {
            var userId = GetCurrentUserId();

            var allAchievements = await _context.Achievements
                .Where(a => a.IsActive)
                .ToListAsync();

            var userAchievements = await _context.UserAchievements
                .Include(ua => ua.Achievement)
                .Where(ua => ua.UserId == userId)
                .ToListAsync();

            var earnedAchievements = userAchievements.Select(ua => new UserAchievementResponse
            {
                Id = ua.Id,
                Title = ua.Achievement.Title,
                Description = ua.Achievement.Description,
                Type = ua.Achievement.Type,
                Rarity = ua.Achievement.Rarity,
                XpEarned = ua.XpEarned,
                IconName = ua.Achievement.IconName,
                BadgeColor = ua.Achievement.BadgeColor,
                EarnedAt = ua.EarnedAt,
                Notes = ua.Notes
            }).ToList();

            var availableAchievements = allAchievements
                .Where(a => !userAchievements.Any(ua => ua.AchievementId == a.Id))
                .Select(a => new AchievementResponse
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Type = a.Type,
                    Rarity = a.Rarity,
                    XpReward = a.XpReward,
                    IconName = a.IconName,
                    BadgeColor = a.BadgeColor,
                    Progress = CalculateAchievementProgress(userId, a)
                })
                .ToList();

            var summary = new UserAchievementSummary
            {
                TotalEarned = earnedAchievements.Count,
                TotalAvailable = allAchievements.Count,
                TotalXpEarned = userAchievements.Sum(ua => ua.XpEarned),
                EarnedAchievements = earnedAchievements,
                AvailableAchievements = availableAchievements
            };

            return Ok(new ApiResponse<UserAchievementSummary>
            {
                Success = true,
                Message = "Achievements summary retrieved successfully",
                Data = summary
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<UserAchievementSummary>
            {
                Success = false,
                Message = "Failed to retrieve achievements summary",
                Error = ex.Message
            });
        }
    }

    // POST: api/Achievements/check-and-award
    [HttpPost("check-and-award")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<List<UserAchievementResponse>>>> CheckAndAwardAchievements()
    {
        try
        {
            var userId = GetCurrentUserId();
            var newAchievements = await CheckAndAwardUserAchievements(userId);

            return Ok(new ApiResponse<List<UserAchievementResponse>>
            {
                Success = true,
                Message = $"Checked achievements. {newAchievements.Count} new achievements earned.",
                Data = newAchievements
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<List<UserAchievementResponse>>
            {
                Success = false,
                Message = "Failed to check and award achievements",
                Error = ex.Message
            });
        }
    }

    // POST: api/Achievements/manual-award
    [HttpPost("manual-award")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserAchievementResponse>>> ManualAwardAchievement(
        [FromBody] ManualAwardRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();

            // Check if achievement exists
            var achievement = await _context.Achievements
                .FirstOrDefaultAsync(a => a.Id == request.AchievementId && a.IsActive);

            if (achievement == null)
            {
                return NotFound(new ApiResponse<UserAchievementResponse>
                {
                    Success = false,
                    Message = "Achievement not found"
                });
            }

            // Check if user already has this achievement
            var existingAchievement = await _context.UserAchievements
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AchievementId == request.AchievementId);

            if (existingAchievement != null)
            {
                return BadRequest(new ApiResponse<UserAchievementResponse>
                {
                    Success = false,
                    Message = "Achievement already earned"
                });
            }

            // Award the achievement
            var userAchievement = new UserAchievement
            {
                UserId = userId,
                AchievementId = achievement.Id,
                XpEarned = achievement.XpReward,
                Notes = request.Notes ?? "Manually awarded"
            };

            _context.UserAchievements.Add(userAchievement);

            // Update user's profile points and achievements count
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null)
            {
                profile.Points += achievement.XpReward;
                profile.AchievementsEarned++;
                _context.Profiles.Update(profile);
            }

            await _context.SaveChangesAsync();

            var response = new UserAchievementResponse
            {
                Id = userAchievement.Id,
                Title = achievement.Title,
                Description = achievement.Description,
                Type = achievement.Type,
                Rarity = achievement.Rarity,
                XpEarned = userAchievement.XpEarned,
                IconName = achievement.IconName,
                BadgeColor = achievement.BadgeColor,
                EarnedAt = userAchievement.EarnedAt,
                Notes = userAchievement.Notes
            };

            return Ok(new ApiResponse<UserAchievementResponse>
            {
                Success = true,
                Message = "Achievement awarded successfully",
                Data = response
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<UserAchievementResponse>
            {
                Success = false,
                Message = "Failed to award achievement",
                Error = ex.Message
            });
        }
    }

    private async Task<List<UserAchievementResponse>> CheckAndAwardUserAchievements(int userId)
    {
        var newAchievements = new List<UserAchievementResponse>();

        // Get user's current stats
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return newAchievements;

        // Get all achievements that the user hasn't earned yet
        var earnedAchievementIds = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync();

        var availableAchievements = await _context.Achievements
            .Where(a => a.IsActive && !earnedAchievementIds.Contains(a.Id))
            .ToListAsync();

        foreach (var achievement in availableAchievements)
        {
            bool shouldAward = false;

            // Check achievement conditions
            switch (achievement.ConditionType)
            {
                case "course_count":
                    shouldAward = profile.CoursesCompleted >= (achievement.ConditionValue ?? 0);
                    break;
                case "project_count":
                    shouldAward = profile.ProjectsSubmitted >= (achievement.ConditionValue ?? 0);
                    break;
                case "streak_days":
                    shouldAward = profile.Streak >= (achievement.ConditionValue ?? 0);
                    break;
                case "skill_count":
                    shouldAward = profile.SkillsAcquired >= (achievement.ConditionValue ?? 0);
                    break;
                case "points_total":
                    shouldAward = profile.Points >= (achievement.ConditionValue ?? 0);
                    break;
                case "learning_hours":
                    shouldAward = profile.LearningHours >= (achievement.ConditionValue ?? 0);
                    break;
                case "profile_views":
                    shouldAward = profile.ProfileViews >= (achievement.ConditionValue ?? 0);
                    break;
            }

            if (shouldAward)
            {
                // Award the achievement
                var userAchievement = new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievement.Id,
                    XpEarned = achievement.XpReward,
                    Notes = "Automatically awarded"
                };

                _context.UserAchievements.Add(userAchievement);

                // Update profile
                profile.Points += achievement.XpReward;
                profile.AchievementsEarned++;

                newAchievements.Add(new UserAchievementResponse
                {
                    Id = userAchievement.Id,
                    Title = achievement.Title,
                    Description = achievement.Description,
                    Type = achievement.Type,
                    Rarity = achievement.Rarity,
                    XpEarned = userAchievement.XpEarned,
                    IconName = achievement.IconName,
                    BadgeColor = achievement.BadgeColor,
                    EarnedAt = userAchievement.EarnedAt,
                    Notes = userAchievement.Notes
                });
            }
        }

        if (newAchievements.Any())
        {
            _context.Profiles.Update(profile);
            await _context.SaveChangesAsync();
        }

        return newAchievements;
    }

    private int CalculateAchievementProgress(int userId, Achievement achievement)
    {
        // This is a placeholder for calculating progress towards achievements
        // In a real implementation, you would calculate the current progress
        // based on the user's stats and the achievement condition
        return 0;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }
}
