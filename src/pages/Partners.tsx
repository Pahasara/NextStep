import { Building2, Handshake, Award, Globe } from "lucide-react";
import Layout from "@/components/Layout";

const Partners = () => {
  const partnerCategories = [
    {
      title: "University Partners",
      icon: Building2,
      description: "Leading educational institutions across Sri Lanka",
      partners: [
        {
          name: "University of Colombo",
          description: "Faculty of Science - Computer Science Department",
          logo: "/partners/uoc.jpg",
          partnership: "Academic collaboration and curriculum development"
        },
        {
          name: "University of Moratuwa",
          description: "Faculty of Information Technology",
          logo: "/partners/uom.jpg",
          partnership: "Research partnership in AI and career guidance"
        },
        {
          name: "SLIIT",
          description: "Sri Lanka Institute of Information Technology",
          logo: "/partners/sliit.jpg",
          partnership: "Student career development programs"
        },
        {
          name: "NSBM",
          description: "National School of Business Management",
          logo: "/partners/nsbm.jpg",
          partnership: "Industry-academia collaboration"
        }
      ]
    },
    {
      title: "Industry Partners",
      icon: Handshake,
      description: "Technology companies offering career opportunities",
      partners: [
        {
          name: "IFS",
          description: "Global Enterprise Software Company",
          logo: "/partners/ifs.jpg",
          partnership: "Internship programs and career placements"
        },
        {
          name: "Virtusa",
          description: "Digital Engineering and Technology Services",
          logo: "/partners/virtusa.jpg",
          partnership: "Skills development and mentorship programs"
        },
        {
          name: "WSO2",
          description: "Open Source Technology Company",
          logo: "/partners/wso2.jpg",
          partnership: "Technical training and project collaboration"
        },
        {
          name: "CodeGen",
          description: "Software Development and Consulting",
          logo: "/partners/codegen.jpg",
          partnership: "Graduate recruitment and training programs"
        }
      ]
    },
    {
      title: "Technology Partners",
      icon: Award,
      description: "Platform and infrastructure providers",
      partners: [
        {
          name: "Google Cloud",
          description: "Cloud Computing Platform",
          logo: "/partners/gcp.jpg",
          partnership: "AI/ML infrastructure and credits program"
        },
        {
          name: "AWS",
          description: "Amazon Web Services",
          logo: "/partners/aws.jpg",
          partnership: "Cloud hosting and educational resources"
        },
        {
          name: "Microsoft",
          description: "Technology Solutions",
          logo: "/partners/microsoft.jpg",
          partnership: "Azure services and educational licensing"
        },
        {
          name: "OpenAI",
          description: "Artificial Intelligence Research",
          logo: "/partners/openai.jpg",
          partnership: "AI technology integration and research"
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Partners</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We collaborate with leading universities, technology companies, and organizations 
              to provide the best opportunities for Sri Lankan ICT students.
            </p>
          </div>

          {/* Partner Categories */}
          {partnerCategories.map((category, categoryIndex) => (
            <div key={category.title} className="mb-16">
              <div className="flex items-center justify-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold gradient-text">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.partners.map((partner, index) => (
                  <div key={partner.name} className="glass-card p-8 rounded-2xl group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                        <p className="text-primary mb-3">{partner.description}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {partner.partnership}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Partnership Benefits */}
          <div className="glass-card p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Partnership Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Direct Industry Access</h3>
                <p className="text-muted-foreground">
                  Connect students directly with industry professionals and career opportunities
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Global Opportunities</h3>
                <p className="text-muted-foreground">
                  Access to international internships and career paths through global partners
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Quality Assurance</h3>
                <p className="text-muted-foreground">
                  Ensuring high-quality education and career guidance through trusted partnerships
                </p>
              </div>
            </div>
          </div>

          {/* Become a Partner */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-6">Become a Partner</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our mission to empower the next generation of ICT professionals in Sri Lanka. 
              Partner with us to create meaningful opportunities for students.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:scale-105 transition-transform duration-300"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Partners;
