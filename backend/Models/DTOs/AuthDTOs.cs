using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "student";
}

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class CreateRatingRequest
{
    public int StudentUserId { get; set; }
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public string? Category { get; set; } // e.g., "Technical Skills", "Communication", "Problem Solving"
}

public class UpdateRatingRequest
{
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public string? Category { get; set; }
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public ProfileDto? ProfileData { get; set; }
}
