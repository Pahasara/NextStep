import { Button } from "@/components/ui/button";
import { Search, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create a NextStep account?",
          answer: "Creating an account is simple! Click the 'Sign Up' button, provide your email, create a password, and complete your profile with your university and study details. You'll receive a verification email to activate your account."
        },
        {
          question: "Is NextStep free to use?",
          answer: "Yes! NextStep's core features including career discovery, AI assessments, and basic learning paths are completely free for all Sri Lankan ICT students. We also offer premium features for advanced career coaching and personalized mentorship."
        },
        {
          question: "How accurate are the career recommendations?",
          answer: "Our AI-powered recommendations are based on comprehensive personality assessments, skills evaluations, and analysis of successful career paths. While highly accurate, they should be used as guidance alongside your own research and professional advice."
        },
        {
          question: "Can I retake the career assessment quiz?",
          answer: "Yes, you can retake the assessment every 6 months or when you feel your interests and skills have significantly changed. This helps keep your recommendations current and relevant to your growth."
        }
      ]
    },
    {
      title: "Career Discovery",
      faqs: [
        {
          question: "What ICT career paths does NextStep cover?",
          answer: "We cover over 15 major ICT career paths including Software Development, Data Science, Cybersecurity, UI/UX Design, DevOps, AI/ML Engineering, Product Management, Digital Marketing, and many more emerging tech roles."
        },
        {
          question: "How does the AI assessment work?",
          answer: "Our AI assessment analyzes your responses to personality questions, technical aptitude tests, and preference indicators. It then matches you with career paths based on successful professionals with similar profiles and the current job market demands."
        },
        {
          question: "Can I explore multiple career paths?",
          answer: "Absolutely! We encourage exploring multiple paths. You can view detailed information about different careers, their requirements, salary ranges, and growth prospects to make informed decisions about your future."
        },
        {
          question: "How often are career recommendations updated?",
          answer: "Career recommendations are updated continuously based on industry trends, job market data, and your progress on the platform. Major updates occur quarterly to reflect the latest market demands."
        }
      ]
    },
    {
      title: "Learning and Progress",
      faqs: [
        {
          question: "How do learning paths work?",
          answer: "Learning paths are personalized roadmaps based on your chosen career direction. They include recommended courses, projects, certifications, and skills to develop, arranged in a logical progression from beginner to advanced levels."
        },
        {
          question: "Are the courses and materials free?",
          answer: "We curate both free and paid learning resources. Many high-quality courses from platforms like Coursera, edX, and YouTube are free. We also partner with institutions to provide exclusive content for NextStep users."
        },
        {
          question: "How do I track my learning progress?",
          answer: "Your dashboard shows completion percentages, skills acquired, projects completed, and milestones achieved. You can also set learning goals and receive progress reports to stay motivated."
        },
        {
          question: "Can I get certificates for completed courses?",
          answer: "Yes! We track your course completions and provide NextStep certificates for finished learning paths. Many of our partner institutions also offer their own certificates upon course completion."
        }
      ]
    },
    {
      title: "Technical Support",
      faqs: [
        {
          question: "The platform is loading slowly. What should I do?",
          answer: "Try refreshing your browser, clearing cache and cookies, or switching to a different browser. If problems persist, check your internet connection or contact our technical support team for assistance."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email. If you don't receive the email, check your spam folder or contact support."
        },
        {
          question: "Can I use NextStep on my mobile device?",
          answer: "Yes! NextStep is fully responsive and works on all devices. We also have mobile apps available for iOS and Android devices for the best mobile experience."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your account settings and click on 'Edit Profile'. You can update your personal information, university details, skills, interests, and career preferences. Changes are saved automatically."
        }
      ]
    },
    {
      title: "Privacy and Security",
      faqs: [
        {
          question: "How is my personal data protected?",
          answer: "We use industry-standard encryption, secure servers, and strict access controls to protect your data. Your information is never sold to third parties, and we comply with international data protection standards."
        },
        {
          question: "Can I delete my account and data?",
          answer: "Yes, you can delete your account at any time from your account settings. This will permanently remove all your personal data from our systems within 30 days, except where retention is required by law."
        },
        {
          question: "Who can see my career assessment results?",
          answer: "Your assessment results are private by default. You can choose to share insights with mentors, career counselors, or potential employers through our secure sharing features, but this requires your explicit consent."
        },
        {
          question: "Is my browsing activity on NextStep tracked?",
          answer: "We collect anonymized usage data to improve our platform, but we don't track your personal browsing habits outside of NextStep. You can review and control data collection in your privacy settings."
        }
      ]
    },
    {
      title: "University and Industry Partnerships",
      faqs: [
        {
          question: "Which universities partner with NextStep?",
          answer: "We partner with major Sri Lankan universities including University of Colombo, University of Moratuwa, SLIIT, NSBM, and many others. Check our Partners page for the complete list."
        },
        {
          question: "How can my university become a partner?",
          answer: "Universities can contact us through our partnerships team at partnerships@nextstep.lk. We offer various collaboration models including curriculum integration, student tracking, and career services enhancement."
        },
        {
          question: "Do you provide internship and job opportunities?",
          answer: "Yes! We work with leading tech companies to provide internship and job opportunities exclusively for NextStep users. Opportunities are matched based on your skills and career interests."
        },
        {
          question: "Can employers access student profiles?",
          answer: "Only with explicit student consent. Students can choose to make their profiles visible to potential employers and can control what information is shared through our privacy-first approach."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const itemId = categoryIndex * 1000 + faqIndex;
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              Find quick answers to common questions about NextStep. 
              Can't find what you're looking for? Contact our support team.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {(searchQuery ? filteredFAQs : faqCategories).map((category, categoryIndex) => (
              <div key={category.title} className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 gradient-text">{category.title}</h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemId = categoryIndex * 1000 + faqIndex;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <div key={faq.question} className="border border-border/50 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                        >
                          <span className="font-medium pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {searchQuery && filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any FAQs matching "{searchQuery}". Try different keywords or contact support.
              </p>
              <Button variant="hero">Contact Support</Button>
            </div>
          )}

          {/* Contact Support */}
          <div className="glass-card p-8 rounded-2xl mt-16 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our friendly support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="hero" size="lg">
                Contact Support
              </Button>
              <Button variant="glass" size="lg">
                Join Community Forum
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 rounded-xl text-center">
              <h3 className="font-bold mb-2">Help Center</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse our comprehensive help articles</p>
              <Button variant="outline" size="sm">Visit Help Center</Button>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <h3 className="font-bold mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground mb-4">Watch step-by-step video guides</p>
              <Button variant="outline" size="sm">Watch Tutorials</Button>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <h3 className="font-bold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with other NextStep users</p>
              <Button variant="outline" size="sm">Join Community</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
