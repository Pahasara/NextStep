import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/lib/api";
import { calculateLevel } from "@/lib/levelSystem";
import { 
  BookOpen, 
  Play, 
  FileText, 
  Award,
  CheckCircle,
  Clock,
  Users,
  Star
} from "lucide-react";

const LearningSection = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await apiService.getMyProfile();
      if (profileResponse.success) {
        setUserProfile(profileResponse.data);
      }

      // Fetch available courses
      const coursesResponse = await apiService.getCourses();
      if (coursesResponse.success) {
        setCourses(coursesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real learning stats from user profile
  const learningStats = userProfile ? [
    { icon: BookOpen, label: "Courses", value: userProfile.coursesCompleted?.toString() || "0", color: "text-blue-400" },
    { icon: Play, label: "Learning Hours", value: userProfile.learningHours?.toString() || "0", color: "text-green-400" },
    { icon: FileText, label: "Projects", value: userProfile.projectsSubmitted?.toString() || "0", color: "text-purple-400" },
    { icon: Award, label: "Achievements", value: userProfile.achievementsEarned?.toString() || "0", color: "text-yellow-400" }
  ] : [
    { icon: BookOpen, label: "Courses", value: "0", color: "text-blue-400" },
    { icon: Play, label: "Learning Hours", value: "0", color: "text-green-400" },  
    { icon: FileText, label: "Projects", value: "0", color: "text-purple-400" },
    { icon: Award, label: "Achievements", value: "0", color: "text-yellow-400" }
  ];

  // Create dynamic learning path based on user progress
  const learningPath = userProfile ? [
    {
      phase: "Foundation",
      progress: Math.min(100, (userProfile.coursesCompleted || 0) >= 3 ? 100 : ((userProfile.coursesCompleted || 0) / 3) * 100),
      modules: [
        { name: "Programming Basics", completed: (userProfile.coursesCompleted || 0) >= 1, duration: "2 weeks" },
        { name: "Web Development Intro", completed: (userProfile.coursesCompleted || 0) >= 2, duration: "3 weeks" },
        { name: "Database Fundamentals", completed: (userProfile.coursesCompleted || 0) >= 3, duration: "2 weeks" }
      ]
    },
    {
      phase: "Intermediate",
      progress: Math.min(100, (userProfile.coursesCompleted || 0) >= 8 ? 100 : Math.max(0, ((userProfile.coursesCompleted || 0) - 3) / 5) * 100),
      modules: [
        { name: "Advanced JavaScript", completed: (userProfile.coursesCompleted || 0) >= 4, duration: "4 weeks" },
        { name: "React Framework", completed: (userProfile.coursesCompleted || 0) >= 6, duration: "5 weeks" },
        { name: "Backend Development", completed: (userProfile.coursesCompleted || 0) >= 8, duration: "4 weeks" }
      ]
    },
    {
      phase: "Advanced",
      progress: Math.min(100, Math.max(0, ((userProfile.coursesCompleted || 0) - 8) / 5) * 100),
      modules: [
        { name: "System Design", completed: (userProfile.coursesCompleted || 0) >= 10, duration: "6 weeks" },
        { name: "DevOps Practices", completed: (userProfile.coursesCompleted || 0) >= 12, duration: "5 weeks" },
        { name: "Cloud Architecture", completed: (userProfile.coursesCompleted || 0) >= 15, duration: "4 weeks" }
      ]
    }
  ] : [
    {
      phase: "Foundation",
      progress: 0,
      modules: [
        { name: "Programming Basics", completed: false, duration: "2 weeks" },
        { name: "Web Development Intro", completed: false, duration: "3 weeks" },
        { name: "Database Fundamentals", completed: false, duration: "2 weeks" }
      ]
    },
    {
      phase: "Intermediate",
      progress: 0,
      modules: [
        { name: "Advanced JavaScript", completed: false, duration: "4 weeks" },
        { name: "React Framework", completed: false, duration: "5 weeks" },
        { name: "Backend Development", completed: false, duration: "4 weeks" }
      ]
    },
    {
      phase: "Advanced",
      progress: 0,
      modules: [
        { name: "System Design", completed: false, duration: "6 weeks" },
        { name: "DevOps Practices", completed: false, duration: "5 weeks" },
        { name: "Cloud Architecture", completed: false, duration: "4 weeks" }
      ]
    }
  ];

  // Use real courses from API or fallback to featured courses
  const featuredCourses = courses.length > 0 ? courses.slice(0, 3).map(course => ({
    title: course.title,
    instructor: "NextStep Instructor",
    rating: 4.8,
    students: 1200,
    duration: `${course.estimatedHours || 8} weeks`,
    image: course.thumbnailUrl || "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
    level: course.level || "Intermediate",
    isEnrolled: course.isEnrolled || false,
    isCompleted: course.isCompleted || false,
    progress: course.progress || 0
  })) : [
    {
      title: "Full-Stack Web Development",
      instructor: "NextStep Expert",
      rating: 4.9,
      students: 1250,
      duration: "12 weeks",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
      level: "Intermediate",
      isEnrolled: false,
      isCompleted: false,
      progress: 0
    },
    {
      title: "Machine Learning Fundamentals",
      instructor: "AI Specialist", 
      rating: 4.8,
      students: 890,
      duration: "10 weeks",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=200&fit=crop",
      level: "Advanced",
      isEnrolled: false,
      isCompleted: false,
      progress: 0
    },
    {
      title: "Cybersecurity Essentials",
      instructor: "Security Expert",
      rating: 4.9,
      students: 1100,
      duration: "8 weeks", 
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop",
      level: "Beginner",
      isEnrolled: false,
      isCompleted: false,
      progress: 0
    }
  ];

  return (
    <section id="learning" className="py-20 bg-gradient-to-br from-muted/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Personalized Learning</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Custom <span className="gradient-text">Learning Plans</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get personalized learning roadmaps with curated courses, hands-on projects, 
            and expert-guided content tailored to your career goals.
          </p>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {learningStats.map((stat, index) => (
            <Card key={stat.label} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4 group-hover:animate-glow`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Learning Path Progress */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-primary" />
                Your Learning Journey
              </h3>
              <p className="text-muted-foreground">
                Track your progress through structured learning phases designed for ICT career success.
              </p>
            </div>

            <div className="space-y-6">
              {learningPath.map((phase, index) => (
                <Card key={phase.phase} className="glass-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">{phase.phase} Phase</h4>
                    <div className="text-sm text-muted-foreground">{phase.progress}% Complete</div>
                  </div>
                  
                  <Progress value={phase.progress} className="h-2" />
                  
                  <div className="space-y-3">
                    {phase.modules.map((module, moduleIndex) => (
                      <div key={module.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted" />
                          )}
                          <span className={module.completed ? 'text-foreground' : 'text-muted-foreground'}>
                            {module.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Courses */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-accent" />
                Featured Courses
              </h3>
              <p className="text-muted-foreground">
                High-quality courses from Sri Lankan experts and international instructors.
              </p>
            </div>

            <div className="space-y-6">
              {featuredCourses.map((course, index) => (
                <Card key={course.title} className="glass-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="flex">
                    <div 
                      className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0"
                      style={{
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex-1 p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <h5 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                          {course.title}
                        </h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{course.instructor}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{course.students}</span>
                          </div>
                        </div>
                        <div className="text-muted-foreground">{course.duration}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="hero" className="w-full">
              Explore All Courses
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-glow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold">Ready to Start Learning?</h3>
            
            <p className="text-muted-foreground text-lg">
              Get your personalized learning plan and begin your journey toward a successful ICT career. 
              Join thousands of students already advancing their skills.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="hero" size="lg">
                Create Learning Plan
              </Button>
              <Button variant="glass" size="lg">
                Browse Courses
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LearningSection;