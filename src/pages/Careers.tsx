import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, DollarSign, Users, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior AI/ML Engineer",
      department: "Engineering",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      salary: "LKR 200,000 - 300,000",
      description: "Lead the development of our AI-powered career recommendation engine. Work with cutting-edge machine learning technologies to personalize student experiences.",
      requirements: [
        "5+ years experience in AI/ML development",
        "Proficiency in Python, TensorFlow, PyTorch",
        "Experience with recommendation systems",
        "Strong understanding of NLP and data processing"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible working hours",
        "Health insurance",
        "Professional development budget"
      ]
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      salary: "LKR 120,000 - 180,000",
      description: "Build beautiful and responsive user interfaces using React and modern web technologies. Create engaging experiences for students and educators.",
      requirements: [
        "3+ years experience with React/Next.js",
        "Proficiency in TypeScript, Tailwind CSS",
        "Experience with modern state management",
        "Strong understanding of UI/UX principles"
      ],
      benefits: [
        "Modern tech stack",
        "Remote work options",
        "Health insurance",
        "Learning and development opportunities"
      ]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      salary: "LKR 150,000 - 220,000",
      description: "Drive product strategy and development for our career discovery platform. Work closely with students, educators, and industry partners to shape the future of education technology.",
      requirements: [
        "3+ years product management experience",
        "Experience in EdTech or SaaS products",
        "Strong analytical and communication skills",
        "Understanding of agile development processes"
      ],
      benefits: [
        "Shape product direction",
        "Work with diverse stakeholders",
        "Competitive compensation",
        "Growth opportunities"
      ]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      salary: "LKR 140,000 - 200,000",
      description: "Manage and scale our cloud infrastructure. Implement CI/CD pipelines and ensure high availability of our platform serving thousands of students.",
      requirements: [
        "3+ years DevOps experience",
        "Proficiency with AWS/GCP, Docker, Kubernetes",
        "Experience with CI/CD pipelines",
        "Knowledge of monitoring and logging tools"
      ],
      benefits: [
        "Cloud technology exposure",
        "Infrastructure ownership",
        "Flexible schedule",
        "Professional certifications support"
      ]
    },
    {
      title: "Content Strategist",
      department: "Marketing",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      salary: "LKR 80,000 - 120,000",
      description: "Create compelling content that helps students discover their career paths. Develop educational materials, blog posts, and marketing content.",
      requirements: [
        "2+ years content creation experience",
        "Strong writing and communication skills",
        "Understanding of digital marketing",
        "Knowledge of ICT industry trends"
      ],
      benefits: [
        "Creative freedom",
        "Impact on student success",
        "Collaborative environment",
        "Content creation tools access"
      ]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      salary: "LKR 100,000 - 150,000",
      description: "Design intuitive and engaging user experiences for our platform. Create wireframes, prototypes, and visual designs that delight our users.",
      requirements: [
        "3+ years UX/UI design experience",
        "Proficiency in Figma, Adobe Creative Suite",
        "Experience with design systems",
        "Understanding of user research methods"
      ],
      benefits: [
        "Design leadership opportunities",
        "Latest design tools",
        "User research involvement",
        "Portfolio building projects"
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Market-leading salaries with equity participation and performance bonuses"
    },
    {
      icon: Clock,
      title: "Flexible Work",
      description: "Hybrid work model with flexible hours and unlimited PTO policy"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate, talented individuals who care about making a difference"
    },
    {
      icon: Briefcase,
      title: "Growth Opportunities",
      description: "Clear career progression paths with mentorship and learning budgets"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Help us transform career discovery for Sri Lankan ICT students. 
              Build the future of education technology with a passionate, mission-driven team.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Open Positions</h2>
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div key={position.title} className="glass-card p-8 rounded-2xl">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{position.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{position.salary}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="hero" size="lg" className="group">
                      Apply Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {position.description}
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-primary">Requirements</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 text-secondary">Benefits</h4>
                      <ul className="space-y-2">
                        {position.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Culture Section */}
          <div className="glass-card p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Our Culture</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed mb-8 max-w-3xl mx-auto">
              At NextStep, we believe in creating an inclusive, innovative environment where everyone can thrive. 
              We value curiosity, collaboration, and continuous learning. Our team is passionate about making 
              a positive impact on education and helping students achieve their career goals.
            </p>
            <div className="text-center">
              <Button variant="glass" size="lg">
                Learn More About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Careers;
