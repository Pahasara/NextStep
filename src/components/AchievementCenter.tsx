import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Award, 
  Target, 
  Star, 
  Crown,
  Zap,
  BookOpen,
  Briefcase,
  Flame,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  CheckCircle,
  Plus,
  RefreshCw,
  Loader2
} from "lucide-react";
import apiService from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: string;
  rarity: string;
  xpReward?: number;
  xpEarned?: number;
  iconName?: string;
  badgeColor?: string;
  earnedAt?: string;
  notes?: string;
  progress?: number;
}

interface AchievementSummary {
  totalEarned: number;
  totalAvailable: number;
  totalXpEarned: number;
  earnedAchievements: Achievement[];
  availableAchievements: Achievement[];
}

const AchievementCenter = () => {
  const [achievements, setAchievements] = useState<AchievementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'earned' | 'available'>('available');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyAchievements();
      if (response.success) {
        setAchievements(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load achievements",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async () => {
    try {
      setChecking(true);
      const response = await apiService.checkAndAwardAchievements();
      if (response.success) {
        const newAchievements = response.data || [];
        if (newAchievements.length > 0) {
          toast({
            title: "🎉 New Achievements!",
            description: `You earned ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''}!`,
          });
          
          // Show individual achievement notifications
          newAchievements.forEach((achievement: Achievement) => {
            setTimeout(() => {
              toast({
                title: `🏆 ${achievement.title}`,
                description: `+${achievement.xpEarned} XP - ${achievement.description}`,
              });
            }, 500);
          });
          
          // Refresh achievements
          await fetchAchievements();
        } else {
          toast({
            title: "All Caught Up!",
            description: "No new achievements at this time. Keep learning!",
          });
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      toast({
        title: "Error",
        description: "Failed to check for new achievements",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'user-check': return <CheckCircle className="w-6 h-6" />;
      case 'book-open': return <BookOpen className="w-6 h-6" />;
      case 'folder-plus': return <Plus className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'graduation-cap': return <Award className="w-6 h-6" />;
      case 'briefcase': return <Briefcase className="w-6 h-6" />;
      case 'flame': return <Flame className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'award': return <Award className="w-6 h-6" />;
      case 'folder': return <Briefcase className="w-6 h-6" />;
      case 'calendar': return <Calendar className="w-6 h-6" />;
      case 'clock': return <Clock className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'eye': return <Eye className="w-6 h-6" />;
      case 'trending-up': return <TrendingUp className="w-6 h-6" />;
      case 'crown': return <Crown className="w-6 h-6" />;
      case 'trophy': return <Trophy className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'epic': return 'shadow-lg shadow-purple-200';
      case 'legendary': return 'shadow-lg shadow-yellow-200 animate-pulse';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (!achievements) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
        <p className="text-muted-foreground">Start learning to unlock your first achievements!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{achievements.totalEarned}</div>
            <div className="text-sm text-muted-foreground">Achievements Earned</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{achievements.totalXpEarned}</div>
            <div className="text-sm text-muted-foreground">XP from Achievements</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round((achievements.totalEarned / achievements.totalAvailable) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Check for New Achievements Button */}
      <div className="text-center">
        <Button 
          onClick={checkForNewAchievements} 
          disabled={checking}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for New Achievements
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="glass-card p-2 rounded-lg">
          <div className="flex space-x-2">
            <Button
              variant={selectedTab === 'available' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('available')}
              className="flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Available ({achievements.availableAchievements.length})</span>
            </Button>
            <Button
              variant={selectedTab === 'earned' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('earned')}
              className="flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Earned ({achievements.earnedAchievements.length})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTab === 'available' ? (
          achievements.availableAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`glass-card transition-all duration-300 hover:scale-105 border-2 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: achievement.badgeColor || '#3B82F6' }}
                  >
                    <div className="text-white">
                      {getIcon(achievement.iconName)}
                    </div>
                  </div>
                  <Badge className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Reward:</span>
                  <Badge variant="secondary">+{achievement.xpReward} XP</Badge>
                </div>
                
                {achievement.progress !== undefined && achievement.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                )}
                
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {achievement.type} achievement
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          achievements.earnedAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`glass-card border-2 bg-gradient-to-br from-green-50 to-emerald-50 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center animate-glow"
                    style={{ backgroundColor: achievement.badgeColor || '#3B82F6' }}
                  >
                    <div className="text-white">
                      {getIcon(achievement.iconName)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <Badge variant="default" className="bg-green-500 text-white ml-2">
                      ✓ Earned
                    </Badge>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">XP Earned:</span>
                  <Badge variant="secondary">+{achievement.xpEarned} XP</Badge>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Earned on {new Date(achievement.earnedAt!).toLocaleDateString()}
                </div>
                
                {achievement.notes && (
                  <div className="text-xs text-muted-foreground italic">
                    "{achievement.notes}"
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {selectedTab === 'available' && achievements.availableAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Achievements Unlocked!</h3>
          <p className="text-muted-foreground">
            Congratulations! You've earned every achievement available.
          </p>
        </div>
      )}

      {selectedTab === 'earned' && achievements.earnedAchievements.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-muted-foreground">
            Complete courses, submit projects, and participate in the community to earn achievements!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementCenter;
