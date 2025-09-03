using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface IProjectService
{
    Task<ApiResponse<IEnumerable<ProjectDto>>> GetProjectsAsync(int? userId = null);
    Task<ApiResponse<IEnumerable<ProjectDto>>> GetAllProjectsAsync();
    Task<ApiResponse<ProjectDto>> GetProjectAsync(int projectId);
    Task<int?> GetProjectOwnerAsync(int projectId);
    Task<ApiResponse<ProjectDto>> CreateProjectAsync(int userId, ProjectDto projectDto);
    Task<ApiResponse<ProjectDto>> UpdateProjectAsync(int projectId, int userId, ProjectDto projectDto);
    Task<ApiResponse<object>> DeleteProjectAsync(int projectId, int userId);
}
