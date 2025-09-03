using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public class CourseService : ICourseService
{
    private readonly NextStepDbContext _context;
    private readonly ILeaderboardService _leaderboardService;

    public CourseService(NextStepDbContext context, ILeaderboardService leaderboardService)
    {
        _context = context;
        _leaderboardService = leaderboardService;
    }

    public async Task<ApiResponse<List<CourseDto>>> GetCoursesAsync(int userId, string? level = null, string? category = null)
    {
        try
        {
            var query = _context.Courses.Where(c => c.IsActive);

            if (!string.IsNullOrEmpty(level))
                query = query.Where(c => c.Level == level);

            if (!string.IsNullOrEmpty(category))
                query = query.Where(c => c.Category == category);

            var courses = await query.ToListAsync();
            var userCourses = await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .ToListAsync();

            var courseDtos = courses.Select(course =>
            {
                var userCourse = userCourses.FirstOrDefault(uc => uc.CourseId == course.Id);
                return new CourseDto
                {
                    Id = course.Id,
                    Title = course.Title,
                    Description = course.Description,
                    Level = course.Level,
                    Category = course.Category,
                    XpPoints = course.XpPoints,
                    ThumbnailUrl = course.ThumbnailUrl,
                    ExternalUrl = course.ExternalUrl,
                    EstimatedHours = course.EstimatedHours,
                    IsEnrolled = userCourse != null,
                    IsCompleted = userCourse?.IsCompleted ?? false,
                    Progress = userCourse?.Progress ?? 0
                };
            }).ToList();

            return new ApiResponse<List<CourseDto>>
            {
                Success = true,
                Data = courseDtos
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<CourseDto>>
            {
                Success = false,
                Message = "Error retrieving courses",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<CourseDto>> GetCourseAsync(int courseId, int userId)
    {
        try
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return new ApiResponse<CourseDto>
                {
                    Success = false,
                    Message = "Course not found"
                };
            }

            var userCourse = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);

            var courseDto = new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Level = course.Level,
                Category = course.Category,
                XpPoints = course.XpPoints,
                ThumbnailUrl = course.ThumbnailUrl,
                ExternalUrl = course.ExternalUrl,
                EstimatedHours = course.EstimatedHours,
                IsEnrolled = userCourse != null,
                IsCompleted = userCourse?.IsCompleted ?? false,
                Progress = userCourse?.Progress ?? 0
            };

            return new ApiResponse<CourseDto>
            {
                Success = true,
                Data = courseDto
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<CourseDto>
            {
                Success = false,
                Message = "Error retrieving course",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<string>> EnrollInCourseAsync(int userId, int courseId)
    {
        try
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return new ApiResponse<string>
                {
                    Success = false,
                    Message = "Course not found"
                };
            }

            var existingEnrollment = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (existingEnrollment != null)
            {
                return new ApiResponse<string>
                {
                    Success = false,
                    Message = "Already enrolled in this course"
                };
            }

            var userCourse = new UserCourse
            {
                UserId = userId,
                CourseId = courseId,
                EnrolledAt = DateTime.UtcNow
            };

            _context.UserCourses.Add(userCourse);
            await _context.SaveChangesAsync();

            return new ApiResponse<string>
            {
                Success = true,
                Message = "Successfully enrolled in course"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<string>
            {
                Success = false,
                Message = "Error enrolling in course",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<string>> UpdateProgressAsync(int userId, int courseId, int progress)
    {
        try
        {
            var userCourse = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (userCourse == null)
            {
                return new ApiResponse<string>
                {
                    Success = false,
                    Message = "Not enrolled in this course"
                };
            }

            userCourse.Progress = Math.Max(0, Math.Min(100, progress));
            await _context.SaveChangesAsync();

            return new ApiResponse<string>
            {
                Success = true,
                Message = "Progress updated successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<string>
            {
                Success = false,
                Message = "Error updating progress",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<string>> CompleteCourseAsync(int userId, int courseId)
    {
        try
        {
            var userCourse = await _context.UserCourses
                .Include(uc => uc.Course)
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (userCourse == null)
            {
                return new ApiResponse<string>
                {
                    Success = false,
                    Message = "Not enrolled in this course"
                };
            }

            if (userCourse.IsCompleted)
            {
                return new ApiResponse<string>
                {
                    Success = false,
                    Message = "Course already completed"
                };
            }

            userCourse.IsCompleted = true;
            userCourse.Progress = 100;
            userCourse.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log the activity for leaderboard
            var metadata = System.Text.Json.JsonSerializer.Serialize(new 
            { 
                CourseId = courseId, 
                CourseName = userCourse.Course.Title,
                LearningHours = userCourse.Course.EstimatedHours 
            });

            await _leaderboardService.LogActivityAsync(
                userId, 
                "course_completed", 
                $"Completed course: {userCourse.Course.Title}", 
                userCourse.Course.XpPoints,
                metadata);

            return new ApiResponse<string>
            {
                Success = true,
                Message = $"Course completed! You earned {userCourse.Course.XpPoints} XP points."
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<string>
            {
                Success = false,
                Message = "Error completing course",
                Error = ex.Message
            };
        }
    }

    private int CalculateLevel(int points)
    {
        // Simple level calculation: every 500 points = 1 level
        return Math.Max(1, (points / 500) + 1);
    }
}
