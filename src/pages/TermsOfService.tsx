import { Scale, FileText, UserCheck, AlertTriangle, Shield, Gavel } from "lucide-react";

const TermsOfService = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      icon: UserCheck,
      title: "Account Terms",
      content: [
        "You must be 16 years or older to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the security of your account credentials",
        "You are responsible for all activities under your account",
        "One account per person - duplicate accounts are not permitted"
      ]
    },
    {
      icon: FileText,
      title: "Acceptable Use",
      content: [
        "Use the platform for legitimate educational and career development purposes",
        "Do not share false or misleading information in your profile or assessments",
        "Respect other users and maintain professional communication",
        "Do not attempt to hack, disrupt, or compromise platform security",
        "Do not use the platform for any illegal or unauthorized purposes"
      ]
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "NextStep owns all platform content, design, and functionality",
        "Career assessment algorithms and recommendation systems are proprietary",
        "You retain ownership of content you create and submit",
        "By submitting content, you grant us license to use it for platform purposes",
        "Respect third-party intellectual property rights"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Creating fake profiles or providing false information",
        "Attempting to circumvent or manipulate assessment results",
        "Harassing, threatening, or discriminating against other users",
        "Sharing inappropriate, offensive, or harmful content",
        "Commercial solicitation or spam without permission"
      ]
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "Platform provided 'as is' without warranties of any kind",
        "We are not liable for decisions made based on platform recommendations",
        "Career guidance is educational and should not replace professional advice",
        "We do not guarantee specific career outcomes or job placements",
        "Maximum liability limited to amount paid for premium services"
      ]
    },
    {
      icon: Gavel,
      title: "Termination",
      content: [
        "You may terminate your account at any time",
        "We may suspend or terminate accounts for policy violations",
        "Termination does not relieve you of obligations incurred before termination",
        "We may retain certain information as required by law",
        "Terms survive termination where legally necessary"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Please read these terms carefully before using NextStep. 
              By accessing our platform, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-accent mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your use of NextStep's career discovery platform 
              and services. By creating an account or using our platform, you agree to comply with 
              and be bound by these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you do not agree with any part of these terms, you may not access or use our services. 
              We reserve the right to update these Terms at any time, and continued use of the platform 
              constitutes acceptance of any modifications.
            </p>
          </div>

          {/* Terms Sections */}
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

          {/* Service Availability */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Service Availability</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We strive to provide reliable and consistent access to our platform. However, we cannot guarantee 
                uninterrupted service and may need to perform maintenance, updates, or experience temporary outages.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">Service Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Platform available 24/7 with scheduled maintenance during low-usage periods
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Support Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Customer support available Monday-Friday, 9 AM - 6 PM (Sri Lanka time)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Payment Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Free Services</h3>
                <p className="text-muted-foreground">
                  Basic career discovery features are provided free of charge to all users.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Premium Services</h3>
                <p className="text-muted-foreground">
                  Advanced features and personalized coaching may require payment. 
                  All fees will be clearly disclosed before purchase.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Refund Policy</h3>
                <p className="text-muted-foreground">
                  Refunds for premium services are available within 14 days of purchase, 
                  subject to our refund policy terms.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Privacy and Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your privacy is important to us. Our collection, use, and protection of your personal 
              information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using our services, you consent to the collection and use of your information as 
              described in our Privacy Policy. We implement appropriate security measures to protect 
              your data and comply with applicable data protection laws.
            </p>
          </div>

          {/* Governing Law */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Governing Law and Disputes</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of Sri Lanka. Any disputes arising from these Terms 
                or your use of our services will be resolved through the courts of Sri Lanka.
              </p>
              <div>
                <h3 className="text-lg font-bold mb-2">Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  We encourage resolving disputes through direct communication. If formal legal action 
                  is necessary, it must be filed in the appropriate courts of Colombo, Sri Lanka.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Questions About These Terms?</h2>
            <p className="text-center text-muted-foreground mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="text-center space-y-2">
              <p className="text-sm"><strong>Email:</strong> legal@nextstep.lk</p>
              <p className="text-sm"><strong>Phone:</strong> +94 11 234 5678</p>
              <p className="text-sm"><strong>Address:</strong> NextStep, Level 5, Liberty Plaza, Colombo 03, Sri Lanka</p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
