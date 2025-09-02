import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  Target,
  Zap,
  Code,
  Shield,
  BarChart3,
  Cloud,
  Cpu,
  Smartphone
} from "lucide-react";

const AIQuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What type of problem-solving excites you most?",
      options: [
        "Building user-friendly applications", // Software Engineer
        "Protecting systems from cyber threats", // Cybersecurity
        "Analyzing data to find patterns", // Data Scientist
        "Managing scalable cloud infrastructure", // Cloud Engineer
        "Creating intelligent automated systems", // AI/ML Engineer
        "Developing mobile experiences" // Mobile Developer
      ]
    },
    {
      id: 2,
      question: "Which work environment appeals to you?",
      options: [
        "Agile development teams",
        "Security operations centers",
        "Research and analytics labs",
        "DevOps and infrastructure teams",
        "AI research and innovation labs",
        "Mobile and UX design studios"
      ]
    },
    {
      id: 3,
      question: "What's your preferred learning style?",
      options: [
        "Hands-on coding projects",
        "Security simulations and challenges",
        "Data analysis and visualization",
        "Infrastructure automation labs",
        "Machine learning experimentation",
        "Mobile app prototyping"
      ]
    },
    {
      id: 4,
      question: "Which technology stack interests you most?",
      options: [
        "JavaScript, React, Node.js",
        "Penetration testing tools, firewalls",
        "Python, R, SQL, Tableau",
        "AWS, Docker, Kubernetes",
        "TensorFlow, PyTorch, scikit-learn",
        "Swift, Kotlin, React Native"
      ]
    },
    {
      id: 5,
      question: "What motivates you in your work?",
      options: [
        "Creating software that people love to use",
        "Keeping organizations safe from threats",
        "Discovering insights from complex data",
        "Building reliable, scalable systems",
        "Pushing the boundaries of AI capabilities",
        "Crafting seamless mobile experiences"
      ]
    },
    {
      id: 6,
      question: "Which daily activity sounds most appealing?",
      options: [
        "Writing clean, maintainable code",
        "Monitoring security incidents",
        "Building predictive models",
        "Optimizing cloud resource usage",
        "Training neural networks",
        "Designing intuitive user interfaces"
      ]
    },
    {
      id: 7,
      question: "What type of challenges do you enjoy?",
      options: [
        "Debugging complex software issues",
        "Identifying security vulnerabilities",
        "Finding patterns in messy datasets",
        "Scaling systems for high traffic",
        "Improving model accuracy and performance",
        "Optimizing app performance across devices"
      ]
    },
    {
      id: 8,
      question: "Which skill set do you want to develop?",
      options: [
        "Full-stack development and architecture",
        "Ethical hacking and forensics",
        "Statistical analysis and machine learning",
        "Infrastructure as code and automation",
        "Deep learning and computer vision",
        "Cross-platform mobile development"
      ]
    },
    {
      id: 9,
      question: "What type of impact do you want to make?",
      options: [
        "Build software that improves daily life",
        "Protect against cyber attacks",
        "Enable data-driven decision making",
        "Ensure reliable digital infrastructure",
        "Advance artificial intelligence capabilities",
        "Create engaging mobile experiences"
      ]
    },
    {
      id: 10,
      question: "Which industry sector excites you most?",
      options: [
        "Tech startups and software companies",
        "Financial services and government",
        "Healthcare and scientific research",
        "Enterprise and large-scale operations",
        "Research institutions and tech giants",
        "Consumer apps and gaming"
      ]
    },
    {
      id: 11,
      question: "What's your approach to problem-solving?",
      options: [
        "Break down complex features into components",
        "Think like an attacker to find weaknesses",
        "Use statistical methods to test hypotheses",
        "Design for scalability and reliability",
        "Experiment with different algorithms",
        "Focus on user experience and usability"
      ]
    },
    {
      id: 12,
      question: "Which certification would you pursue?",
      options: [
        "AWS Certified Developer",
        "Certified Information Security Professional",
        "Certified Analytics Professional",
        "AWS Solutions Architect",
        "Google Cloud ML Engineer",
        "Google Associate Android Developer"
      ]
    },
    {
      id: 13,
      question: "What excites you about emerging technologies?",
      options: [
        "New web frameworks and development tools",
        "Advanced threat detection systems",
        "Big data and real-time analytics",
        "Serverless and edge computing",
        "Generative AI and large language models",
        "AR/VR and IoT mobile integration"
      ]
    },
    {
      id: 14,
      question: "How do you prefer to collaborate?",
      options: [
        "Code reviews and pair programming",
        "Incident response teams",
        "Cross-functional analytics projects",
        "DevOps and site reliability teams",
        "Research collaborations and publications",
        "Design and product development teams"
      ]
    },
    {
      id: 15,
      question: "What type of projects energize you?",
      options: [
        "Building scalable web applications",
        "Conducting security assessments",
        "Creating data visualization dashboards",
        "Architecting cloud-native solutions",
        "Developing AI-powered applications",
        "Creating award-winning mobile apps"
      ]
    },
    {
      id: 16,
      question: "Which work style suits you best?",
      options: [
        "Iterative development with regular releases",
        "High-stakes incident response",
        "Deep analysis and research phases",
        "Continuous deployment and monitoring",
        "Experimental and hypothesis-driven work",
        "User-centered design iterations"
      ]
    },
    {
      id: 17,
      question: "What type of continuous learning appeals to you?",
      options: [
        "New programming languages and frameworks",
        "Latest cybersecurity threats and defenses",
        "Advanced statistics and data science",
        "Cloud services and infrastructure patterns",
        "Cutting-edge AI research and techniques",
        "Mobile platform updates and design trends"
      ]
    },
    {
      id: 18,
      question: "Which outcome would make you proudest?",
      options: [
        "Launching a successful software product",
        "Preventing a major security breach",
        "Discovering actionable business insights",
        "Achieving 99.99% system uptime",
        "Publishing breakthrough AI research",
        "Creating a top-rated mobile app"
      ]
    },
    {
      id: 19,
      question: "What draws you to technology?",
      options: [
        "The creative process of building software",
        "The chess game of cybersecurity",
        "The detective work of data analysis",
        "The engineering challenge of scale",
        "The frontier of artificial intelligence",
        "The intimacy of mobile user experience"
      ]
    },
    {
      id: 20,
      question: "Which future career goal resonates with you?",
      options: [
        "Lead architect or engineering manager",
        "Chief Information Security Officer",
        "Head of data science or analytics",
        "Cloud solutions architect or DevOps lead",
        "AI research director or ML principal",
        "Mobile product lead or app entrepreneur"
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const getRecommendedPath = () => {
    // Advanced recommendation logic
    const careerScores = {
      "Software Engineer": 0,
      "Cybersecurity Specialist": 0,
      "Data Scientist": 0,
      "Cloud Engineer": 0,
      "AI/ML Engineer": 0,
      "Mobile Developer": 0
    };

    // Calculate scores based on answer patterns
    answers.forEach((answerIndex) => {
      switch(answerIndex) {
        case 0:
          careerScores["Software Engineer"] += 1;
          break;
        case 1:
          careerScores["Cybersecurity Specialist"] += 1;
          break;
        case 2:
          careerScores["Data Scientist"] += 1;
          break;
        case 3:
          careerScores["Cloud Engineer"] += 1;
          break;
        case 4:
          careerScores["AI/ML Engineer"] += 1;
          break;
        case 5:
          careerScores["Mobile Developer"] += 1;
          break;
      }
    });

    // Find the career with highest score
    const recommendedCareer = Object.entries(careerScores).reduce((a, b) => 
      careerScores[a[0]] > careerScores[b[0]] ? a : b
    )[0];

    const confidence = Math.round((careerScores[recommendedCareer] / answers.length) * 100);
    
    return { career: recommendedCareer, confidence };
  };

  const getCareerIcon = (career: string) => {
    const icons = {
      "Software Engineer": Code,
      "Cybersecurity Specialist": Shield,
      "Data Scientist": BarChart3,
      "Cloud Engineer": Cloud,
      "AI/ML Engineer": Cpu,
      "Mobile Developer": Smartphone
    };
    return icons[career as keyof typeof icons] || Code;
  };

  const getCareerDescription = (career: string) => {
    const descriptions = {
      "Software Engineer": "Build innovative applications and systems that power the digital world. You'll work with cutting-edge technologies to create software solutions that millions of users rely on daily.",
      "Cybersecurity Specialist": "Protect organizations from evolving cyber threats. You'll be on the front lines of digital security, implementing defenses and responding to incidents that keep data and systems safe.",
      "Data Scientist": "Transform raw data into actionable insights that drive business decisions. You'll use advanced analytics and machine learning to uncover patterns and predict future trends.",
      "Cloud Engineer": "Design and manage scalable cloud infrastructure that powers modern applications. You'll work with cutting-edge cloud technologies to ensure systems are reliable, secure, and efficient.",
      "AI/ML Engineer": "Build intelligent systems that can learn, adapt, and make decisions. You'll be at the forefront of artificial intelligence, creating solutions that push the boundaries of what's possible.",
      "Mobile Developer": "Create engaging mobile experiences that users love. You'll design and build apps that run seamlessly across different devices and platforms, reaching billions of users worldwide."
    };
    return descriptions[career as keyof typeof descriptions] || "";
  };

  const getCareerPathIndex = (career: string) => {
    // Map AI Quiz careers to Career Paths section indices
    const careerMapping = {
      "Software Engineer": 0,
      "Cybersecurity Specialist": 1,
      "Data Scientist": 2,
      "Cloud Engineer": 3,
      "AI/ML Engineer": 4,
      "Mobile Developer": 5
    };
    return careerMapping[career as keyof typeof careerMapping] || 0;
  };

  const handleViewLearningPath = () => {
    if (!result) return;
    
    // Navigate to careers section
    const careersElement = document.getElementById("careers");
    if (careersElement) {
      careersElement.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
      
      // Trigger career path selection and learning path opening
      const careerIndex = getCareerPathIndex(result.career);
      
      // Dispatch custom event to communicate with CareerPathsSection
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('selectCareerPath', { 
          detail: { 
            careerIndex,
            openLearningPath: true
          } 
        }));
      }, 1000); // Delay to allow smooth scroll to complete
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const result = showResults ? getRecommendedPath() : null;
  const CareerIcon = result ? getCareerIcon(result.career) : Target;

  return (
    <section id="quiz" className="py-20 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
            <Brain className="w-4 h-4 text-accent animate-glow" />
            <span className="text-sm font-medium">AI-Powered Assessment</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your <span className="gradient-text">Perfect Match</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take our comprehensive 20-question AI-powered quiz to receive personalized career recommendations 
            based on your interests, skills, and aspirations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <Card className="glass-card p-8 md:p-12">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {questions[currentQuestion].question}
                  </h3>
                  <p className="text-muted-foreground">Choose the option that best describes you</p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="glass"
                      className="h-auto p-4 text-left justify-start hover:scale-102 transition-all duration-300 group"
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="flex items-start space-x-4 w-full">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 group-hover:animate-glow">
                          <span className="text-white font-bold text-sm">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{option}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="glass-card p-8 md:p-12 text-center">
              <div className="space-y-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-glow">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Your Perfect Career Match!
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Based on your comprehensive responses, we recommend:
                  </p>
                </div>

                <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <CareerIcon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-2xl md:text-3xl font-bold gradient-text">{result?.career}</h4>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-left max-w-2xl mx-auto leading-relaxed">
                    {getCareerDescription(result?.career || "")}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
                    <Zap className="w-4 h-4" />
                    <span>{result?.confidence}% compatibility match</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Button variant="hero" size="lg" className="group" onClick={handleViewLearningPath}>
                    View Learning Path
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="glass" size="lg" onClick={resetQuiz}>
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: Brain,
              title: "Advanced AI Analysis",
              description: "20 comprehensive questions analyzed by sophisticated algorithms for precise career matching"
            },
            {
              icon: Target,
              title: "6 Career Paths",
              description: "Get recommendations across Software Engineering, Cybersecurity, Data Science, Cloud, AI/ML, and Mobile Development"
            },
            {
              icon: Zap,
              title: "Confidence Scoring",
              description: "Receive detailed compatibility percentages and personalized career insights"
            }
          ].map((feature, index) => (
            <Card key={feature.title} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-glow">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIQuizSection;