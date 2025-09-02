import { Button } from "@/components/ui/button";
import { Code, Book, Database, Users, Zap, Shield } from "lucide-react";
import Layout from "@/components/Layout";

const Documentation = () => {
  const sections = [
    {
      icon: Zap,
      title: "Quick Start Guide",
      description: "Get up and running with NextStep in minutes",
      items: [
        "Account Setup",
        "Profile Completion", 
        "First Career Quiz",
        "Dashboard Overview"
      ]
    },
    {
      icon: Users,
      title: "User Guide",
      description: "Complete guide for students and educators",
      items: [
        "Profile Management",
        "Career Discovery Process",
        "Learning Path Creation",
        "Progress Tracking",
        "Mentor Connections",
        "Project Submissions"
      ]
    },
    {
      icon: Code,
      title: "API Documentation", 
      description: "For developers integrating with NextStep",
      items: [
        "Authentication",
        "User Management API",
        "Career Data API",
        "Progress Tracking API",
        "Webhooks",
        "Rate Limiting"
      ]
    },
    {
      icon: Database,
      title: "Data & Analytics",
      description: "Understanding your data and analytics",
      items: [
        "Career Match Algorithms",
        "Progress Metrics",
        "Performance Analytics",
        "Data Export",
        "Privacy Controls"
      ]
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Security best practices and privacy policies",
      items: [
        "Data Protection",
        "Privacy Settings", 
        "Security Features",
        "GDPR Compliance",
        "Account Security"
      ]
    },
    {
      icon: Book,
      title: "Best Practices",
      description: "Tips and strategies for success",
      items: [
        "Profile Optimization",
        "Effective Quiz Taking",
        "Goal Setting",
        "Networking Strategies",
        "Career Planning"
      ]
    }
  ];

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/v1/user/profile",
      description: "Retrieve user profile information",
      auth: "Required"
    },
    {
      method: "POST", 
      endpoint: "/api/v1/career/quiz",
      description: "Submit career assessment quiz",
      auth: "Required"
    },
    {
      method: "GET",
      endpoint: "/api/v1/career/recommendations",
      description: "Get AI-powered career recommendations",
      auth: "Required"
    },
    {
      method: "PUT",
      endpoint: "/api/v1/user/goals",
      description: "Update learning goals and preferences",
      auth: "Required"
    },
    {
      method: "GET",
      endpoint: "/api/v1/progress/analytics",
      description: "Retrieve progress and analytics data",
      auth: "Required"
    }
  ];

  const codeExample = `// Initialize NextStep SDK
import { NextStepSDK } from '@nextstep/sdk';

const nextstep = new NextStepSDK({
  apiKey: 'your-api-key',
  baseURL: import.meta.env.VITE_BACKEND_URL // Uses environment variable
});

// Get user career recommendations
async function getCareerRecommendations(userId) {
  try {
    const recommendations = await nextstep.career.getRecommendations(userId);
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
}

// Submit quiz results
async function submitQuiz(quizData) {
  try {
    const result = await nextstep.quiz.submit(quizData);
    return result;
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
}`;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Comprehensive guides, API references, and technical documentation to help you 
              integrate and make the most of NextStep's platform.
            </p>
          </div>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sections.map((section, index) => (
              <div key={section.title} className="glass-card p-6 rounded-2xl group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href="#"
                      className="block text-sm text-primary hover:text-secondary transition-colors"
                    >
                      • {item}
                    </a>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-4 w-full">
                  View Documentation →
                </Button>
              </div>
            ))}
          </div>

          {/* API Reference */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 gradient-text">API Reference</h2>
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Common Endpoints</h3>
              <div className="space-y-4 mb-8">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                        endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono">{endpoint.endpoint}</code>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      <p className="text-xs text-accent">{endpoint.auth}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mb-4">SDK Example</h3>
              <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 gradient-text">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Create Your Account</h4>
                    <p className="text-sm text-muted-foreground">Sign up and complete your profile setup</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Take the Career Quiz</h4>
                    <p className="text-sm text-muted-foreground">Complete our AI-powered assessment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Explore Recommendations</h4>
                    <p className="text-sm text-muted-foreground">Discover your personalized career paths</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Start Learning</h4>
                    <p className="text-sm text-muted-foreground">Begin your personalized learning journey</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 gradient-text">Additional Resources</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Book className="w-4 h-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  SDK Downloads
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Developer Community
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Guidelines
                </Button>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="glass-card p-8 rounded-2xl text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Need More Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our technical support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="hero" size="lg">
                Contact Technical Support
              </Button>
              <Button variant="glass" size="lg">
                Join Developer Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Documentation;
