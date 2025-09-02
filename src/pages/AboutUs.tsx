import Layout from "@/components/Layout";

const AboutUs = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About NextStep</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Empowering the next generation of ICT professionals in Sri Lanka
            </p>
          </div>

          {/* Mission Section */}
          <div className="glass-card p-8 md:p-12 rounded-2xl mb-12">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              NextStep is dedicated to transforming how Sri Lankan ICT undergraduates discover and pursue their career paths. 
              We leverage cutting-edge AI technology to provide personalized career recommendations, create tailored learning experiences, 
              and connect students with real-world opportunities.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform bridges the gap between academic learning and industry requirements, ensuring that every student 
              can find their perfect career path in the rapidly evolving technology landscape.
            </p>
          </div>

          {/* Vision Section */}
          <div className="glass-card p-8 md:p-12 rounded-2xl mb-12">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To become the leading career discovery platform for ICT students in Sri Lanka, creating a thriving ecosystem 
              where technology talent meets opportunity, innovation flourishes, and every student can achieve their full potential 
              in the digital economy.
            </p>
          </div>

          {/* Values Section */}
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-8 gradient-text">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate to provide cutting-edge solutions that meet the evolving needs of students and industry.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Accessibility</h3>
                <p className="text-muted-foreground">
                  We believe quality career guidance should be accessible to every student, regardless of their background.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from our AI algorithms to our user experience.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Community</h3>
                <p className="text-muted-foreground">
                  We foster a supportive community where students, educators, and industry professionals can connect and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default AboutUs;
