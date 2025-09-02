using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;
using System.Text.Json;

namespace NextStepBackend.Services;

public class ProjectService : IProjectService
{
    private readonly NextStepDbContext _context;
    private readonly ILeaderboardService _leaderboardService;
    private readonly IAchievementService _achievementService;

    public ProjectService(NextStepDbContext context, ILeaderboardService leaderboardService, IAchievementService achievementService)
    {
        _context = context;
        _leaderboardService = leaderboardService;
        _achievementService = achievementService;
    }

    public async Task<ApiResponse<IEnumerable<ProjectDto>>> GetProjectsAsync(int? userId = null)
    {
        try
        {
            var query = _context.Projects.Include(p => p.User).AsQueryable();

            if (userId.HasValue)
                query = query.Where(p => p.UserId == userId.Value);

            var projects = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();

            var projectDtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ProjectUrl = p.ProjectUrl,
                GithubUrl = p.GithubUrl,
                Technologies = !string.IsNullOrEmpty(p.Technologies) ? JsonSerializer.Deserialize<List<string>>(p.Technologies) : new List<string>(),
                ImageUrls = !string.IsNullOrEmpty(p.ImageUrls) ? JsonSerializer.Deserialize<List<string>>(p.ImageUrls) : new List<string>(),
                CreatedAt = p.CreatedAt,
                UserName = p.User.FullName
            });

            return new ApiResponse<IEnumerable<ProjectDto>>
            {
                Success = true,
                Data = projectDtos
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<ProjectDto>>
            {
                Success = false,
                Message = "Failed to retrieve projects",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<ProjectDto>>> GetAllProjectsAsync()
    {
        try
        {
            var projects = await _context.Projects
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var projectDtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ProjectUrl = p.ProjectUrl,
                GithubUrl = p.GithubUrl,
                Technologies = !string.IsNullOrEmpty(p.Technologies) ? JsonSerializer.Deserialize<List<string>>(p.Technologies) : new List<string>(),
                ImageUrls = !string.IsNullOrEmpty(p.ImageUrls) ? JsonSerializer.Deserialize<List<string>>(p.ImageUrls) : new List<string>(),
                CreatedAt = p.CreatedAt,
                UserName = p.User.FullName
            });

            return new ApiResponse<IEnumerable<ProjectDto>>
            {
                Success = true,
                Data = projectDtos
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<ProjectDto>>
            {
                Success = false,
                Message = "Failed to retrieve all projects",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<ProjectDto>> GetProjectAsync(int projectId)
    {
        try
        {
            var project = await _context.Projects
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
            {
                return new ApiResponse<ProjectDto>
                {
                    Success = false,
                    Message = "Project not found"
                };
            }

            var projectDto = new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                ProjectUrl = project.ProjectUrl,
                GithubUrl = project.GithubUrl,
                Technologies = !string.IsNullOrEmpty(project.Technologies) ? JsonSerializer.Deserialize<List<string>>(project.Technologies) : new List<string>(),
                ImageUrls = !string.IsNullOrEmpty(project.ImageUrls) ? JsonSerializer.Deserialize<List<string>>(project.ImageUrls) : new List<string>(),
                CreatedAt = project.CreatedAt,
                UserName = project.User.FullName
            };

            return new ApiResponse<ProjectDto>
            {
                Success = true,
                Data = projectDto
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProjectDto>
            {
                Success = false,
                Message = "Failed to retrieve project",
                Error = ex.Message
            };
        }
    }

    public async Task<int?> GetProjectOwnerAsync(int projectId)
    {
        try
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);
            return project?.UserId;
        }
        catch
        {
            return null;
        }
    }

    public async Task<ApiResponse<ProjectDto>> CreateProjectAsync(int userId, ProjectDto projectDto)
    {
        try
        {
            var project = new Project
            {
                UserId = userId,
                Title = projectDto.Title,
                Description = projectDto.Description,
                ProjectUrl = projectDto.ProjectUrl,
                GithubUrl = projectDto.GithubUrl,
                Technologies = projectDto.Technologies != null ? JsonSerializer.Serialize(projectDto.Technologies) : null,
                ImageUrls = projectDto.ImageUrls != null ? JsonSerializer.Serialize(projectDto.ImageUrls) : null
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Update user profile project count
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null)
            {
                profile.ProjectsSubmitted++;
                profile.LastActivityDate = DateTime.UtcNow;
                profile.UpdatedAt = DateTime.UtcNow;
            }

            // Log the activity for leaderboard
            var metadata = JsonSerializer.Serialize(new 
            { 
                ProjectId = project.Id, 
                ProjectTitle = project.Title,
                Technologies = projectDto.Technologies?.Count ?? 0
            });

            await _leaderboardService.LogActivityAsync(
                userId, 
                "project_submitted", 
                $"Submitted project: {project.Title}", 
                50, // Points for project submission
                metadata);

            // Check and award achievements after project creation
            await _achievementService.CheckAndAwardUserAchievementsAsync(userId);

            await _context.SaveChangesAsync();

            return await GetProjectAsync(project.Id);
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProjectDto>
            {
                Success = false,
                Message = "Failed to create project",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<ProjectDto>> UpdateProjectAsync(int projectId, int userId, ProjectDto projectDto)
    {
        try
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return new ApiResponse<ProjectDto>
                {
                    Success = false,
                    Message = "Project not found or you don't have permission to update it"
                };
            }

            project.Title = projectDto.Title;
            project.Description = projectDto.Description;
            project.ProjectUrl = projectDto.ProjectUrl;
            project.GithubUrl = projectDto.GithubUrl;
            project.Technologies = projectDto.Technologies != null ? JsonSerializer.Serialize(projectDto.Technologies) : null;
            project.ImageUrls = projectDto.ImageUrls != null ? JsonSerializer.Serialize(projectDto.ImageUrls) : null;

            await _context.SaveChangesAsync();

            return await GetProjectAsync(project.Id);
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProjectDto>
            {
                Success = false,
                Message = "Failed to update project",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> DeleteProjectAsync(int projectId, int userId)
    {
        try
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = "Project not found or you don't have permission to delete it"
                };
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return new ApiResponse<object>
            {
                Success = true,
                Message = "Project deleted successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to delete project",
                Error = ex.Message
            };
        }
    }
}
