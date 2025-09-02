import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Users, 
  Trophy, 
  Target,
  BarChart3,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import API from "@/lib/api";
import CourseAnalytics from "./CourseAnalytics";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  image_url: string;
  video_url?: string;
  career_path: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  video_url?: string;
}

interface LearningPathProps {
  careerPath: string;
  onClose?: () => void;
}

interface UserProgress {
  course_id: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
  time_spent: number;
}

const LearningPath = ({ careerPath, onClose }: LearningPathProps) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  // Mock data for demonstration
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React including components, state, and props',
      instructor: 'Prof. Kasun Perera',
      duration: '8 weeks',
      level: 'Beginner',
      rating: 4.8,
      students: 1250,
      image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop',
      career_path: careerPath,
      modules: [
        { id: '1', title: 'Introduction to React', duration: '2 hours', completed: true },
        { id: '2', title: 'Components and JSX', duration: '3 hours', completed: true },
        { id: '3', title: 'State and Props', duration: '4 hours', completed: false },
        { id: '4', title: 'Event Handling', duration: '3 hours', completed: false },
        { id: '5', title: 'Project: Todo App', duration: '5 hours', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts and ES6+ features',
      instructor: 'Dr. Sanduni Silva',
      duration: '10 weeks',
      level: 'Intermediate',
      rating: 4.9,
      students: 890,
      image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=200&fit=crop',
      career_path: careerPath,
      modules: [
        { id: '1', title: 'Closures and Scope', duration: '3 hours', completed: true },
        { id: '2', title: 'Promises and Async/Await', duration: '4 hours', completed: false },
        { id: '3', title: 'Modules and Bundling', duration: '3 hours', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Node.js Backend Development',
      description: 'Build scalable server-side applications with Node.js',
      instructor: 'Eng. Nuwan Fernando',
      duration: '12 weeks',
      level: 'Advanced',
      rating: 4.7,
      students: 650,
      image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop',
      career_path: careerPath,
      modules: [
        { id: '1', title: 'Node.js Fundamentals', duration: '4 hours', completed: false },
        { id: '2', title: 'Express.js Framework', duration: '5 hours', completed: false },
        { id: '3', title: 'Database Integration', duration: '6 hours', completed: false }
      ]
    }
  ];

  // Mock progress data
  const progressData = [
    { name: 'Week 1', progress: 20, courses: 1, hours: 8 },
    { name: 'Week 2', progress: 35, courses: 2, hours: 12 },
    { name: 'Week 3', progress: 45, courses: 2, hours: 15 },
    { name: 'Week 4', progress: 60, courses: 3, hours: 18 },
    { name: 'Week 5', progress: 75, courses: 3, hours: 22 },
    { name: 'Week 6', progress: 85, courses: 4, hours: 25 },
    { name: 'Week 7', progress: 90, courses: 4, hours: 28 }
  ];

  const skillsData = [
    { name: 'React', value: 85, color: '#3B82F6' },
    { name: 'JavaScript', value: 90, color: '#10B981' },
    { name: 'Node.js', value: 60, color: '#F59E0B' },
    { name: 'CSS', value: 75, color: '#8B5CF6' }
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 0.8 }
  ];

  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      setLoading(true);
      try {
        // Fetch courses from API
        const coursesResponse = await API.getCourses({ career_path: careerPath });
        if (coursesResponse.success) {
          setCourses(coursesResponse.data || mockCourses);
        } else {
          // Fallback to mock data if API fails
          setCourses(mockCourses);
        }

        // Fetch user progress if logged in
        if (user) {
          const analyticsResponse = await API.getMyAnalytics();
          if (analyticsResponse.success && analyticsResponse.data?.courseProgress) {
            setUserProgress(analyticsResponse.data.courseProgress);
          } else {
            // Fallback to mock progress
            setUserProgress([
              { course_id: '1', progress: 40, completed: false, last_accessed: '2024-01-15', time_spent: 120 },
              { course_id: '2', progress: 20, completed: false, last_accessed: '2024-01-10', time_spent: 60 }
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Use mock data as fallback
        setCourses(mockCourses);
        setUserProgress([
          { course_id: '1', progress: 40, completed: false, last_accessed: '2024-01-15', time_spent: 120 },
          { course_id: '2', progress: 20, completed: false, last_accessed: '2024-01-10', time_spent: 60 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndProgress();
  }, [careerPath, user]);

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }

    try {
      const response = await API.enrollInCourse(courseId);
      if (response.success) {
        toast.success('Successfully enrolled in course!');
        
        // Update user progress locally
        setUserProgress(prev => [
          ...prev.filter(p => p.course_id !== courseId),
          { 
            course_id: courseId, 
            progress: 0, 
            completed: false, 
            last_accessed: new Date().toISOString(), 
            time_spent: 0 
          }
        ]);

        // Log activity
        await API.post('/analytics/activity', {
          type: 'course_enrollment',
          course_id: courseId,
          metadata: { career_path: careerPath }
        });
      } else {
        toast.error(response.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const markModuleComplete = async (courseId: string, moduleId: string) => {
    if (!user) {
      toast.error('Please login to track progress');
      return;
    }

    try {
      // Update UI optimistically
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              modules: course.modules.map(module =>
                module.id === moduleId ? { ...module, completed: true } : module
              )
            }
          : course
      ));

      // Calculate new progress
      const course = courses.find(c => c.id === courseId);
      if (course) {
        const completedModules = course.modules.filter(m => m.completed || m.id === moduleId).length;
        const totalModules = course.modules.length;
        const newProgress = Math.round((completedModules / totalModules) * 100);

        // Update progress locally
        setUserProgress(prev => prev.map(p => 
          p.course_id === courseId 
            ? { ...p, progress: newProgress, completed: newProgress === 100, last_accessed: new Date().toISOString() }
            : p
        ));

        // Log activity to backend
        await API.post('/analytics/activity', {
          type: 'module_completion',
          course_id: courseId,
          module_id: moduleId,
          metadata: { 
            progress: newProgress,
            career_path: careerPath,
            completed: newProgress === 100
          }
        });

        // Check for achievements
        await API.post('/achievements/check', {
          type: 'course_progress',
          course_id: courseId,
          progress: newProgress
        });

        toast.success(newProgress === 100 ? 'Course completed! 🎉' : 'Module completed!');
      }
    } catch (error) {
      console.error('Error marking module complete:', error);
      toast.error('Failed to update progress');
    }
  };

  const getCourseProgress = (courseId: string) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    return progress ? progress.progress : 0;
  };

  const isEnrolled = (courseId: string) => {
    return userProgress.some(p => p.course_id === courseId);
  };

  const overallProgress = Math.round(
    userProgress.reduce((sum, p) => sum + p.progress, 0) / Math.max(userProgress.length, 1)
  );

  const completedCourses = userProgress.filter(p => p.completed).length;
  const totalStudyHours = userProgress.reduce((sum, p) => sum + p.time_spent, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{careerPath} Learning Path</h2>
          <p className="text-muted-foreground">
            Master skills through structured courses and track your progress
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Learning Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{completedCourses}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalStudyHours}h</div>
                <div className="text-sm text-muted-foreground">Study Time</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="glass-card group hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={
                          course.level === 'Beginner' ? 'default' :
                          course.level === 'Intermediate' ? 'secondary' : 'destructive'
                        }>
                          {course.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isEnrolled(course.id) && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getCourseProgress(course.id)}%</span>
                      </div>
                      <Progress value={getCourseProgress(course.id)} className="h-2" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {isEnrolled(course.id) ? (
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : (
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        onClick={() => enrollInCourse(course.id)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Enroll Now
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Course Modules */}
          {selectedCourse ? (
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedCourse.title} - Modules</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                    Back to Courses
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCourse.modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      module.completed ? 'bg-green-50 border-green-200' : 'bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => markModuleComplete(selectedCourse.id, module.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrolled Courses Progress */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.filter(course => isEnrolled(course.id)).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{course.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {getCourseProgress(course.id)}%
                        </span>
                      </div>
                      <Progress value={getCourseProgress(course.id)} className="h-2" />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedCourse(course)}
                      >
                        View Modules
                      </Button>
                    </div>
                  ))}
                  {userProgress.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No courses enrolled yet. Start by enrolling in a course!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Progress Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="progress" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Skills Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.value}%</span>
                      </div>
                      <Progress value={skill.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">7</div>
                <p className="text-muted-foreground">Days in a row</p>
                <div className="mt-4 flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-orange-500 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <div className="font-medium">First Course Completed</div>
                      <div className="text-sm text-muted-foreground">React Fundamentals</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-blue-500" />
                    <div>
                      <div className="font-medium">Week Warrior</div>
                      <div className="text-sm text-muted-foreground">7 days streak</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6 text-purple-500" />
                    <div>
                      <div className="font-medium">Quick Learner</div>
                      <div className="text-sm text-muted-foreground">Completed 5 modules this week</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <CourseAnalytics userId={user?.id} careerPath={careerPath} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPath;
