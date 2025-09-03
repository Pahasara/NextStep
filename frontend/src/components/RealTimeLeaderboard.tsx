import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users, 
  BookOpen,
  Code,
  Zap,
  Medal,
  Crown,
  Flame,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiService from "@/lib/api";

interface LeaderboardStudent {
  userId: number;
  rank: number;
  fullName: string;
  avatarUrl?: string;
  university?: string;
  major?: string;
  careerPath?: string;
  points: number;
  level: number;
  streak: number;
  coursesCompleted: number;
  projectsSubmitted: number;
  achievementsEarned: number;
  learningHours: number;
  monthlyGrowthPercentage: number;
  competitionWins: number;
  mentorshipRating: number;
  profileViews: number;
  skillsAcquired: number;
  lastActivityDate?: string;
}

interface StudentRankData {
  rank: number;
  points: number;
  level: number;
  totalStudents: number;
  percentile: number;
}

interface RealTimeLeaderboardProps {
  onStudentSelect?: (studentId: number) => void;
  showMyRank?: boolean;
}

const RealTimeLeaderboard = ({ onStudentSelect, showMyRank = true }: RealTimeLeaderboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState("overall");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardStudent[]>([]);
  const [myRank, setMyRank] = useState<StudentRankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
    if (showMyRank && user?.role === 'student') {
      fetchMyRank();
    }
  }, [showMyRank, user]);

  const fetchLeaderboard = async () => {
    try {
      setRefreshing(true);
      
      // First try to get leaderboard data
      const response = await apiService.getLeaderboard(1, 50);
      if (response.success && response.data && response.data.length > 0) {
        setLeaderboardData(response.data);
      } else {
        // Fallback: Get student profiles and convert to leaderboard format
        console.log('Leaderboard API returned no data, falling back to student profiles...');
        const studentsResponse = await apiService.getStudentProfiles(1, 50);
        
        if (studentsResponse.success && studentsResponse.data && studentsResponse.data.length > 0) {
          const convertedStudents: LeaderboardStudent[] = studentsResponse.data.map((student: any, index: number) => ({
            userId: student.id,
            rank: index + 1,
            fullName: student.fullName,
            avatarUrl: student.avatarUrl,
            university: student.university,
            major: student.major,
            careerPath: student.major, // Use major as careerPath fallback
            points: student.points || 0,
            level: student.level || 1,
            streak: student.streak || 0,
            coursesCompleted: student.coursesCompleted || 0,
            projectsSubmitted: student.projectsSubmitted || 0,
            achievementsEarned: student.achievementsEarned || 0,
            learningHours: student.learningHours || 0,
            monthlyGrowthPercentage: student.monthlyGrowthPercentage || 0,
            competitionWins: student.competitionWins || 0,
            mentorshipRating: student.mentorshipRating || 0,
            profileViews: student.profileViews || 0,
            skillsAcquired: student.skillsAcquired || 0,
            lastActivityDate: student.lastActivityDate
          }));
          
          // Sort by points descending
          convertedStudents.sort((a, b) => b.points - a.points);
          
          setLeaderboardData(convertedStudents);
          
          toast({
            title: "Leaderboard Loaded",
            description: `Showing ${convertedStudents.length} students from database`,
            variant: "default"
          });
        } else {
          // No data available
          setLeaderboardData([]);
          toast({
            title: "No Students Found",
            description: "No students found in the database",
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardData([]); // Show empty state instead of mock data
      toast({
        title: "Error", 
        description: "Failed to load leaderboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMyRank = async () => {
    try {
      const response = await apiService.getMyRank();
      if (response.success && response.data) {
        setMyRank(response.data);
      }
    } catch (error) {
      console.error('Error fetching rank:', error);
    }
  };

  const handleStudentClick = async (student: LeaderboardStudent) => {
    try {
      await apiService.incrementProfileView(student.userId);
      onStudentSelect?.(student.userId);
    } catch (error) {
      console.error('Error incrementing profile view:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="font-bold text-sm">{rank}</span>
          </div>
        );
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return "text-purple-500";
    if (level >= 15) return "text-blue-500";
    if (level >= 10) return "text-green-500";
    if (level >= 5) return "text-yellow-500";
    return "text-gray-500";
  };

  const sortedByCategory = (category: string) => {
    const data = [...leaderboardData];
    switch (category) {
      case "projects":
        return data.sort((a, b) => b.projectsSubmitted - a.projectsSubmitted);
      case "learning":
        return data.sort((a, b) => b.learningHours - a.learningHours);
      case "achievements":
        return data.sort((a, b) => b.achievementsEarned - a.achievementsEarned);
      case "growth":
        return data.sort((a, b) => b.monthlyGrowthPercentage - a.monthlyGrowthPercentage);
      case "streak":
        return data.sort((a, b) => b.streak - a.streak);
      default:
        return data.sort((a, b) => b.points - a.points);
    }
  };

  const categoryLeaderboard = sortedByCategory(selectedCategory);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold gradient-text flex items-center justify-center space-x-2">
            <Trophy className="w-8 h-8" />
            <span>Live Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">
            Real-time rankings updated as students progress
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLeaderboard}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* My Rank Card - Only for students */}
      {showMyRank && myRank && user?.role === 'student' && (
        <Card className="glass-card bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Your Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">#{myRank.rank}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{myRank.points.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">L{myRank.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{myRank.percentile}%</div>
                <div className="text-sm text-muted-foreground">Percentile</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{myRank.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="overall" className="text-xs md:text-sm">
            <Trophy className="w-4 h-4 mr-1" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs md:text-sm">
            <Code className="w-4 h-4 mr-1" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="learning" className="text-xs md:text-sm">
            <BookOpen className="w-4 h-4 mr-1" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs md:text-sm">
            <Award className="w-4 h-4 mr-1" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="growth" className="text-xs md:text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            Growth
          </TabsTrigger>
          <TabsTrigger value="streak" className="text-xs md:text-sm">
            <Flame className="w-4 h-4 mr-1" />
            Streak
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Top 3 Podium */}
          {categoryLeaderboard.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categoryLeaderboard.slice(0, 3).map((student, index) => (
                <Card 
                  key={student.userId} 
                  className={`glass-card relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    index === 0 ? 'border-yellow-500/50 shadow-yellow-500/20 md:order-2' :
                    index === 1 ? 'border-gray-400/50 shadow-gray-400/20 md:order-1' :
                    'border-amber-600/50 shadow-amber-600/20 md:order-3'
                  }`}
                  onClick={() => handleStudentClick(student)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}></div>
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(student.rank)}
                    </div>
                    <Avatar className={`w-16 h-16 mx-auto mb-2 ${
                      index === 0 ? 'ring-4 ring-yellow-500/30' : ''
                    }`}>
                      <AvatarImage src={student.avatarUrl} alt={student.fullName} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                        {student.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{student.fullName}</CardTitle>
                    <CardDescription>{student.university}</CardDescription>
                    {student.careerPath && (
                      <Badge variant="outline" className="text-xs">
                        {student.careerPath}
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedCategory === 'overall' && `${student.points.toLocaleString()} pts`}
                        {selectedCategory === 'projects' && `${student.projectsSubmitted} projects`}
                        {selectedCategory === 'learning' && `${student.learningHours}h`}
                        {selectedCategory === 'achievements' && `${student.achievementsEarned} awards`}
                        {selectedCategory === 'growth' && `+${student.monthlyGrowthPercentage}%`}
                        {selectedCategory === 'streak' && `${student.streak} days`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCategory === 'overall' && 'Total Points'}
                        {selectedCategory === 'projects' && 'Projects Completed'}
                        {selectedCategory === 'learning' && 'Learning Hours'}
                        {selectedCategory === 'achievements' && 'Achievements'}
                        {selectedCategory === 'growth' && 'Monthly Growth'}
                        {selectedCategory === 'streak' && 'Learning Streak'}
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center space-x-1">
                      <Zap className={`w-4 h-4 ${getLevelColor(student.level)}`} />
                      <span className={`font-bold ${getLevelColor(student.level)}`}>
                        Level {student.level}
                      </span>
                    </div>

                    {selectedCategory === "overall" && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="font-semibold text-sm">{student.achievementsEarned}</div>
                          <div className="text-muted-foreground">Awards</div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{student.projectsSubmitted}</div>
                          <div className="text-muted-foreground">Projects</div>
                        </div>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentClick(student);
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Full Rankings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">All Rankings</h3>
            {categoryLeaderboard.map((student, index) => (
              <Card 
                key={student.userId} 
                className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleStudentClick(student)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(student.rank)}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatarUrl} alt={student.fullName} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                          {student.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold truncate">{student.fullName}</h4>
                          <div className="flex items-center space-x-1">
                            <Zap className={`w-3 h-3 ${getLevelColor(student.level)}`} />
                            <span className={`text-xs font-medium ${getLevelColor(student.level)}`}>
                              L{student.level}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {student.university} • {student.careerPath || student.major}
                        </div>
                      </div>
                    </div>

                    {/* Category-specific Metrics */}
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                      {selectedCategory === "overall" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-primary">{student.points.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Points</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.achievementsEarned}</div>
                            <div className="text-xs text-muted-foreground">Awards</div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "projects" && (
                        <div className="text-center">
                          <div className="font-bold text-primary">{student.projectsSubmitted}</div>
                          <div className="text-xs text-muted-foreground">Projects</div>
                        </div>
                      )}

                      {selectedCategory === "learning" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-primary">{student.learningHours}h</div>
                            <div className="text-xs text-muted-foreground">Hours</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.streak}</div>
                            <div className="text-xs text-muted-foreground">Streak</div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "achievements" && (
                        <div className="text-center">
                          <div className="font-bold text-primary">{student.achievementsEarned}</div>
                          <div className="text-xs text-muted-foreground">Awards</div>
                        </div>
                      )}

                      {selectedCategory === "growth" && (
                        <div className="text-center">
                          <div className="font-bold text-green-500">+{student.monthlyGrowthPercentage}%</div>
                          <div className="text-xs text-muted-foreground">Growth</div>
                        </div>
                      )}

                      {selectedCategory === "streak" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-orange-500">{student.streak}</div>
                            <div className="text-xs text-muted-foreground">Days</div>
                          </div>
                          <div className="text-center">
                            <Flame className="w-4 h-4 text-orange-500 mx-auto" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentClick(student);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {categoryLeaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rankings available</h3>
              <p className="text-muted-foreground">
                Be the first to appear on the leaderboard by completing courses and projects!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeLeaderboard;
