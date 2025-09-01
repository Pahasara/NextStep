using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface IProfileService
{
    Task<ApiResponse<ProfileResponseDto>> GetProfileAsync(int userId);
    Task<ApiResponse<ProfileResponseDto>> UpdateProfileAsync(int userId, UpdateProfileDto updateDto);
    Task<ApiResponse<ProfileResponseDto>> GetPublicProfileAsync(int userId);
    Task<ApiResponse<List<ProfileResponseDto>>> GetStudentProfilesAsync(int page, int pageSize);
    Task<ApiResponse<List<ProfileResponseDto>>> GetIndustryExpertProfilesAsync(int page, int pageSize);
    Task<ApiResponse<List<ProfileResponseDto>>> GetAllUserProfilesAsync(int page, int pageSize, string? role = null);
}