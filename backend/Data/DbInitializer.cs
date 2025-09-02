using NextStepBackend.Models;

namespace NextStepBackend.Data;

public static class DbInitializer
{
    public static void Initialize(NextStepDbContext context)
    {
        context.Database.EnsureCreated();

        // Check if database is already seeded
        if (context.Courses.Any())
        {
            return;
        }

        // Seed courses
        var courses = new Course[]
        {
            new Course
            {
                Title = "Introduction to Web Development",
                Description = "Learn the basics of HTML, CSS, and JavaScript",
                Level = "foundation",
                Category = "Web Development",
                XpPoints = 100,
                EstimatedHours = 20,
                ExternalUrl = "https://www.codecademy.com/learn/introduction-to-javascript"
            },
            new Course
            {
                Title = "React Fundamentals",
                Description = "Master React.js for modern web applications",
                Level = "intermediate",
                Category = "Frontend Development",
                XpPoints = 150,
                EstimatedHours = 30,
                ExternalUrl = "https://reactjs.org/tutorial/tutorial.html"
            },
            new Course
            {
                Title = "Database Design Principles",
                Description = "Learn SQL and database design concepts",
                Level = "foundation",
                Category = "Database",
                XpPoints = 120,
                EstimatedHours = 25,
                ExternalUrl = "https://sqlbolt.com/"
            },
            new Course
            {
                Title = "Python for Data Science",
                Description = "Introduction to Python, NumPy, and Pandas",
                Level = "intermediate",
                Category = "Data Science",
                XpPoints = 180,
                EstimatedHours = 40,
                ExternalUrl = "https://www.kaggle.com/learn/python"
            },
            new Course
            {
                Title = "Comptia Security+ Certification Prep",
                Description = "Basic concepts of information security",
                Level = "foundation",
                Category = "Cybersecurity",
                XpPoints = 130,
                EstimatedHours = 28,
                ExternalUrl = "https://www.cybrary.it/certification-prep-courses/security-plus"
            }
        };

        context.Courses.AddRange(courses);
        context.SaveChanges();

        // Seed achievements
        var achievements = new Achievement[]
        {
            // Beginner achievements
            new Achievement
            {
                Title = "First Steps",
                Description = "Complete your profile setup",
                Type = "profile",
                Rarity = "Common",
                XpReward = 50,
                IconName = "user-check",
                BadgeColor = "#10B981",
                ConditionType = "profile_complete",
                ConditionValue = 1
            },
            new Achievement
            {
                Title = "Early Bird",
                Description = "Complete your first course",
                Type = "course",
                Rarity = "Common",
                XpReward = 100,
                IconName = "book-open",
                BadgeColor = "#3B82F6",
                ConditionType = "course_count",
                ConditionValue = 1
            },
            new Achievement
            {
                Title = "Project Pioneer",
                Description = "Submit your first project",
                Type = "project",
                Rarity = "Common",
                XpReward = 100,
                IconName = "folder-plus",
                BadgeColor = "#8B5CF6",
                ConditionType = "project_count",
                ConditionValue = 1
            },
            new Achievement
            {
                Title = "Skill Seeker",
                Description = "Learn your first 3 skills",
                Type = "skill",
                Rarity = "Common",
                XpReward = 75,
                IconName = "zap",
                BadgeColor = "#F59E0B",
                ConditionType = "skill_count",
                ConditionValue = 3
            },

            // Intermediate achievements
            new Achievement
            {
                Title = "Course Collector",
                Description = "Complete 5 courses",
                Type = "course",
                Rarity = "Uncommon",
                XpReward = 250,
                IconName = "graduation-cap",
                BadgeColor = "#06B6D4",
                ConditionType = "course_count",
                ConditionValue = 5
            },
            new Achievement
            {
                Title = "Project Pro",
                Description = "Submit 5 projects",
                Type = "project",
                Rarity = "Uncommon",
                XpReward = 250,
                IconName = "briefcase",
                BadgeColor = "#8B5CF6",
                ConditionType = "project_count",
                ConditionValue = 5
            },
            new Achievement
            {
                Title = "Study Streak",
                Description = "Maintain a 7-day learning streak",
                Type = "streak",
                Rarity = "Uncommon",
                XpReward = 200,
                IconName = "flame",
                BadgeColor = "#F97316",
                ConditionType = "streak_days",
                ConditionValue = 7
            },
            new Achievement
            {
                Title = "Point Collector",
                Description = "Earn 1000 XP points",
                Type = "points",
                Rarity = "Uncommon",
                XpReward = 150,
                IconName = "star",
                BadgeColor = "#EAB308",
                ConditionType = "points_total",
                ConditionValue = 1000
            },

            // Advanced achievements
            new Achievement
            {
                Title = "Course Master",
                Description = "Complete 10 courses",
                Type = "course",
                Rarity = "Rare",
                XpReward = 500,
                IconName = "award",
                BadgeColor = "#DC2626",
                ConditionType = "course_count",
                ConditionValue = 10
            },
            new Achievement
            {
                Title = "Portfolio Builder",
                Description = "Submit 10 projects",
                Type = "project",
                Rarity = "Rare",
                XpReward = 500,
                IconName = "folder",
                BadgeColor = "#7C3AED",
                ConditionType = "project_count",
                ConditionValue = 10
            },
            new Achievement
            {
                Title = "Dedication Master",
                Description = "Maintain a 30-day learning streak",
                Type = "streak",
                Rarity = "Rare",
                XpReward = 750,
                IconName = "calendar",
                BadgeColor = "#DC2626",
                ConditionType = "streak_days",
                ConditionValue = 30
            },
            new Achievement
            {
                Title = "Learning Hours Champion",
                Description = "Complete 100 hours of learning",
                Type = "learning",
                Rarity = "Rare",
                XpReward = 600,
                IconName = "clock",
                BadgeColor = "#059669",
                ConditionType = "learning_hours",
                ConditionValue = 100
            },

            // Epic achievements
            new Achievement
            {
                Title = "Skill Virtuoso",
                Description = "Master 15 different skills",
                Type = "skill",
                Rarity = "Epic",
                XpReward = 1000,
                IconName = "target",
                BadgeColor = "#9333EA",
                ConditionType = "skill_count",
                ConditionValue = 15
            },
            new Achievement
            {
                Title = "Popular Profile",
                Description = "Receive 100 profile views",
                Type = "social",
                Rarity = "Epic",
                XpReward = 800,
                IconName = "eye",
                BadgeColor = "#EC4899",
                ConditionType = "profile_views",
                ConditionValue = 100
            },
            new Achievement
            {
                Title = "Marathon Learner",
                Description = "Maintain a 60-day learning streak",
                Type = "streak",
                Rarity = "Epic",
                XpReward = 1500,
                IconName = "trending-up",
                BadgeColor = "#B91C1C",
                ConditionType = "streak_days",
                ConditionValue = 60
            },

            // Legendary achievements
            new Achievement
            {
                Title = "Learning Legend",
                Description = "Complete 25 courses",
                Type = "course",
                Rarity = "Legendary",
                XpReward = 2500,
                IconName = "crown",
                BadgeColor = "#F59E0B",
                ConditionType = "course_count",
                ConditionValue = 25
            },
            new Achievement
            {
                Title = "Project Mastermind",
                Description = "Submit 25 projects",
                Type = "project",
                Rarity = "Legendary",
                XpReward = 2500,
                IconName = "trophy",
                BadgeColor = "#F59E0B",
                ConditionType = "project_count",
                ConditionValue = 25
            },
            new Achievement
            {
                Title = "Ultimate Streaker",
                Description = "Maintain a 100-day learning streak",
                Type = "streak",
                Rarity = "Legendary",
                XpReward = 5000,
                IconName = "zap",
                BadgeColor = "#F59E0B",
                ConditionType = "streak_days",
                ConditionValue = 100
            }
        };

        context.Achievements.AddRange(achievements);
        context.SaveChanges();
    }
}
