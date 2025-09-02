import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, User, BarChart3, LogOut, GraduationCap, Briefcase, Search, BookOpen, Trophy, Users, Code } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import API from "@/lib/api";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Fetch user's avatar when user is available
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        try {
          const response = await API.get('/Profiles/me');
          if (response.success && response.data) {
            const profileData = response.data as { avatarUrl?: string };
            if (profileData.avatarUrl) {
              setUserAvatar(profileData.avatarUrl);
            }
          }
        } catch (error) {
          // Silently fail - avatar is optional
          console.log('Could not fetch user avatar:', error);
        }
      }
    };

    fetchUserAvatar();

    // Listen for avatar updates from other components
    const handleAvatarUpdate = (event: CustomEvent) => {
      setUserAvatar(event.detail.avatarUrl);
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate as EventListener);

    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate as EventListener);
    };
  }, [user]);

  const smoothScrollTo = (top: number = 0) => {
    // Fallback smooth scrolling for browsers that don't support CSS scroll-behavior
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    } else {
      // Polyfill for older browsers
      const startPosition = window.pageYOffset;
      const distance = top - startPosition;
      const duration = 800;
      let start: number | null = null;

      function step(timestamp: number) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function for smooth animation
        const ease = 0.5 - Math.cos(percentage * Math.PI) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      }
      
      window.requestAnimationFrame(step);
    }
  };

  const handleLogoClick = () => {
    // Enhanced smooth scroll to top
    smoothScrollTo(0);
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    // Handle Dashboard/Home navigation with smooth scroll
    if (item.href === "/" || item.name === "Dashboard") {
      e.preventDefault();
      smoothScrollTo(0);
    }
    // Handle Projects navigation
    else if (item.href === "/projects") {
      e.preventDefault();
      navigate("/projects");
    }
    // For section links (starting with #), let default behavior handle it
    // For other routes, let default navigation handle it
  };

  // Role-based navigation items
  const getNavItems = () => {
    if (!user) {
      return [
        { name: "Career Paths", href: "#careers", icon: BarChart3 },
        { name: "AI Quiz", href: "#quiz", icon: Brain },
        { name: "Learning Plans", href: "#learning", icon: BookOpen },
      ];
    }

    if (user.role === 'student') {
      return [
        { name: "Dashboard", href: "/", icon: BarChart3 },
        { name: "Career Paths", href: "#careers", icon: GraduationCap },
        { name: "AI Quiz", href: "#quiz", icon: Brain },
        { name: "Learning Plans", href: "#learning", icon: BookOpen },
        { name: "Projects", href: "/projects", icon: Code },
        { name: "Leaderboard", href: "#leaderboard", icon: Trophy },
      ];
    } else {
      return [
        { name: "Find Students", href: "/students", icon: Search },
        { name: "Leaderboard", href: "/students", icon: Trophy },
        { name: "Browse Talents", href: "/students", icon: Users },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={handleLogoClick}
            role="button"
            aria-label="Go to top of page"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">NextStep</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-1"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role Badge */}
                <Badge variant={user.role === 'student' ? 'default' : 'secondary'} className="text-xs">
                  {user.role === 'student' ? (
                    <>
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Student
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-3 h-3 mr-1" />
                      Industry Expert
                    </>
                  )}
                </Badge>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userAvatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                          {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex items-center justify-start space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                          {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        {user.profileData?.company && (
                          <p className="text-xs leading-none text-muted-foreground">{user.profileData.company}</p>
                        )}
                        {user.profileData?.university && (
                          <p className="text-xs leading-none text-muted-foreground">{user.profileData.university}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      {user.role === 'student' ? 'My Profile' : 'Company Profile'}
                    </DropdownMenuItem>
                    {user.role === 'industry_expert' && (
                      <DropdownMenuItem onClick={() => navigate("/students")}>
                        <Search className="mr-2 h-4 w-4" />
                        Browse Students
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button variant="hero" onClick={() => navigate("/auth")}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fadeInUp">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2"
                onClick={(e) => {
                  handleNavClick(item, e);
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {user ? (
                <>
                  {/* Mobile Role Badge */}
                  <div className="px-2 py-1">
                    <Badge variant={user.role === 'student' ? 'default' : 'secondary'} className="text-xs">
                      {user.role === 'student' ? (
                        <>
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Student
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3 h-3 mr-1" />
                          Industry Expert
                        </>
                      )}
                    </Badge>
                  </div>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}>
                    <User className="mr-2 h-4 w-4" />
                    {user.role === 'student' ? 'My Profile' : 'Company Profile'}
                  </Button>
                  {user.role === 'industry_expert' && (
                    <Button variant="ghost" className="justify-start" onClick={() => { navigate("/students"); setIsMenuOpen(false); }}>
                      <Search className="mr-2 h-4 w-4" />
                      Browse Students
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}>Sign In</Button>
                  <Button variant="hero" className="justify-start" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;