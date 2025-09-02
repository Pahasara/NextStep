import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Award, 
  Target, 
  Clock, 
  BookOpen,
  Code,
  Zap,
  Flame,
  Activity,
  Calendar,
  CheckCircle,
  Users
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiService from "@/lib/api";
import RealTimeLeaderboard from "@/components/RealTimeLeaderboard";
import ProjectManager from "@/components/ProjectManager";
import AchievementCenter from "@/components/AchievementCenter";

interface ActivityLog {
  id: number;
  activityType: string;
  activityDescription?: string;
  pointsEarned: number;
  createdAt: string;
}

interface StudentStats {
  totalPoints: number;
  level: number;
  rank: number;
  coursesCompleted: number;
  projectsSubmitted: number;
  achievementsEarned: number;
  learningHours: number;
  streak: number;
  percentile: number;
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role === 'student') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user rank and stats
      const rankResponse = await apiService.getMyRank();
      if (rankResponse.success) {
        setStats(rankResponse.data);
      }

      // Fetch recent activities
      const activitiesResponse = await apiService.getMyActivities(1, 10);
      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'course_completed':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'project_submitted':
        return <Code className="w-4 h-4 text-green-500" />;
      case 'achievement_earned':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'skill_acquired':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'quiz_completed':
        return <CheckCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatActivityType = (activityType: string) => {
    return activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const simulateActivity = async (type: string, description: string, points: number) => {
    try {
      await apiService.logActivity({
        activityType: type,
        description,
        points
      });
      
      toast({
        title: "Activity Logged!",
        description: `You earned ${points} points for ${description.toLowerCase()}`,
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const simulateActivityWithAchievements = async (type: string, description: string, points: number) => {
    try {
      // Log the activity first
      await apiService.logActivity({
        activityType: type,
        description,
        points
      });
      
      // Check for new achievements
      const achievementResponse = await apiService.checkAndAwardAchievements();
      if (achievementResponse.success && achievementResponse.data) {
        const newAchievements = achievementResponse.data;
        
        // Show activity success message
        toast({
          title: "🎉 Activity Completed!",
          description: `You earned ${points} XP for ${description.toLowerCase()}`,
        });

        // Show achievement notifications if any
        if (newAchievements.length > 0) {
          setTimeout(() => {
            newAchievements.forEach((achievement: any, index: number) => {
              setTimeout(() => {
                toast({
                  title: `🏆 Achievement Unlocked!`,
                  description: `${achievement.title} - +${achievement.xpEarned} XP`,
                });
              }, index * 1000); // Stagger notifications
            });
          }, 500);
        }
      }
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error logging activity with achievements:', error);
      toast({
        title: "Error",
        description: "Failed to log activity",
        variant: "destructive"
      });
    }
  };

  if (user?.role !== 'student') {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
        <p className="text-muted-foreground">This dashboard is only available for students.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress, see your ranking, and compete with fellow students
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.rank}</div>
              <p className="text-xs text-muted-foreground">
                Top {stats.percentile}% of students
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Level {stats.level}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak}</div>
              <p className="text-xs text-muted-foreground">
                Days in a row
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.achievementsEarned}</div>
              <p className="text-xs text-muted-foreground">
                Awards earned
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Activities</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{stats?.coursesCompleted || 0}</div>
                    <div className="text-sm text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{stats?.projectsSubmitted || 0}</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Learning Hours</span>
                    <span>{stats?.learningHours || 0}h</span>
                  </div>
                  <Progress value={Math.min((stats?.learningHours || 0) / 100 * 100, 100)} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      {getActivityIcon(activity.activityType)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.activityDescription || formatActivityType(activity.activityType)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{activity.pointsEarned}
                      </Badge>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activities. Start learning to see your progress here!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Demo Actions with Achievement Integration */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Learning Activities</CardTitle>
              <CardDescription>
                Complete these actions to earn XP and unlock achievements!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => simulateActivityWithAchievements('course_completed', 'Completed JavaScript Fundamentals', 100)}
                >
                  Complete Course (+100 XP)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => simulateActivityWithAchievements('project_submitted', 'Submitted Portfolio Website', 50)}
                >
                  Submit Project (+50 XP)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => simulateActivityWithAchievements('skill_acquired', 'Learned React Hooks', 30)}
                >
                  Learn Skill (+30 XP)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => simulateActivityWithAchievements('quiz_completed', 'Passed Advanced CSS Quiz', 25)}
                >
                  Pass Quiz (+25 XP)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementCenter />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectManager showOnlyOwn={true} allowEdit={true} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <RealTimeLeaderboard showMyRank={true} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Activity History</span>
              </CardTitle>
              <CardDescription>
                Your complete learning activity timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {activity.activityDescription || formatActivityType(activity.activityType)}
                        </h4>
                        <Badge variant="secondary">+{activity.pointsEarned} points</Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {formatActivityType(activity.activityType)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
                    <p className="text-muted-foreground">
                      Start completing courses and projects to build your activity history!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
