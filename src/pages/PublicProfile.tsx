import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, School, Github, Linkedin, Trophy, Mail, ArrowLeft, ExternalLink, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import UserAnalytics from "@/components/UserAnalytics";

interface PublicProfile {
  id: string;
  user_id: string;
  full_name?: string;
  university?: string;
  year_of_study?: number;
  major?: string;
  skills?: string[];
  career_interests?: string[];
  github_username?: string;
  linkedin_url?: string;
  avatar_url?: string;
  points?: number;
  level?: number;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

    const fetchPublicProfile = async () => {
    if (!userId) return;
    
    try {
      // TODO: Implement API call to fetch user profile from backend
      // For now, setting profile to null to show "not found" message
      setProfile(null);
    } catch (error: any) {
      toast.error("Error loading profile: " + error.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>The requested profile could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="hero">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold gradient-text">Public Profile</h1>
          </div>

          {/* Profile Header */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <CardTitle className="text-3xl">{profile.full_name || 'Anonymous User'}</CardTitle>
                    <CardDescription className="text-lg">
                      {profile.major && profile.university ? 
                        `${profile.major} at ${profile.university}` : 
                        'ICT Student'
                      }
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profile.year_of_study && (
                      <div className="flex items-center space-x-1">
                        <School className="w-4 h-4" />
                        <span>Year {profile.year_of_study}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{profile.points || 0} points</span>
                      </div>
                      <Badge variant="secondary">Level {profile.level || 1}</Badge>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-2 pt-2">
                    {profile.github_username && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    
                    {profile.linkedin_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Skills and Interests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Skills */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>
                  Areas of technical expertise and proficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills listed yet</p>
                )}
              </CardContent>
            </Card>

            {/* Career Interests */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Career Interests</CardTitle>
                <CardDescription>
                  Professional fields and specializations of interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.career_interests && profile.career_interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.career_interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No career interests listed yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Analytics Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Performance Analytics</h2>
              <p className="text-muted-foreground">
                Comprehensive analysis of skills, activities, and learning progress
              </p>
            </div>
            
            <UserAnalytics 
              userId={profile.user_id}
              skills={profile.skills}
              careerInterests={profile.career_interests}
              points={profile.points}
              level={profile.level}
            />
          </div>

          {/* Assessment Note for Experts */}
          <Card className="glass-card border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-600">
                <Mail className="w-5 h-5" />
                <span>For Industry Experts</span>
              </CardTitle>
              <CardDescription>
                This profile provides a comprehensive view of the candidate's technical skills, 
                learning progress, project completions, and career interests. The analytics above 
                show real-time data on their engagement and proficiency levels across different domains.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;