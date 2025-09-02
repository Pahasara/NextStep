using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public class RatingService : IRatingService
{
    private readonly NextStepDbContext _context;

    public RatingService(NextStepDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<StudentRatingDto>> CreateRatingAsync(int expertUserId, CreateRatingRequest request)
    {
        try
        {
            // Validate that the expert exists and is an industry expert
            var expert = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == expertUserId && u.Role == "industry_expert");

            if (expert == null)
            {
                return new ApiResponse<StudentRatingDto>
                {
                    Success = false,
                    Message = "Only industry experts can rate students"
                };
            }

            // Validate that the student exists and is a student
            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.StudentUserId && u.Role == "student");

            if (student == null)
            {
                return new ApiResponse<StudentRatingDto>
                {
                    Success = false,
                    Message = "Student not found"
                };
            }

            // Check if expert has already rated this student in this category
            var existingRating = await _context.StudentRatings
                .FirstOrDefaultAsync(r => r.ExpertUserId == expertUserId && 
                                         r.StudentUserId == request.StudentUserId && 
                                         r.Category == request.Category);

            if (existingRating != null)
            {
                return new ApiResponse<StudentRatingDto>
                {
                    Success = false,
                    Message = "You have already rated this student in this category. Use update instead."
                };
            }

            // Create new rating
            var rating = new StudentRating
            {
                StudentUserId = request.StudentUserId,
                ExpertUserId = expertUserId,
                Rating = request.Rating,
                Comment = request.Comment,
                Category = request.Category ?? "Overall",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.StudentRatings.Add(rating);
            await _context.SaveChangesAsync();

            // Update student's average rating
            await UpdateStudentAverageRatingAsync(request.StudentUserId);

            // Load the created rating with expert info
            var createdRating = await _context.StudentRatings
                .Include(r => r.Expert)
                .ThenInclude(e => e.Profile)
                .FirstOrDefaultAsync(r => r.Id == rating.Id);

            var ratingDto = MapToDto(createdRating!);

            return new ApiResponse<StudentRatingDto>
            {
                Success = true,
                Data = ratingDto,
                Message = "Rating created successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<StudentRatingDto>
            {
                Success = false,
                Message = "Failed to create rating",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<StudentRatingDto>> UpdateRatingAsync(int ratingId, int expertUserId, UpdateRatingRequest request)
    {
        try
        {
            var rating = await _context.StudentRatings
                .Include(r => r.Expert)
                .ThenInclude(e => e.Profile)
                .FirstOrDefaultAsync(r => r.Id == ratingId && r.ExpertUserId == expertUserId);

            if (rating == null)
            {
                return new ApiResponse<StudentRatingDto>
                {
                    Success = false,
                    Message = "Rating not found or you don't have permission to update it"
                };
            }

            rating.Rating = request.Rating;
            rating.Comment = request.Comment;
            rating.Category = request.Category ?? rating.Category;
            rating.UpdatedAt = DateTime.UtcNow;

            _context.StudentRatings.Update(rating);
            await _context.SaveChangesAsync();

            // Update student's average rating
            await UpdateStudentAverageRatingAsync(rating.StudentUserId);

            var ratingDto = MapToDto(rating);

            return new ApiResponse<StudentRatingDto>
            {
                Success = true,
                Data = ratingDto,
                Message = "Rating updated successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<StudentRatingDto>
            {
                Success = false,
                Message = "Failed to update rating",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> DeleteRatingAsync(int ratingId, int expertUserId)
    {
        try
        {
            var rating = await _context.StudentRatings
                .FirstOrDefaultAsync(r => r.Id == ratingId && r.ExpertUserId == expertUserId);

            if (rating == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = "Rating not found or you don't have permission to delete it"
                };
            }

            var studentUserId = rating.StudentUserId;
            _context.StudentRatings.Remove(rating);
            await _context.SaveChangesAsync();

            // Update student's average rating
            await UpdateStudentAverageRatingAsync(studentUserId);

            return new ApiResponse<object>
            {
                Success = true,
                Message = "Rating deleted successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to delete rating",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<RatingStatsDto>> GetStudentRatingStatsAsync(int studentUserId)
    {
        try
        {
            var ratings = await _context.StudentRatings
                .Include(r => r.Expert)
                .ThenInclude(e => e.Profile)
                .Where(r => r.StudentUserId == studentUserId)
                .ToListAsync();

            if (!ratings.Any())
            {
                return new ApiResponse<RatingStatsDto>
                {
                    Success = true,
                    Data = new RatingStatsDto
                    {
                        AverageRating = 0,
                        TotalRatings = 0,
                        CategoryRatings = new Dictionary<string, double>(),
                        RecentRatings = new List<StudentRatingDto>()
                    }
                };
            }

            var stats = new RatingStatsDto
            {
                AverageRating = Math.Round(ratings.Average(r => r.Rating), 1),
                TotalRatings = ratings.Count,
                CategoryRatings = ratings
                    .GroupBy(r => r.Category ?? "Overall")
                    .ToDictionary(g => g.Key, g => Math.Round(g.Average(r => r.Rating), 1)),
                RecentRatings = ratings
                    .OrderByDescending(r => r.CreatedAt)
                    .Take(5)
                    .Select(MapToDto)
                    .ToList()
            };

            return new ApiResponse<RatingStatsDto>
            {
                Success = true,
                Data = stats
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<RatingStatsDto>
            {
                Success = false,
                Message = "Failed to get rating stats",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<StudentRatingDto>>> GetStudentRatingsAsync(int studentUserId, int page = 1, int pageSize = 20)
    {
        try
        {
            var skip = (page - 1) * pageSize;

            var ratings = await _context.StudentRatings
                .Include(r => r.Expert)
                .ThenInclude(e => e.Profile)
                .Where(r => r.StudentUserId == studentUserId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var ratingDtos = ratings.Select(MapToDto).ToList();

            return new ApiResponse<IEnumerable<StudentRatingDto>>
            {
                Success = true,
                Data = ratingDtos
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<StudentRatingDto>>
            {
                Success = false,
                Message = "Failed to get student ratings",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<StudentRatingDto>>> GetExpertRatingsAsync(int expertUserId, int page = 1, int pageSize = 20)
    {
        try
        {
            var skip = (page - 1) * pageSize;

            var ratings = await _context.StudentRatings
                .Include(r => r.Student)
                .Include(r => r.Expert)
                .ThenInclude(e => e.Profile)
                .Where(r => r.ExpertUserId == expertUserId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var ratingDtos = ratings.Select(MapToDto).ToList();

            return new ApiResponse<IEnumerable<StudentRatingDto>>
            {
                Success = true,
                Data = ratingDtos
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<StudentRatingDto>>
            {
                Success = false,
                Message = "Failed to get expert ratings",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<StudentRatingDto?>> GetExpertRatingForStudentAsync(int expertUserId, int studentUserId, string? category = null)
    {
        try
        {
            var query = _context.StudentRatings
                .Include(r => r.Expert)
                .ThenInclude(e => e.Profile)
                .Where(r => r.ExpertUserId == expertUserId && r.StudentUserId == studentUserId);

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(r => r.Category == category);
            }

            var rating = await query.FirstOrDefaultAsync();

            var result = rating != null ? MapToDto(rating) : null;

            return new ApiResponse<StudentRatingDto?>
            {
                Success = true,
                Data = result
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<StudentRatingDto?>
            {
                Success = false,
                Message = "Failed to get rating",
                Error = ex.Message
            };
        }
    }

    private async Task UpdateStudentAverageRatingAsync(int studentUserId)
    {
        var averageRating = await _context.StudentRatings
            .Where(r => r.StudentUserId == studentUserId)
            .AverageAsync(r => (double?)r.Rating) ?? 0.0;

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == studentUserId);
        if (profile != null)
        {
            profile.MentorshipRating = Math.Round(averageRating, 1);
            _context.Profiles.Update(profile);
            await _context.SaveChangesAsync();
        }
    }

    private static StudentRatingDto MapToDto(StudentRating rating)
    {
        return new StudentRatingDto
        {
            Id = rating.Id,
            StudentUserId = rating.StudentUserId,
            ExpertUserId = rating.ExpertUserId,
            ExpertName = rating.Expert.FullName,
            ExpertCompany = rating.Expert.Profile?.Company,
            ExpertPosition = rating.Expert.Profile?.Position,
            Rating = rating.Rating,
            Comment = rating.Comment,
            Category = rating.Category,
            CreatedAt = rating.CreatedAt,
            UpdatedAt = rating.UpdatedAt
        };
    }
}
