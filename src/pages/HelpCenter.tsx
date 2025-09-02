import { Button } from "@/components/ui/button";
import { Search, Book, MessageCircle, Phone, Mail, HelpCircle, Users, Settings } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of using NextStep",
      articles: [
        "How to create your profile",
        "Taking your first career quiz",
        "Understanding your dashboard",
        "Setting up learning goals"
      ]
    },
    {
      icon: Book,
      title: "Career Discovery",
      description: "Make the most of our AI-powered recommendations",
      articles: [
        "How the AI quiz works",
        "Understanding career matches",
        "Exploring different ICT paths",
        "Using career insights"
      ]
    },
    {
      icon: Settings,
      title: "Account Management",
      description: "Manage your account and preferences",
      articles: [
        "Updating your profile",
        "Privacy settings",
        "Notification preferences",
        "Account security"
      ]
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Solutions to common issues",
      articles: [
        "Login problems",
        "Quiz not loading",
        "Profile sync issues",
        "Browser compatibility"
      ]
    }
  ];

  const popularArticles = [
    {
      title: "How to get the most accurate career recommendations",
      category: "Career Discovery",
      readTime: "5 min",
      helpful: 124
    },
    {
      title: "Understanding your personality and skills assessment",
      category: "Getting Started", 
      readTime: "3 min",
      helpful: 98
    },
    {
      title: "Setting up your learning path and goals",
      category: "Learning",
      readTime: "4 min",
      helpful: 87
    },
    {
      title: "Connecting with industry mentors and professionals",
      category: "Networking",
      readTime: "6 min",
      helpful: 76
    },
    {
      title: "Preparing for technical interviews and assessments",
      category: "Career Prep",
      readTime: "8 min",
      helpful: 65
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Mon-Fri, 9 AM - 6 PM",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "24/7 - Response within 24 hours",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with a support specialist",
      availability: "Mon-Fri, 10 AM - 5 PM",
      action: "Call Now"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              Find answers to your questions and get the help you need to make the most of NextStep.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, and guides..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {helpCategories.map((category, index) => (
              <div key={category.title} className="glass-card p-6 rounded-2xl group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.articles.slice(0, 3).map((article, articleIndex) => (
                    <a
                      key={articleIndex}
                      href="#"
                      className="block text-sm text-primary hover:text-secondary transition-colors"
                    >
                      {article}
                    </a>
                  ))}
                  <a href="#" className="block text-sm text-accent hover:text-primary transition-colors font-medium">
                    View all articles →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Articles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 gradient-text">Popular Articles</h2>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={article.title} className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded">{article.category}</span>
                        <span>{article.readTime} read</span>
                        <span>{article.helpful} found helpful</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Still Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <div key={option.title} className="glass-card p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-muted-foreground mb-2">{option.description}</p>
                  <p className="text-sm text-accent mb-6">{option.availability}</p>
                  <Button variant="outline" className="w-full">
                    {option.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Documentation</div>
                  <div className="text-xs text-muted-foreground">Technical guides</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Video Tutorials</div>
                  <div className="text-xs text-muted-foreground">Step-by-step videos</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Community</div>
                  <div className="text-xs text-muted-foreground">User discussions</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Feature Requests</div>
                  <div className="text-xs text-muted-foreground">Suggest improvements</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default HelpCenter;
