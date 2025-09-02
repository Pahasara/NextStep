import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import AnimatedText from "./AnimatedText";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const smoothScrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Get element position accounting for fixed header
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        // Polyfill for older browsers
        const startPosition = window.pageYOffset;
        const distance = elementPosition - startPosition;
        const duration = 1000;
        let start: number | null = null;

        function step(timestamp: number) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          
          // Easing function for smooth animation
          const ease = 0.5 - Math.cos(percentage * Math.PI) / 2;
          
          window.scrollTo(0, startPosition + distance * ease);
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        
        window.requestAnimationFrame(step);
      }
    }
  };

  const handleStartJourney = () => {
    if (!user) {
      // User not logged in, redirect to login page
      navigate("/auth");
    } else {
      // User is logged in, scroll to career paths section
      smoothScrollToElement("careers");
    }
  };

  const handleTakeQuiz = () => {
    smoothScrollToElement("quiz");
  };

  const stats = [
    { label: "Career Paths", value: "15+", icon: Target },
    { label: "Students Helped", value: "2,500+", icon: TrendingUp },
    { label: "Success Rate", value: "94%", icon: Sparkles },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}
      />
      <div className="absolute inset-0 bg-gradient-hero z-10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6 animate-glow">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">AI-Powered Career Discovery</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <AnimatedText 
                text="Discover Your" 
                delay={500}
                staggerDelay={0.1}
                duration={1.0}
                animationType="scale"
              />
              <div className="block">
                <AnimatedText 
                  text="Perfect ICT Career" 
                  delay={1200}
                  staggerDelay={0.08}
                  duration={1.2}
                  animationType="glow"
                />
              </div>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unlock your potential with AI-driven career recommendations, personalized learning paths, and hands-on projects tailored for Sri Lankan ICT undergraduates.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button variant="hero" size="lg" className="group" onClick={handleStartJourney}>
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="lg" onClick={handleTakeQuiz}>
              Take AI Quiz
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="glass-card p-6 rounded-xl text-center group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4 group-hover:animate-glow">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;