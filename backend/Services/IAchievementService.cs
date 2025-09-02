using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface IAchievementService
{
    Task<ApiResponse<IEnumerable<Achievement>>> GetAchievementsAsync();
    Task<ApiResponse<IEnumerable<UserAchievementDto>>> GetUserAchievementsAsync(int userId);
    Task<ApiResponse<IEnumerable<UserAchievementDto>>> CheckAndAwardUserAchievementsAsync(int userId);
    Task<ApiResponse<UserAchievementDto>> AwardAchievementAsync(int userId, int achievementId, string? notes = null);
}
