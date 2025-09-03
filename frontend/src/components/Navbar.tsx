import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut, GraduationCap, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import API from "@/lib/api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Partners", href: "/partners" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Help", href: "/help" },
  ];

  // Add Dashboard for students and Students for industry experts
  const userSpecificItems = user?.role === 'student' 
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Projects", href: "/projects" }
      ]
    : user?.role === 'industry_expert' 
    ? [{ name: "Students", href: "/students" }]
    : [];

  const allNavItems = [...navItems, ...userSpecificItems];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">NextStep</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {allNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4">
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
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                            {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start space-x-2 p-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={userAvatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                            {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          {user.role === 'student' ? 'My Profile' : 'Company Profile'}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/">
                          <Brain className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
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
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="hero" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="space-y-4">
              {allNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
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
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        {user.role === 'student' ? 'My Profile' : 'Company Profile'}
                      </Button>
                    </Link>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Brain className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
