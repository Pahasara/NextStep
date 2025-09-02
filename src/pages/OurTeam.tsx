import { Brain, Code, Lightbulb, Users } from "lucide-react";
import Layout from "@/components/Layout";

const OurTeam = () => {
  const teamMembers = [
    {
      name: "Dr. Samantha Perera",
      role: "Founder & CEO",
      bio: "PhD in Computer Science with 15+ years of experience in AI and education technology.",
      image: "/team/samantha.jpg",
      icon: Brain
    },
    {
      name: "Ravindu Silva",
      role: "CTO",
      bio: "Senior Software Engineer specializing in AI/ML systems and scalable platform architecture.",
      image: "/team/ravindu.jpg",
      icon: Code
    },
    {
      name: "Nimali Fernando",
      role: "Head of Product",
      bio: "Product strategist with expertise in educational technology and user experience design.",
      image: "/team/nimali.jpg",
      icon: Lightbulb
    },
    {
      name: "Kasun Wickramasinghe",
      role: "Head of Partnerships",
      bio: "Industry relations expert connecting students with leading technology companies.",
      image: "/team/kasun.jpg",
      icon: Users
    }
  ];

  const advisors = [
    {
      name: "Prof. Chandana Gamage",
      role: "Academic Advisor",
      institution: "University of Colombo",
      expertise: "Computer Science Education"
    },
    {
      name: "Anjali Rodrigo",
      role: "Industry Advisor",
      institution: "Tech Lead at IFS",
      expertise: "Software Engineering"
    },
    {
      name: "Dilshan Jayakody",
      role: "Career Advisor",
      institution: "HR Director at Virtusa",
      expertise: "Technology Recruitment"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Meet the passionate individuals behind NextStep who are dedicated to transforming 
              career discovery for Sri Lankan ICT students.
            </p>
          </div>

          {/* Core Team */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Core Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={member.name} className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
                    <member.icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advisors */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Advisory Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advisors.map((advisor, index) => (
                <div key={advisor.name} className="glass-card p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">{advisor.name}</h3>
                  <p className="text-primary font-medium mb-2">{advisor.role}</p>
                  <p className="text-secondary mb-4">{advisor.institution}</p>
                  <p className="text-muted-foreground text-sm">{advisor.expertise}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Join Our Team */}
          <div className="glass-card p-8 md:p-12 rounded-2xl text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals who want to make a difference in education technology. 
              Join us in shaping the future of career discovery for Sri Lankan students.
            </p>
            <a 
              href="/careers" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:scale-105 transition-transform duration-300"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default OurTeam;
