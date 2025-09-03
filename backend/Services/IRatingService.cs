using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface IRatingService
{
    Task<ApiResponse<StudentRatingDto>> CreateRatingAsync(int expertUserId, CreateRatingRequest request);
    Task<ApiResponse<StudentRatingDto>> UpdateRatingAsync(int ratingId, int expertUserId, UpdateRatingRequest request);
    Task<ApiResponse<object>> DeleteRatingAsync(int ratingId, int expertUserId);
    Task<ApiResponse<RatingStatsDto>> GetStudentRatingStatsAsync(int studentUserId);
    Task<ApiResponse<IEnumerable<StudentRatingDto>>> GetStudentRatingsAsync(int studentUserId, int page = 1, int pageSize = 20);
    Task<ApiResponse<IEnumerable<StudentRatingDto>>> GetExpertRatingsAsync(int expertUserId, int page = 1, int pageSize = 20);
    Task<ApiResponse<StudentRatingDto?>> GetExpertRatingForStudentAsync(int expertUserId, int studentUserId, string? category = null);
}
