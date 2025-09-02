import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Code, 
  Shield, 
  BarChart3, 
  Cloud, 
  Brain, 
  Smartphone,
  Globe,
  Database,
  ArrowRight,
  Star
} from "lucide-react";
import careerPathsImg from "@/assets/career-paths.jpg";
import ProjectManagement from "./ProjectManagement";
import LearningPath from "./LearningPath";

const CareerPathsSection = () => {
  const [selectedPath, setSelectedPath] = useState(0);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const careerPaths = [
    {
      title: "Software Engineer",
      description: "Build applications, websites, and software systems that power the digital world.",
      icon: Code,
      color: "from-blue-500 to-purple-600",
      skills: ["React", "Node.js", "Python", "Git"],
      salary: "LKR 80,000 - 300,000",
      demand: "Very High",
      projects: 24
    },
    {
      title: "Cybersecurity Specialist",
      description: "Protect digital assets and networks from cyber threats and security breaches.",
      icon: Shield,
      color: "from-red-500 to-orange-600",
      skills: ["Network Security", "Ethical Hacking", "Risk Assessment"],
      salary: "LKR 100,000 - 400,000",
      demand: "Extremely High",
      projects: 18
    },
    {
      title: "Data Scientist",
      description: "Extract insights from data to drive business decisions and innovation.",
      icon: BarChart3,
      color: "from-green-500 to-teal-600",
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      salary: "LKR 90,000 - 350,000",
      demand: "High",
      projects: 21
    },
    {
      title: "Cloud Engineer",
      description: "Design and manage scalable cloud infrastructure and services.",
      icon: Cloud,
      color: "from-cyan-500 to-blue-600",
      skills: ["AWS", "Docker", "Kubernetes", "DevOps"],
      salary: "LKR 120,000 - 450,000",
      demand: "Very High",
      projects: 16
    },
    {
      title: "AI/ML Engineer",
      description: "Develop intelligent systems and machine learning models for automation.",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      skills: ["TensorFlow", "PyTorch", "Deep Learning", "NLP"],
      salary: "LKR 150,000 - 500,000",
      demand: "Extremely High",
      projects: 14
    },
    {
      title: "Mobile Developer",
      description: "Create engaging mobile applications for iOS and Android platforms.",
      icon: Smartphone,
      color: "from-indigo-500 to-purple-600",
      skills: ["React Native", "Flutter", "Swift", "Kotlin"],
      salary: "LKR 70,000 - 280,000",
      demand: "High",
      projects: 22
    }
  ];

  // Listen for career path selection events from AI Quiz
  useEffect(() => {
    const handleCareerPathSelection = (event: any) => {
      const { careerIndex, openLearningPath } = event.detail;
      console.log('Career path selection event received:', { careerIndex, openLearningPath });
      
      // Set the selected career path
      setSelectedPath(careerIndex);
      
      // Open learning path if requested
      if (openLearningPath) {
        setTimeout(() => {
          setShowLearningPath(true);
        }, 500); // Small delay to ensure path selection is visible
      }
    };

    // Add event listener
    window.addEventListener('selectCareerPath', handleCareerPathSelection);

    // Cleanup
    return () => {
      window.removeEventListener('selectCareerPath', handleCareerPathSelection);
    };
  }, []);

  return (
    <section id="careers" className="py-20 relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${careerPathsImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Explore Career Paths</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Your <span className="gradient-text">ICT Career</span> Awaits
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover diverse career opportunities in the rapidly growing ICT sector. 
            Each path offers unique challenges, growth potential, and competitive salaries.
          </p>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {careerPaths.map((path, index) => (
            <Card 
              key={path.title}
              className={`glass-card p-6 cursor-pointer transition-all duration-500 hover:scale-105 group ${
                selectedPath === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPath(index)}
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${path.color} flex items-center justify-center group-hover:animate-glow`}>
                  <path.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {path.description}
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {path.skills.slice(0, 3).map((skill) => (
                    <span 
                      key={skill}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {path.skills.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-xs rounded-full">
                      +{path.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary Range:</span>
                    <span className="font-medium">{path.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Demand:</span>
                    <span className={`font-medium ${
                      path.demand === 'Extremely High' ? 'text-red-400' : 
                      path.demand === 'Very High' ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {path.demand}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects:</span>
                    <span className="font-medium">{path.projects} available</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Path Details */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-r ${careerPaths[selectedPath].color} flex items-center justify-center animate-glow`}>
                  {(() => {
                    const IconComponent = careerPaths[selectedPath].icon;
                    return <IconComponent className="w-10 h-10 text-white" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{careerPaths[selectedPath].title}</h3>
                  <p className="text-muted-foreground">Career Path Details</p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {careerPaths[selectedPath].description} This path offers excellent growth opportunities 
                and competitive compensation in Sri Lanka's expanding tech sector.
              </p>

              <div className="flex flex-wrap gap-2">
                {careerPaths[selectedPath].skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="group"
                  onClick={() => setShowLearningPath(true)}
                >
                  Start Learning Path
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="glass" 
                  size="lg"
                  onClick={() => setShowProjects(true)}
                >
                  View Projects
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Learning Progress */}
              <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h4 className="font-bold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-primary" />
                  Learning Roadmap
                </h4>
                <div className="space-y-3">
                  {['Fundamentals', 'Intermediate', 'Advanced', 'Specialization'].map((level, index) => (
                    <div key={level} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${index < 2 ? 'bg-primary' : 'bg-muted'}`} />
                      <span className={index < 2 ? 'text-foreground' : 'text-muted-foreground'}>
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Market */}
              <div className="glass-card p-6">
                <h4 className="font-bold mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-secondary" />
                  Market Insights
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Open Positions</span>
                    <span className="text-green-400 font-medium">1,200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate</span>
                    <span className="text-blue-400 font-medium">+28% YoY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remote Options</span>
                    <span className="text-purple-400 font-medium">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path Dialog */}
      <Dialog open={showLearningPath} onOpenChange={setShowLearningPath}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{careerPaths[selectedPath].title} Learning Path</DialogTitle>
          </DialogHeader>
          <LearningPath 
            careerPath={careerPaths[selectedPath].title}
            onClose={() => setShowLearningPath(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Projects Dialog */}
      <Dialog open={showProjects} onOpenChange={setShowProjects}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{careerPaths[selectedPath].title} Projects</DialogTitle>
          </DialogHeader>
          <ProjectManagement 
            careerPath={careerPaths[selectedPath].title}
            onClose={() => setShowProjects(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CareerPathsSection;