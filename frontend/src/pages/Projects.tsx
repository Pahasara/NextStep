import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import ProjectManager from "@/components/ProjectManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, LogIn } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
        <Navigation title="My Projects" />
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">My Project Portfolio</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create, edit, and manage your personal project portfolio to showcase your skills
            </p>
          </div>

          {/* Content */}
          {user ? (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectManager 
                  userId={user?.id} 
                  showOnlyOwn={true} 
                  allowEdit={true} 
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="text-center p-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <LogIn className="w-12 h-12 text-primary" />
                  <h3 className="text-2xl font-semibold">Sign in to access your projects</h3>
                </div>
                <p className="text-muted-foreground mb-6 text-lg">
                  Join NextStep to create your own project portfolio and showcase your skills to industry experts
                </p>
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign Up / Login</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
