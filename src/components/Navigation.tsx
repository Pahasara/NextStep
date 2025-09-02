import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
}

const Navigation = ({ title, showBack = true, showHome = true }: NavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        {showBack && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        )}
        {showHome && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Button>
        )}
      </div>
      {title && <h1 className="text-2xl font-bold gradient-text">{title}</h1>}
    </div>
  );
};

export default Navigation;