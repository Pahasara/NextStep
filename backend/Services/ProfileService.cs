using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;
using System.Text.Json;

namespace NextStepBackend.Services;

public class ProfileService : IProfileService
{
    private readonly NextStepDbContext _context;

    public ProfileService(NextStepDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ProfileResponseDto>> GetProfileAsync(int userId)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return new ApiResponse<ProfileResponseDto>
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            var profile = user.Profile ?? new Profile { UserId = userId };

            var profileDto = new ProfileResponseDto
            {
                Id = userId,
                FullName = user.FullName,
                AvatarUrl = profile.AvatarUrl,
                University = profile.University,
                YearOfStudy = profile.YearOfStudy,
                Major = profile.Major,
                Skills = !string.IsNullOrEmpty(profile.Skills) ? JsonSerializer.Deserialize<List<string>>(profile.Skills) : new List<string>(),
                CareerInterests = !string.IsNullOrEmpty(profile.CareerInterests) ? JsonSerializer.Deserialize<List<string>>(profile.CareerInterests) : new List<string>(),
                GithubUsername = profile.GithubUsername,
                LinkedinUrl = profile.LinkedinUrl,
                PortfolioUrl = profile.PortfolioUrl,
                Points = profile.Points,
                Level = profile.Level,
                Company = profile.Company,
                Position = profile.Position,
                Industry = profile.Industry,
                Experience = profile.Experience,
                CompanyWebsite = profile.CompanyWebsite,
                CompanySize = profile.CompanySize,
                Bio = profile.Bio
            };

            return new ApiResponse<ProfileResponseDto>
            {
                Success = true,
                Data = profileDto
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProfileResponseDto>
            {
                Success = false,
                Message = "Failed to retrieve profile",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<ProfileResponseDto>> UpdateProfileAsync(int userId, UpdateProfileDto updateDto)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return new ApiResponse<ProfileResponseDto>
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            // Update user name if provided
            if (!string.IsNullOrEmpty(updateDto.FullName))
            {
                user.FullName = updateDto.FullName;
                user.UpdatedAt = DateTime.UtcNow;
            }

            // Create or update profile
            if (user.Profile == null)
            {
                user.Profile = new Profile { UserId = userId };
                _context.Profiles.Add(user.Profile);
            }

            var profile = user.Profile;

            // Update profile fields
            if (updateDto.AvatarUrl != null) profile.AvatarUrl = updateDto.AvatarUrl;
            if (updateDto.University != null) profile.University = updateDto.University;
            if (updateDto.YearOfStudy.HasValue) profile.YearOfStudy = updateDto.YearOfStudy;
            if (updateDto.Major != null) profile.Major = updateDto.Major;
            if (updateDto.Skills != null) profile.Skills = JsonSerializer.Serialize(updateDto.Skills);
            if (updateDto.CareerInterests != null) profile.CareerInterests = JsonSerializer.Serialize(updateDto.CareerInterests);
            if (updateDto.GithubUsername != null) profile.GithubUsername = updateDto.GithubUsername;
            if (updateDto.LinkedinUrl != null) profile.LinkedinUrl = updateDto.LinkedinUrl;
            if (updateDto.PortfolioUrl != null) profile.PortfolioUrl = updateDto.PortfolioUrl;
            if (updateDto.Company != null) profile.Company = updateDto.Company;
            if (updateDto.Position != null) profile.Position = updateDto.Position;
            if (updateDto.Industry != null) profile.Industry = updateDto.Industry;
            if (updateDto.Experience != null) profile.Experience = updateDto.Experience;
            if (updateDto.CompanyWebsite != null) profile.CompanyWebsite = updateDto.CompanyWebsite;
            if (updateDto.CompanySize != null) profile.CompanySize = updateDto.CompanySize;
            if (updateDto.Bio != null) profile.Bio = updateDto.Bio;

            profile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetProfileAsync(userId);
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProfileResponseDto>
            {
                Success = false,
                Message = "Failed to update profile",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<ProfileResponseDto>> GetPublicProfileAsync(int userId)
    {
        return await GetProfileAsync(userId); // Same as private for now
    }

    public async Task<ApiResponse<List<ProfileResponseDto>>> GetStudentProfilesAsync(int page, int pageSize)
    {
        try
        {
            var skip = (page - 1) * pageSize;

            var students = await _context.Users
                .Include(u => u.Profile)
                .Where(u => u.Role == "student")
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var profileDtos = students.Select(user =>
            {
                var profile = user.Profile ?? new Profile { UserId = user.Id };
                return new ProfileResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    AvatarUrl = profile.AvatarUrl,
                    University = profile.University,
                    YearOfStudy = profile.YearOfStudy,
                    Major = profile.Major,
                    Skills = !string.IsNullOrEmpty(profile.Skills) ? JsonSerializer.Deserialize<List<string>>(profile.Skills) : new List<string>(),
                    CareerInterests = !string.IsNullOrEmpty(profile.CareerInterests) ? JsonSerializer.Deserialize<List<string>>(profile.CareerInterests) : new List<string>(),
                    GithubUsername = profile.GithubUsername,
                    LinkedinUrl = profile.LinkedinUrl,
                    PortfolioUrl = profile.PortfolioUrl,
                    Points = profile.Points,
                    Level = profile.Level,
                    Company = profile.Company,
                    Position = profile.Position,
                    Industry = profile.Industry,
                    Experience = profile.Experience,
                    CompanyWebsite = profile.CompanyWebsite,
                    CompanySize = profile.CompanySize,
                    Bio = profile.Bio
                };
            }).ToList();

            return new ApiResponse<List<ProfileResponseDto>>
            {
                Success = true,
                Data = profileDtos,
                Message = "Student profiles retrieved successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ProfileResponseDto>>
            {
                Success = false,
                Message = "Failed to retrieve student profiles",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<List<ProfileResponseDto>>> GetIndustryExpertProfilesAsync(int page, int pageSize)
    {
        try
        {
            var experts = await _context.Users
                .Where(u => u.Role == "industry_expert")
                .Include(u => u.Profile)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var profileDtos = experts.Select(user =>
            {
                var profile = user.Profile ?? new Profile { UserId = user.Id };
                return new ProfileResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    AvatarUrl = profile.AvatarUrl,
                    University = profile.University,
                    YearOfStudy = profile.YearOfStudy,
                    Major = profile.Major,
                    Skills = !string.IsNullOrEmpty(profile.Skills) ? JsonSerializer.Deserialize<List<string>>(profile.Skills) : new List<string>(),
                    CareerInterests = !string.IsNullOrEmpty(profile.CareerInterests) ? JsonSerializer.Deserialize<List<string>>(profile.CareerInterests) : new List<string>(),
                    GithubUsername = profile.GithubUsername,
                    LinkedinUrl = profile.LinkedinUrl,
                    PortfolioUrl = profile.PortfolioUrl,
                    Points = profile.Points,
                    Level = profile.Level,
                    Company = profile.Company,
                    Position = profile.Position,
                    Industry = profile.Industry,
                    Experience = profile.Experience,
                    CompanyWebsite = profile.CompanyWebsite,
                    CompanySize = profile.CompanySize,
                    Bio = profile.Bio
                };
            }).ToList();

            return new ApiResponse<List<ProfileResponseDto>>
            {
                Success = true,
                Data = profileDtos,
                Message = "Industry expert profiles retrieved successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ProfileResponseDto>>
            {
                Success = false,
                Message = "Failed to retrieve industry expert profiles",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<List<ProfileResponseDto>>> GetAllUserProfilesAsync(int page, int pageSize, string? role = null)
    {
        try
        {
            var query = _context.Users.Include(u => u.Profile).AsQueryable();

            // Filter by role if specified
            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(u => u.Role == role);
            }

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var profileDtos = users.Select(user =>
            {
                var profile = user.Profile ?? new Profile { UserId = user.Id };
                return new ProfileResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    AvatarUrl = profile.AvatarUrl,
                    University = profile.University,
                    YearOfStudy = profile.YearOfStudy,
                    Major = profile.Major,
                    Skills = !string.IsNullOrEmpty(profile.Skills) ? JsonSerializer.Deserialize<List<string>>(profile.Skills) : new List<string>(),
                    CareerInterests = !string.IsNullOrEmpty(profile.CareerInterests) ? JsonSerializer.Deserialize<List<string>>(profile.CareerInterests) : new List<string>(),
                    GithubUsername = profile.GithubUsername,
                    LinkedinUrl = profile.LinkedinUrl,
                    PortfolioUrl = profile.PortfolioUrl,
                    Points = profile.Points,
                    Level = profile.Level,
                    Company = profile.Company,
                    Position = profile.Position,
                    Industry = profile.Industry,
                    Experience = profile.Experience,
                    CompanyWebsite = profile.CompanyWebsite,
                    CompanySize = profile.CompanySize,
                    Bio = profile.Bio
                };
            }).ToList();

            return new ApiResponse<List<ProfileResponseDto>>
            {
                Success = true,
                Data = profileDtos,
                Message = "User profiles retrieved successfully"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ProfileResponseDto>>
            {
                Success = false,
                Message = "Failed to retrieve user profiles",
                Error = ex.Message
            };
        }
    }
}