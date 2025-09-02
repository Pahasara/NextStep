using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class StudentRating
{
    public int Id { get; set; }

    [Required]
    public int StudentUserId { get; set; } // The student being rated

    [Required]
    public int ExpertUserId { get; set; } // The industry expert giving the rating

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; } // 1-5 star rating

    [StringLength(500)]
    public string? Comment { get; set; } // Optional comment from expert

    [StringLength(100)]
    public string? Category { get; set; } // e.g., "Technical Skills", "Communication", "Problem Solving"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User Student { get; set; } = null!;
    public User Expert { get; set; } = null!;
}
