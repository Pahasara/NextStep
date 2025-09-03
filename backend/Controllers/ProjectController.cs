using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Models.DTOs;
using NextStepBackend.Services;
using System.Security.Claims;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects([FromQuery] int? userId = null)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        // Users can only see their own projects unless they're admin
        // For now, enforce that users can only see their own projects
        var targetUserId = currentUserId.Value;
        
        var result = await _projectService.GetProjectsAsync(targetUserId);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllProjects()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        // Check if the current user is an industry expert
        var userRole = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        Console.WriteLine($"DEBUG: User role claim: {userRole}"); // Debug line
        if (userRole != "industry_expert")
            return Forbid("Only industry experts can access all projects");

        var result = await _projectService.GetAllProjectsAsync();

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyProjects()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _projectService.GetProjectsAsync(userId.Value);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        var result = await _projectService.GetProjectAsync(projectId);

        if (result.Success)
        {
            // Check if the current user owns this project
            var project = result.Data;
            if (project != null)
            {
                // For now, users can only view their own projects
                // In the future, you might want to add public/private project settings
                var projectOwner = await _projectService.GetProjectOwnerAsync(projectId);
                if (projectOwner == currentUserId.Value)
                {
                    return Ok(result);
                }
                else
                {
                    return Forbid("You can only view your own projects");
                }
            }
            return Ok(result);
        }
        else
            return NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid data",
                Error = ModelState
            });
        }

        var result = await _projectService.CreateProjectAsync(userId.Value, projectDto);

        if (result.Success)
            return CreatedAtAction(nameof(GetProject), new { projectId = result.Data!.Id }, result);
        else
            return BadRequest(result);
    }

    [HttpPut("{projectId}")]
    public async Task<IActionResult> UpdateProject(int projectId, [FromBody] ProjectDto projectDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid data",
                Error = ModelState
            });
        }

        var result = await _projectService.UpdateProjectAsync(projectId, userId.Value, projectDto);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpDelete("{projectId}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _projectService.DeleteProjectAsync(projectId, userId.Value);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (int.TryParse(userIdClaim, out int userId))
            return userId;
        return null;
    }
}
