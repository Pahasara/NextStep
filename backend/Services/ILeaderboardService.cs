using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface ILeaderboardService
{
    Task<ApiResponse<IEnumerable<LeaderboardEntryDto>>> GetLeaderboardAsync(int page, int pageSize);
    Task<ApiResponse<object>> GetUserRankAsync(int userId);
    Task<ApiResponse<object>> LogActivityAsync(int userId, string activityType, string? description, int points, string? metadata = null);
    Task<ApiResponse<IEnumerable<ActivityLogDto>>> GetUserActivitiesAsync(int userId, int page = 1, int pageSize = 20);
    Task<ApiResponse<object>> IncrementProfileViewAsync(int userId);
}
