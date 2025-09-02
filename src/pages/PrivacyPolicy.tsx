import { Shield, Eye, Lock, Database, Users, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, university details)",
        "Career assessment responses and quiz results",
        "Learning progress and platform usage data",
        "Device and browser information for technical optimization",
        "Communication preferences and feedback"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "Provide personalized career recommendations using AI algorithms",
        "Track your learning progress and suggest improvements",
        "Send relevant updates about career opportunities and courses",
        "Improve our platform and develop new features",
        "Ensure platform security and prevent fraudulent activity"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Career insights may be shared with partner universities (with consent)",
        "Anonymized aggregate data may be used for research purposes",
        "Information may be disclosed if required by law or legal process",
        "Service providers may access data necessary to provide our services"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission and storage",
        "Regular security audits and vulnerability assessments",
        "Restricted access to personal data on a need-to-know basis",
        "Secure cloud infrastructure with backup and disaster recovery",
        "Two-factor authentication for enhanced account security"
      ]
    },
    {
      icon: Shield,
      title: "Your Rights and Choices",
      content: [
        "Access and review your personal information at any time",
        "Request correction of inaccurate or incomplete data",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Data portability - export your information in common formats"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Data Retention",
      content: [
        "Profile data retained while your account is active",
        "Career assessment results kept to improve recommendations",
        "Communication logs retained for customer service purposes",
        "Anonymized usage data may be retained indefinitely for research",
        "Deleted account data purged within 30 days (except legal requirements)"
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your privacy is important to us. This policy explains how NextStep collects, 
              uses, and protects your personal information.
            </p>
            <p className="text-sm text-accent mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Our Commitment to Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At NextStep, we are committed to protecting your privacy and maintaining the confidentiality 
              of your personal information. This Privacy Policy outlines how we collect, use, store, and 
              protect your data when you use our career discovery platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using NextStep, you agree to the collection and use of information in accordance with this policy. 
              We encourage you to read this policy carefully to understand our practices regarding your personal data.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8 mb-12">
            {sections.map((section, index) => (
              <div key={section.title} className="glass-card p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cookies and Tracking */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Cookies and Tracking Technologies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground">
                  Required for basic platform functionality, including authentication and security features.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  Help us understand how users interact with our platform to improve user experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Preference Cookies</h3>
                <p className="text-muted-foreground">
                  Remember your settings and preferences to provide a personalized experience.
                </p>
              </div>
            </div>
          </div>

          {/* International Data Transfers */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              NextStep is based in Sri Lanka, but our platform may be accessed from around the world. 
              Your information may be transferred to, stored, and processed in countries other than your own, 
              where data protection laws may differ.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We ensure that any international transfers comply with applicable data protection laws and 
              implement appropriate safeguards to protect your personal information.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              NextStep is designed for university students and adults. We do not knowingly collect personal 
              information from children under 16 years of age. If you believe we have collected information 
              from a child under 16, please contact us immediately and we will take steps to remove such information.
            </p>
          </div>

          {/* Contact Information */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Questions About Privacy?</h2>
            <p className="text-center text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            <div className="text-center space-y-2">
              <p className="text-sm"><strong>Email:</strong> privacy@nextstep.lk</p>
              <p className="text-sm"><strong>Phone:</strong> +94 11 234 5678</p>
              <p className="text-sm"><strong>Address:</strong> NextStep, Level 5, Liberty Plaza, Colombo 03, Sri Lanka</p>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default PrivacyPolicy;
