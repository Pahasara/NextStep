import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import apiService from "@/lib/api";
import { calculateLevel, getLevelName, getBadgeName, getRarityColor } from "@/lib/levelSystem";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Users,
  Flame
} from "lucide-react";

interface TopStudent {
  rank: number;
  name: string;
  points: number;
  level: string;
  badge: string;
  streak: number;
  avatar?: string;
}

const GamificationSection = () => {
  const [selectedTab, setSelectedTab] = useState("leaderboard");
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTopStudents();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await apiService.getMyProfile();
      if (profileResponse.success) {
        setUserProfile(profileResponse.data);
      }

      // Fetch user achievements
      const achievementsResponse = await apiService.getMyAchievements();
      if (achievementsResponse.success) {
        setUserAchievements(achievementsResponse.data.earnedAchievements || []);
        setAvailableAchievements(achievementsResponse.data.availableAchievements || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchTopStudents();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Calculate real user stats
  const userStats = userProfile ? (() => {
    const levelInfo = calculateLevel(userProfile.points || 0);
    return {
      level: levelInfo.level,
      points: userProfile.points || 0,
      nextLevelPoints: levelInfo.xpForNextLevel,
      progressToNextLevel: levelInfo.progressToNextLevel,
      streak: userProfile.streak || 0,
      completedCourses: userProfile.coursesCompleted || 0,
      projectsSubmitted: userProfile.projectsSubmitted || 0,
      rank: userProfile.rank || 0,
      levelName: levelInfo.levelName,
      badgeName: levelInfo.badgeName
    };
  })() : {
    level: 1,
    points: 0,
    nextLevelPoints: 100,
    progressToNextLevel: 0,
    streak: 0,
    completedCourses: 0,
    projectsSubmitted: 0,
    rank: 0,
    levelName: "Newcomer",
    badgeName: "New Student"
  };

  const fetchTopStudents = async () => {
    try {
      setLoading(true);
      
      // Try to get real data first (even without authentication for public endpoint)
      try {
        // First try the leaderboard endpoint
        const response = await apiService.getLeaderboard(1, 5);
        if (response.success && response.data && response.data.length > 0) {
          const students = response.data.map((student: any, index: number) => ({
            rank: index + 1,
            name: student.fullName,
            points: student.points || 0,
            level: getLevelName(student.level || 1),
            badge: getBadgeName(student.level || 1),
            streak: student.streak || 0,
            avatar: student.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
          }));
          setTopStudents(students);
          return;
        }
      } catch (leaderboardError) {
        console.log('Leaderboard API failed, trying student profiles...');
      }

      // If user is authenticated, try student profiles endpoint
      if (user) {
        try {
          const studentsResponse = await apiService.getStudentProfiles(1, 5);
          if (studentsResponse.success && studentsResponse.data && studentsResponse.data.length > 0) {
            // Sort by points descending to get top performers
            const sortedStudents = studentsResponse.data.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));
            const students = sortedStudents.slice(0, 5).map((student: any, index: number) => ({
              rank: index + 1,
              name: student.fullName,
              points: student.points || 0,
              level: getLevelName(student.level || 1),
              badge: getBadgeName(student.level || 1),
              streak: student.streak || 0,
              avatar: student.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
            }));
            setTopStudents(students);
            
            if (students.length > 0) {
              toast({
                title: "Real Data Loaded",
                description: `Showing ${students.length} top students from database`,
                variant: "default"
              });
            }
            return;
          }
        } catch (profilesError) {
          console.log('Student profiles API failed:', profilesError);
        }
      }
      
      // If no real data found, show empty state instead of demo data
      setTopStudents([]);
      
    } catch (error) {
      console.error('Error in fetchTopStudents:', error);
      setTopStudents([]); // Show empty state on error
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (level: number): string => {
    if (level >= 20) return "Expert";
    if (level >= 15) return "Advanced";
    if (level >= 10) return "Intermediate";
    if (level >= 5) return "Beginner";
    return "Newcomer";
  };

  const getBadgeName = (level: number): string => {
    if (level >= 20) return "Master Graduate";
    if (level >= 15) return "Advanced Learner";
    if (level >= 10) return "Skilled Developer";
    if (level >= 5) return "Rising Star";
    return "New Student";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold">#{rank}</span>;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-700";
      case "Uncommon": return "bg-green-100 text-green-700";
      case "Rare": return "bg-blue-100 text-blue-700";
      case "Epic": return "bg-purple-100 text-purple-700";
      case "Legendary": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section id="leaderboard" className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-accent animate-glow" />
            <span className="text-sm font-medium">Gamification & Rewards</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Level Up Your <span className="gradient-text">Learning Journey</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Earn points, unlock achievements, and compete with fellow students. 
            Make learning engaging and track your progress in real-time.
          </p>
        </div>

        {/* User Stats Overview */}
        <Card className="glass-card p-6 md:p-8 mb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
                  <span className="text-white font-bold text-lg">{userStats.level}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Level {userStats.level}</h3>
                  <p className="text-muted-foreground">{userStats.levelName}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Progress to Level {userStats.level + 1}</span>
                  <span className="text-sm text-muted-foreground">
                    {userStats.points}/{userStats.nextLevelPoints} XP
                  </span>
                </div>
                <Progress 
                  value={userStats.progressToNextLevel} 
                  className="h-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Points", value: userStats.points.toLocaleString(), icon: Star },
                { label: "Learning Streak", value: `${userStats.streak} days`, icon: Flame },
                { label: "Courses Done", value: userStats.completedCourses, icon: Trophy },
                { label: "Global Rank", value: userStats.rank > 0 ? `#${userStats.rank}` : "Unranked", icon: TrendingUp }
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-2 rounded-lg">
            <div className="flex space-x-2">
              {[
                { id: "leaderboard", label: "Leaderboard", icon: Trophy },
                { id: "achievements", label: "Achievements", icon: Award }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={selectedTab === tab.id ? "hero" : "ghost"}
                  onClick={() => setSelectedTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === "leaderboard" ? (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">🏆 Top Performers This Month</h3>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading top performers...</p>
              </div>
            ) : topStudents.length > 0 ? (
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <Card 
                    key={student.name}
                    className={`glass-card p-6 transition-all duration-300 hover:scale-105 ${
                      student.rank <= 3 ? 'ring-2 ring-primary/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-6">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankIcon(student.rank)}
                      </div>

                      {/* Avatar */}
                      <div 
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0"
                        style={{
                          backgroundImage: `url(${student.avatar})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />

                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold">{student.name}</h4>
                          <div className="text-2xl font-bold text-primary">
                            {student.points.toLocaleString()} XP
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">{student.level}</Badge>
                          <Badge className={getRarityColor("Epic")}>{student.badge}</Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span>{student.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No top performers yet</h3>
                <p className="text-muted-foreground">
                  Be the first to appear on the leaderboard by completing courses and earning points!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-center mb-8">🏅 Your Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Show earned achievements first */}
              {userAchievements.map((achievement, index) => (
                <Card 
                  key={`earned-${achievement.id || index}`}
                  className="glass-card p-6 text-center transition-all duration-300 hover:scale-105 ring-2 ring-green-400/50"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r from-primary to-secondary animate-glow">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <div className="text-sm font-medium text-primary">
                      +{achievement.xpEarned || achievement.xpReward} XP
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      ✓ Unlocked
                    </Badge>
                  </div>
                  
                  {achievement.earnedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))}
              
              {/* Show available achievements */}
              {availableAchievements.map((achievement, index) => (
                <Card 
                  key={`available-${achievement.id || index}`}
                  className="glass-card p-6 text-center transition-all duration-300 hover:scale-105 opacity-75"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted">
                    <Award className="w-8 h-8 text-muted-foreground" />
                  </div>
                  
                  <h4 className="text-lg font-bold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <div className="text-sm font-medium text-primary">
                      +{achievement.xpReward} XP
                    </div>
                  </div>
                  
                  {achievement.progress !== undefined && achievement.progress > 0 && (
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">
                        Progress: {achievement.progress}%
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                </Card>
              ))}
              
              {/* Show message if no achievements */}
              {userAchievements.length === 0 && availableAchievements.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                  <p className="text-muted-foreground">
                    Start completing courses and projects to unlock achievements!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="glass-card p-8 md:p-12 text-center mt-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-glow">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold">Join the Competition!</h3>
            
            <p className="text-muted-foreground text-lg">
              Start earning points today and climb the leaderboard. Complete quizzes, 
              submit projects, and help others to unlock amazing achievements.
            </p>
            
            <Button variant="hero" size="lg">
              Start Earning Points
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default GamificationSection;