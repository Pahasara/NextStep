import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CareerPathsSection from "@/components/CareerPathsSection";
import AIQuizSection from "@/components/AIQuizSection";
import LearningSection from "@/components/LearningSection";
import GamificationSection from "@/components/GamificationSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect industry experts to students page upon login
    if (!loading && user && user.role === 'industry_expert') {
      navigate("/students");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CareerPathsSection />
        <AIQuizSection />
        <LearningSection />
        <GamificationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
