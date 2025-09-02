using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Models.DTOs;
using NextStepBackend.Services;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    /// <summary>
    /// Create a new rating for a student (Industry experts only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "industry_expert")]
    public async Task<IActionResult> CreateRating([FromBody] CreateRatingRequest request)
    {
        var expertUserId = GetCurrentUserId();
        if (expertUserId == null)
            return Unauthorized();

        var result = await _ratingService.CreateRatingAsync(expertUserId.Value, request);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    /// <summary>
    /// Update an existing rating (Industry experts only)
    /// </summary>
    [HttpPut("{ratingId}")]
    [Authorize(Roles = "industry_expert")]
    public async Task<IActionResult> UpdateRating(int ratingId, [FromBody] UpdateRatingRequest request)
    {
        var expertUserId = GetCurrentUserId();
        if (expertUserId == null)
            return Unauthorized();

        var result = await _ratingService.UpdateRatingAsync(ratingId, expertUserId.Value, request);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    /// <summary>
    /// Delete a rating (Industry experts only)
    /// </summary>
    [HttpDelete("{ratingId}")]
    [Authorize(Roles = "industry_expert")]
    public async Task<IActionResult> DeleteRating(int ratingId)
    {
        var expertUserId = GetCurrentUserId();
        if (expertUserId == null)
            return Unauthorized();

        var result = await _ratingService.DeleteRatingAsync(ratingId, expertUserId.Value);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    /// <summary>
    /// Get rating statistics for a student
    /// </summary>
    [HttpGet("student/{studentUserId}/stats")]
    public async Task<IActionResult> GetStudentRatingStats(int studentUserId)
    {
        var result = await _ratingService.GetStudentRatingStatsAsync(studentUserId);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    /// <summary>
    /// Get all ratings for a student
    /// </summary>
    [HttpGet("student/{studentUserId}")]
    public async Task<IActionResult> GetStudentRatings(int studentUserId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _ratingService.GetStudentRatingsAsync(studentUserId, page, pageSize);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    /// <summary>
    /// Get all ratings given by an expert
    /// </summary>
    [HttpGet("expert/my-ratings")]
    [Authorize(Roles = "industry_expert")]
    public async Task<IActionResult> GetMyRatings([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var expertUserId = GetCurrentUserId();
        if (expertUserId == null)
            return Unauthorized();

        var result = await _ratingService.GetExpertRatingsAsync(expertUserId.Value, page, pageSize);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    /// <summary>
    /// Get expert's rating for a specific student
    /// </summary>
    [HttpGet("expert/student/{studentUserId}")]
    [Authorize(Roles = "industry_expert")]
    public async Task<IActionResult> GetExpertRatingForStudent(int studentUserId, [FromQuery] string? category = null)
    {
        var expertUserId = GetCurrentUserId();
        if (expertUserId == null)
            return Unauthorized();

        var result = await _ratingService.GetExpertRatingForStudentAsync(expertUserId.Value, studentUserId, category);

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
