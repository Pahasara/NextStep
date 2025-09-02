import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Award, Target, Activity } from "lucide-react";

interface UserAnalyticsProps {
  userId: string;
  skills?: string[];
  careerInterests?: string[];
  points?: number;
  level?: number;
}

const UserAnalytics = ({ userId, skills = [], careerInterests = [], points = 0, level = 1 }: UserAnalyticsProps) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserActivities();
  }, [userId]);

  const fetchUserActivities = async () => {
    try {
      // TODO: Implement API call to fetch user activities from backend
      // For now, using empty array
      setActivities([]);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts - safely handle null/undefined values with more realistic data
  const skillsData = (skills || []).map((skill, index) => {
    // Generate more realistic proficiency based on skill popularity and user level
    const baseScore = 40 + (level || 1) * 8;
    const variation = Math.floor(Math.random() * 30) - 15;
    const proficiency = Math.min(100, Math.max(20, baseScore + variation));
    
    return {
      name: skill,
      proficiency,
      projects: Math.floor(Math.random() * 8) + 2,
      experience: Math.floor(proficiency / 20) + 1 // 1-5 years based on proficiency
    };
  });

  // Enhanced activity timeline with better date grouping
  const activityData = activities.reduce((acc: any[], activity) => {
    const date = new Date(activity.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const existingDay = acc.find(item => item.date === date);
    
    if (existingDay) {
      existingDay.points += activity.points_earned || 0;
      existingDay.activities += 1;
    } else {
      acc.push({
        date,
        points: activity.points_earned || 0,
        activities: 1,
        day: new Date(activity.created_at).getDate()
      });
    }
    return acc;
  }, []).sort((a, b) => a.day - b.day);

  // Enhanced activity type distribution
  const activityTypeData = activities.reduce((acc: any[], activity) => {
    const typeNames: Record<string, string> = {
      'profile_setup': 'Profile Setup',
      'quiz_completed': 'Quiz Completed',
      'skill_added': 'Skill Added',
      'profile_updated': 'Profile Updated',
      'course_completed': 'Course Completed',
      'project_submitted': 'Project Submitted'
    };
    
    const displayName = typeNames[activity.activity_type] || 
                       activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const existingType = acc.find(item => item.name === displayName);
    if (existingType) {
      existingType.value += 1;
      existingType.points += activity.points_earned || 0;
    } else {
      acc.push({
        name: displayName,
        value: 1,
        points: activity.points_earned || 0
      });
    }
    return acc;
  }, []);

  // Enhanced career interest radar with realistic scores
  const careerInterestData = (careerInterests || []).map((interest, index) => {
    // Generate scores based on user activity and skills
    const relatedSkills = (skills || []).filter(skill => 
      skill.toLowerCase().includes(interest.toLowerCase().split(' ')[0]) ||
      interest.toLowerCase().includes(skill.toLowerCase())
    ).length;
    
    const baseScore = 60 + relatedSkills * 10;
    const userBonus = (points || 0) / 20;
    const randomVariation = Math.floor(Math.random() * 20) - 10;
    
    return {
      subject: interest,
      value: Math.min(100, Math.max(30, baseScore + userBonus + randomVariation)),
      fullMark: 100
    };
  });

  // Weekly progress data for enhanced timeline
  const weeklyProgressData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.created_at);
      return activityDate.toDateString() === date.toDateString();
    });
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      points: dayActivities.reduce((sum, activity) => sum + (activity.points_earned || 0), 0),
      activities: dayActivities.length,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Loading Analytics...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{points}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{level}</p>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{(skills || []).length}</p>
                <p className="text-sm text-muted-foreground">Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{activities.length}</p>
                <p className="text-sm text-muted-foreground">Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Activity Timeline */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your learning activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label, payload) => {
                  const item = weeklyProgressData.find(d => d.day === label);
                  return `${label} (${item?.date})`;
                }}
                formatter={(value, name) => [
                  value, 
                  name === 'points' ? 'Points Earned' : 'Activities Completed'
                ]}
              />
              <Bar dataKey="points" fill="hsl(var(--primary))" name="points" radius={[4, 4, 0, 0]} />
              <Bar dataKey="activities" fill="hsl(var(--secondary))" name="activities" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Activity Types Distribution */}
        {activityTypeData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Types of activities completed with points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, points }) => `${name}: ${value} (${points}pts)`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value} activities (${props.payload.points} points)`,
                    name
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserAnalytics;