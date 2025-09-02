using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Services;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaderboardController : ControllerBase
{
    private readonly ILeaderboardService _leaderboardService;

    public LeaderboardController(ILeaderboardService leaderboardService)
    {
        _leaderboardService = leaderboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var result = await _leaderboardService.GetLeaderboardAsync(page, pageSize);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("my-rank")]
    public async Task<IActionResult> GetMyRank()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _leaderboardService.GetUserRankAsync(userId.Value);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpPost("activity")]
    public async Task<IActionResult> LogActivity([FromBody] LogActivityRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _leaderboardService.LogActivityAsync(
            userId.Value, 
            request.ActivityType, 
            request.Description, 
            request.Points,
            request.Metadata);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("activities")]
    public async Task<IActionResult> GetMyActivities([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _leaderboardService.GetUserActivitiesAsync(userId.Value, page, pageSize);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpPost("profile-view/{userId}")]
    public async Task<IActionResult> IncrementProfileView(int userId)
    {
        var result = await _leaderboardService.IncrementProfileViewAsync(userId);

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

public class LogActivityRequest
{
    public string ActivityType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Points { get; set; }
    public string? Metadata { get; set; }
}
