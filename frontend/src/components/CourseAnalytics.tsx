import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  BarChart3,
  User,
  Book,
  CheckCircle,
  Star,
  Award,
  Activity,
  Zap,
  BookOpen,
  PlayCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface CourseAnalyticsProps {
  userId?: string;
  careerPath: string;
}

const CourseAnalytics = ({ userId, careerPath }: CourseAnalyticsProps) => {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(false);

  // Analytics data for new students - all reset to zero
  const analyticsData = {
    overview: {
      totalCourses: 0, // Reset to 0 for new students
      completedCourses: 0, // Reset to 0 for new students
      inProgressCourses: 0, // Reset to 0 for new students
      totalHours: 0, // Reset to 0 for new students
      averageRating: 0, // Reset to 0 for new students
      currentStreak: 0, // Reset to 0 for new students
      longestStreak: 0, // Reset to 0 for new students
      skillsAcquired: 0 // Reset to 0 for new students
    },
    
    progressTrend: [
      { date: '2024-01-01', courses: 0, hours: 0, progress: 0 },
      { date: '2024-01-08', courses: 0, hours: 0, progress: 0 },
      { date: '2024-01-15', courses: 0, hours: 0, progress: 0 },
      { date: '2024-01-22', courses: 0, hours: 0, progress: 0 },
      { date: '2024-01-29', courses: 0, hours: 0, progress: 0 },
      { date: '2024-02-05', courses: 0, hours: 0, progress: 0 },
      { date: '2024-02-12', courses: 0, hours: 0, progress: 0 },
      { date: '2024-02-19', courses: 0, hours: 0, progress: 0 },
      { date: '2024-02-26', courses: 0, hours: 0, progress: 0 }
    ],

    studyTime: [
      { day: 'Mon', morning: 0, afternoon: 0, evening: 0 },
      { day: 'Tue', morning: 0, afternoon: 0, evening: 0 },
      { day: 'Wed', morning: 0, afternoon: 0, evening: 0 },
      { day: 'Thu', morning: 0, afternoon: 0, evening: 0 },
      { day: 'Fri', morning: 0, afternoon: 0, evening: 0 },
      { day: 'Sat', morning: 0, afternoon: 0, evening: 0 },
      { day: 'Sun', morning: 0, afternoon: 0, evening: 0 }
    ],

    skillsProgress: [
      { skill: 'React', beginner: 0, intermediate: 0, advanced: 0 },
      { skill: 'JavaScript', beginner: 0, intermediate: 0, advanced: 0 },
      { skill: 'Node.js', beginner: 0, intermediate: 0, advanced: 0 },
      { skill: 'CSS', beginner: 0, intermediate: 0, advanced: 0 },
      { skill: 'Database', beginner: 0, intermediate: 0, advanced: 0 },
      { skill: 'Git', beginner: 0, intermediate: 0, advanced: 0 }
    ],

    learningPattern: [
      { name: 'Video Lessons', value: 0, color: '#3B82F6' },
      { name: 'Hands-on Practice', value: 0, color: '#10B981' },
      { name: 'Reading', value: 0, color: '#F59E0B' },
      { name: 'Quizzes', value: 0, color: '#8B5CF6' }
    ],

    weeklyGoals: {
      coursesTarget: 1,
      coursesCompleted: 0, // Reset to 0 for new students
      hoursTarget: 15,
      hoursCompleted: 0, // Reset to 0 for new students
      projectsTarget: 1,
      projectsCompleted: 0 // Reset to 0 for new students
    },

    achievements: [
      {
        id: '1',
        title: 'Fast Learner',
        description: 'Complete a course in record time',
        icon: Zap,
        color: 'text-yellow-500',
        earned: false, // Reset to not earned for new students
        progress: 0 // Reset progress to 0
      },
      {
        id: '2',
        title: 'Perfect Week',
        description: 'Meet all learning goals for a week',
        icon: Trophy,
        color: 'text-orange-500',
        earned: false, // Reset to not earned for new students
        progress: 0 // Reset progress to 0
      },
      {
        id: '3',
        title: 'Streak Master',
        description: 'Maintain 7-day learning streak',
        icon: Target,
        color: 'text-green-500',
        earned: false, // Reset to not earned for new students
        progress: 0 // Reset progress to 0
      },
      {
        id: '4',
        title: 'Course Champion',
        description: 'Complete 5 courses',
        icon: Award,
        color: 'text-purple-500',
        earned: false,
        progress: 0 // Reset progress to 0
      }
    ],

    recentActivity: [] // Empty activity for new students
  };

  const getTimeFrameData = () => {
    switch (timeFrame) {
      case 'week':
        return analyticsData.progressTrend.slice(-7);
      case 'month':
        return analyticsData.progressTrend.slice(-30);
      case 'year':
        return analyticsData.progressTrend;
      default:
        return analyticsData.progressTrend;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Analytics</h2>
          <p className="text-muted-foreground">
            Track your progress and optimize your learning journey
          </p>
        </div>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={timeFrame === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFrame(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Book className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{analyticsData.overview.completedCourses}</div>
            <div className="text-sm text-muted-foreground">Completed Courses</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{analyticsData.overview.totalHours}h</div>
            <div className="text-sm text-muted-foreground">Study Time</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{analyticsData.overview.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{analyticsData.overview.averageRating}</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={getTimeFrameData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'progress' ? 'Progress %' : name]}
                />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Study Time Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Study Time Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.studyTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="morning" stackId="a" fill="#3B82F6" name="Morning" />
                <Bar dataKey="afternoon" stackId="a" fill="#10B981" name="Afternoon" />
                <Bar dataKey="evening" stackId="a" fill="#F59E0B" name="Evening" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Skills Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={analyticsData.skillsProgress}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} tickCount={5} />
                <Radar
                  name="Beginner"
                  dataKey="beginner"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Intermediate"
                  dataKey="intermediate"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Advanced"
                  dataKey="advanced"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.1}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Pattern */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Learning Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.learningPattern}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {analyticsData.learningPattern.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Weekly Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Courses</span>
                <span>{analyticsData.weeklyGoals.coursesCompleted}/{analyticsData.weeklyGoals.coursesTarget}</span>
              </div>
              <Progress 
                value={(analyticsData.weeklyGoals.coursesCompleted / analyticsData.weeklyGoals.coursesTarget) * 100} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Study Hours</span>
                <span>{analyticsData.weeklyGoals.hoursCompleted}h/{analyticsData.weeklyGoals.hoursTarget}h</span>
              </div>
              <Progress 
                value={(analyticsData.weeklyGoals.hoursCompleted / analyticsData.weeklyGoals.hoursTarget) * 100} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Projects</span>
                <span>{analyticsData.weeklyGoals.projectsCompleted}/{analyticsData.weeklyGoals.projectsTarget}</span>
              </div>
              <Progress 
                value={(analyticsData.weeklyGoals.projectsCompleted / analyticsData.weeklyGoals.projectsTarget) * 100} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-muted/20'
                  }`}
                >
                  <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    {achievement.earned ? (
                      <div className="text-xs text-green-600">
                        Earned on {new Date(achievement.earnedDate!).toLocaleDateString()}
                      </div>
                    ) : achievement.progress && (
                      <div className="mt-1">
                        <Progress value={achievement.progress} className="h-1" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}% complete
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.earned && (
                    <Badge variant="default" className="bg-green-500">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseAnalytics;
