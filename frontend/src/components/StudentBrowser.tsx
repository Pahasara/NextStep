import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RealTimeLeaderboard from "@/components/RealTimeLeaderboard";
import StudentRating from "@/components/StudentRating";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/api";
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  Award, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Phone,
  TrendingUp,
  Trophy,
  Calendar,
  BookOpen,
  Code,
  Briefcase,
  Star,
  Eye,
  Users,
  BarChart3,
  RefreshCw,
  Loader2
} from "lucide-react";

// API Response interface that matches backend ProfileResponseDto
interface ApiStudent {
  id: number;
  fullName: string;
  avatarUrl?: string;
  university?: string;
  yearOfStudy?: string;
  major?: string;
  skills: string[];
  careerInterests: string[];
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  points: number;
  level: number;
  streak: number;
  coursesCompleted: number;
  projectsSubmitted: number;
  achievementsEarned: number;
  learningHours: number;
  monthlyGrowthPercentage: number;
  competitionWins: number;
  mentorshipRating: number;
  profileViews: number;
  skillsAcquired: number;
  lastActivityDate?: string;
  bio?: string;
  phoneNumber?: string;
  gpa?: number;
}

// Enhanced interfaces for student data
interface SkillProgress {
  name: string;
  level: number;
  category: 'programming' | 'design' | 'data' | 'management' | 'soft';
  certifications: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'certification' | 'award' | 'project' | 'hackathon' | 'competition';
  issuer: string;
  credentialUrl?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  technologies?: string[];
  githubUrl?: string;
  projectUrl?: string;
  imageUrls?: string[];
  createdAt: string;
  userName: string;
}

interface LearningProgress {
  totalHours: number;
  completedCourses: number;
  inProgressCourses: number;
  skillsAcquired: number;
  projectsCompleted: number;
  certificationsEarned: number;
  monthlyProgress: { month: string; hours: number; }[];
  learningStreak: number;
  lastActiveDate: string;
}

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio: string;
  avatar?: string;
  location: string;
  university: string;
  degree: string;
  yearOfStudy: string;
  careerPath: string;
  gpa?: number;
  skills: SkillProgress[];
  achievements: Achievement[];
  projects: Project[];
  learningProgress: LearningProgress;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  joinedDate: string;
  lastActive: string;
  isAvailableForWork: boolean;
  preferredJobTypes: string[];
  expectedSalary?: string;
  rating: number;
  totalViews: number;
  profileCompleteness: number;
}

const StudentBrowser = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [apiStudents, setApiStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCareerPath, setFilterCareerPath] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProjects, setStudentProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [activeView, setActiveView] = useState<string>("browse");
  const [studentRatings, setStudentRatings] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  // Convert API student data to Student interface
  const convertApiStudentToStudent = (apiStudent: ApiStudent): Student => {
    // Get real projects for this student
    const studentProjects = allProjects.filter(project => 
      project.userName === apiStudent.fullName
    );

    return {
      id: apiStudent.id.toString(),
      fullName: apiStudent.fullName,
      email: `${apiStudent.fullName.toLowerCase().replace(/\s+/g, '.')}@university.lk`,
      phone: apiStudent.phoneNumber,
      bio: apiStudent.bio || `${apiStudent.major || 'Computer Science'} student passionate about technology and innovation.`,
      avatar: apiStudent.avatarUrl,
      location: apiStudent.university ? `${apiStudent.university} Campus` : "Sri Lanka",
      university: apiStudent.university || "University",
      degree: apiStudent.major || "Computer Science",
      yearOfStudy: apiStudent.yearOfStudy || "3rd Year",
      careerPath: apiStudent.careerInterests?.[0] || "Software Development",
      gpa: apiStudent.gpa,
      skills: apiStudent.skills.map(skill => ({
        name: skill,
        level: 0, // Reset to zero for new students
        category: 'programming' as const,
        certifications: []
      })),
      achievements: [], // Empty for new students
      projects: studentProjects, // Use real projects only
      learningProgress: {
        totalHours: 0, // Reset to zero
        completedCourses: 0, // Reset to zero
        inProgressCourses: 0, // Reset to zero
        skillsAcquired: 0, // Reset to zero
        projectsCompleted: studentProjects.length, // Use real project count only
        certificationsEarned: 0, // Reset to zero
        monthlyProgress: Array.from({ length: 6 }, (_, i) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
          hours: 0 // Reset all monthly hours to zero
        })),
        learningStreak: 0, // Reset to zero
        lastActiveDate: apiStudent.lastActivityDate || new Date().toISOString()
      },
      linkedinUrl: apiStudent.linkedinUrl,
      githubUrl: apiStudent.githubUsername ? `https://github.com/${apiStudent.githubUsername}` : undefined,
      portfolioUrl: apiStudent.portfolioUrl,
      resumeUrl: undefined,
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: apiStudent.lastActivityDate || new Date().toISOString(),
      isAvailableForWork: Math.random() > 0.3, // 70% available
      preferredJobTypes: ["Full-time", "Internship", "Part-time"],
      expectedSalary: `LKR ${Math.floor(Math.random() * 50 + 50)},000 - ${Math.floor(Math.random() * 50 + 100)},000`,
      rating: studentRatings[apiStudent.id.toString()] || 0, // Use real rating or 0 if no rating
      totalViews: 0, // Reset to zero for new students
      profileCompleteness: 0 // Reset to zero for new students
    };
  };

  // Fetch ratings for all students
  const fetchStudentRatings = async (studentIds: number[]) => {
    try {
      const ratingsMap: Record<string, number> = {};
      
      // Fetch rating stats for each student
      const ratingPromises = studentIds.map(async (studentId) => {
        try {
          const response = await API.getStudentRatingStats(studentId);
          if (response.success && response.data) {
            ratingsMap[studentId.toString()] = response.data.averageRating || 0;
          } else {
            ratingsMap[studentId.toString()] = 0;
          }
        } catch (error) {
          console.log(`No ratings found for student ${studentId}, defaulting to 0`);
          ratingsMap[studentId.toString()] = 0;
        }
      });

      await Promise.all(ratingPromises);
      setStudentRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching student ratings:', error);
      // If there's an error, set all ratings to 0
      const ratingsMap: Record<string, number> = {};
      studentIds.forEach(id => {
        ratingsMap[id.toString()] = 0;
      });
      setStudentRatings(ratingsMap);
    }
  };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await API.get('/Profiles/students?page=1&pageSize=100');
      
      if (response.success && response.data) {
        const studentProfiles = response.data as ApiStudent[];
        setApiStudents(studentProfiles);
        
        // Fetch ratings for all students
        const studentIds = studentProfiles.map(student => student.id);
        await fetchStudentRatings(studentIds);
        
        toast({
          title: "Students Loaded",
          description: `Loaded ${studentProfiles.length} students from database`,
          variant: "default"
        });
      } else {
        // Show empty state if API returns no data
        setStudents([]);
        setApiStudents([]);
        toast({
          title: "No Students Found",
          description: "No student profiles found in the database",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Show empty state on error
      setStudents([]);
      toast({
        title: "Connection Error",
        description: "Could not connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    // Fetch projects first, then students (so student data can include project counts)
    const loadData = async () => {
      await fetchAllProjects();
      await fetchStudents();
    };
    loadData();
  }, []);

  // Set up automatic refresh for real-time updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // Silently refresh projects every 30 seconds to keep data current
      await fetchAllProjects();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Transform API students to Student objects when both data sources are available
  useEffect(() => {
    if (apiStudents.length > 0 && allProjects.length >= 0) {
      const transformedStudents = apiStudents.map(apiStudent => convertApiStudentToStudent(apiStudent));
      setStudents(transformedStudents);
    }
  }, [apiStudents, allProjects]);

  const fetchAllProjects = async () => {
    try {
      const response = await API.getAllProjects();
      if (response.success && response.data) {
        setAllProjects(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching all projects:', error);
      setAllProjects([]);
    }
  };

  // Convert apiStudents to students whenever data or ratings change
  useEffect(() => {
    if (apiStudents.length > 0) {
      const convertedStudents = apiStudents.map(convertApiStudentToStudent);
      setStudents(convertedStudents);
    }
  }, [apiStudents, studentRatings]);

  // Refresh students data
  const refreshStudents = () => {
    fetchStudents();
  };

  // Refresh all data (students and projects)
  const refreshAllData = async () => {
    await fetchAllProjects();
    await fetchStudents();
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         student.careerPath.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCareerPath = filterCareerPath === "all" || student.careerPath === filterCareerPath;
    const matchesYear = filterYear === "all" || student.yearOfStudy === filterYear;
    const matchesLocation = filterLocation === "all" || student.location.includes(filterLocation);

    return matchesSearch && matchesCareerPath && matchesYear && matchesLocation;
  });

  const fetchStudentProjects = async (studentId: string | number) => {
    try {
      const response = await API.getAllProjects(); // Get all projects first
      if (response.success && response.data) {
        // Filter projects by student (matching userName with student's fullName)
        const student = students.find(s => s.id === String(studentId));
        if (student) {
          const studentProjects = response.data.filter((project: Project) => 
            project.userName === student.fullName
          );
          setStudentProjects(studentProjects);
        }
      }
    } catch (error) {
      console.error('Error fetching student projects:', error);
      setStudentProjects([]);
    }
  };

  const handleStudentSelect = (studentId: string | number) => {
    const student = students.find(s => s.id === String(studentId));
    if (student) {
      setSelectedStudent(student);
      fetchStudentProjects(studentId); // Fetch real projects for this student
    }
  };

  const getSkillColor = (category: string) => {
    switch (category) {
      case 'programming': return 'bg-blue-500';
      case 'design': return 'bg-purple-500';
      case 'data': return 'bg-green-500';
      case 'management': return 'bg-orange-500';
      case 'soft': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'certification': return <Award className="w-4 h-4" />;
      case 'award': return <Trophy className="w-4 h-4" />;
      case 'hackathon': return <Code className="w-4 h-4" />;
      case 'competition': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Student Talent Hub</h1>
            <p className="text-muted-foreground">
              Discover and connect with skilled ICT students ready to contribute to your organization
            </p>
          </div>
          <Button 
            onClick={refreshAllData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh All Data
          </Button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Browse Students</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or career path..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={filterCareerPath} onValueChange={setFilterCareerPath}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Career Path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Career Paths</SelectItem>
                  <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                  <SelectItem value="Data Science & Analytics">Data Science & Analytics</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="DevOps & Cloud">DevOps & Cloud</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Year of Study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Colombo">Colombo</SelectItem>
                  <SelectItem value="Kandy">Kandy</SelectItem>
                  <SelectItem value="Moratuwa">Moratuwa</SelectItem>
                  <SelectItem value="Galle">Galle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveView("leaderboard")}>
              <BarChart3 className="w-4 h-4 mr-1" />
              View Rankings
            </Button>
          </div>

          {/* Student Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="glass-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-muted rounded animate-pulse"></div>
                      <div className="h-8 bg-muted rounded animate-pulse"></div>
                      <div className="h-8 bg-muted rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
          <Card key={student.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={student.avatar} alt={student.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                      {student.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{student.fullName}</CardTitle>
                    <CardDescription className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{student.location}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{student.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Career Path & Year */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {student.yearOfStudy}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {student.careerPath}
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {student.bio}
              </p>

              {/* Top Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill.name} variant="outline" className="text-xs">
                      {skill.name} ({skill.level}%)
                    </Badge>
                  ))}
                  {student.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{student.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">{student.projects.length}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{student.achievements.length}</div>
                  <div className="text-xs text-muted-foreground">Awards</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{student.totalViews}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-2">
                {student.linkedinUrl && (
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                    <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {student.githubUrl && (
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                    <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Profile">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {student.portfolioUrl && (
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                    <a href={student.portfolioUrl} target="_blank" rel="noopener noreferrer" title="Portfolio">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {student.email && (
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                    <a href={`mailto:${student.email}`} title="Send Email">
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedStudent(student)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Student Profile</DialogTitle>
                    </DialogHeader>
                    
                    {selectedStudent && (
                      <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.fullName} />
                            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                              {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                            <p className="text-muted-foreground mb-2">{selectedStudent.careerPath}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{selectedStudent.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{selectedStudent.university}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{selectedStudent.yearOfStudy}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{selectedStudent.rating.toFixed(1)}/5.0</span>
                              </div>
                              <Badge variant={selectedStudent.isAvailableForWork ? "default" : "secondary"}>
                                {selectedStudent.isAvailableForWork ? "Available for Work" : "Not Available"}
                              </Badge>
                              <div className="text-sm text-muted-foreground">
                                Profile {selectedStudent.profileCompleteness}% complete
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact & Social Links */}
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.email && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${selectedStudent.email}`}>
                                <Mail className="w-4 h-4 mr-2" />
                                Email
                              </a>
                            </Button>
                          )}
                          {selectedStudent.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${selectedStudent.phone}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </a>
                            </Button>
                          )}
                          {selectedStudent.linkedinUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          {selectedStudent.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          {selectedStudent.portfolioUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Portfolio
                              </a>
                            </Button>
                          )}
                          {selectedStudent.resumeUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Resume
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* Detailed Tabs */}
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="skills">Skills & Progress</TabsTrigger>
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="ratings">Expert Ratings</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3">About</h3>
                              <p className="text-muted-foreground">{selectedStudent.bio}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Academic Info */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">University:</span>
                                    <span className="font-medium">{selectedStudent.university}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Degree:</span>
                                    <span className="font-medium">{selectedStudent.degree}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Year:</span>
                                    <span className="font-medium">{selectedStudent.yearOfStudy}</span>
                                  </div>
                                  {selectedStudent.gpa && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">GPA:</span>
                                      <span className="font-medium">{selectedStudent.gpa}/4.0</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Work Preferences */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Work Preferences</h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-muted-foreground text-sm">Preferred Job Types:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedStudent.preferredJobTypes.map((type) => (
                                        <Badge key={type} variant="outline" className="text-xs">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {selectedStudent.expectedSalary && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Expected Salary:</span>
                                      <span className="font-medium">{selectedStudent.expectedSalary}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Learning Analytics Summary */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Learning Analytics</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-primary/5 rounded-lg">
                                  <div className="text-2xl font-bold text-primary">{selectedStudent.learningProgress.totalHours}</div>
                                  <div className="text-sm text-muted-foreground">Learning Hours</div>
                                </div>
                                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                                  <div className="text-2xl font-bold text-secondary">{selectedStudent.learningProgress.completedCourses}</div>
                                  <div className="text-sm text-muted-foreground">Courses Completed</div>
                                </div>
                                <div className="text-center p-4 bg-green-500/5 rounded-lg">
                                  <div className="text-2xl font-bold text-green-500">{selectedStudent.learningProgress.projectsCompleted}</div>
                                  <div className="text-sm text-muted-foreground">Projects Done</div>
                                </div>
                                <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-500">{selectedStudent.learningProgress.learningStreak}</div>
                                  <div className="text-sm text-muted-foreground">Day Streak</div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="skills" className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Skills & Proficiency</h3>
                              <div className="space-y-4">
                                {selectedStudent.skills.map((skill) => (
                                  <div key={skill.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${getSkillColor(skill.category)}`}></div>
                                        <span className="font-medium">{skill.name}</span>
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {skill.category}
                                        </Badge>
                                      </div>
                                      <span className="text-sm font-medium">{skill.level}%</span>
                                    </div>
                                    <Progress value={skill.level} className="h-2" />
                                    {skill.certifications.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {skill.certifications.map((cert) => (
                                          <Badge key={cert} variant="secondary" className="text-xs">
                                            <Award className="w-3 h-3 mr-1" />
                                            {cert}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Monthly Progress Chart */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Monthly Learning Progress</h3>
                              <div className="flex items-end space-x-2 h-32">
                                {selectedStudent.learningProgress.monthlyProgress.map((month, index) => (
                                  <div key={month.month} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className="w-full bg-primary rounded-t" 
                                      style={{ 
                                        height: `${(month.hours / Math.max(...selectedStudent.learningProgress.monthlyProgress.map(m => m.hours))) * 100}%`,
                                        minHeight: '20px'
                                      }}
                                    ></div>
                                    <span className="text-xs text-muted-foreground mt-1">{month.month}</span>
                                    <span className="text-xs font-medium">{month.hours}h</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="achievements" className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Achievements & Certifications</h3>
                              <div className="space-y-4">
                                {selectedStudent.achievements.map((achievement) => (
                                  <Card key={achievement.id} className="p-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        {getAchievementIcon(achievement.type)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-semibold">{achievement.title}</h4>
                                          <Badge variant="outline" className="text-xs capitalize">
                                            {achievement.type}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {achievement.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="text-xs text-muted-foreground">
                                            {achievement.issuer} â€¢ {new Date(achievement.date).toLocaleDateString()}
                                          </span>
                                          {achievement.credentialUrl && (
                                            <Button variant="ghost" size="sm" asChild>
                                              <a href={achievement.credentialUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                View
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="projects" className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Projects Portfolio</h3>
                              <div className="grid gap-6">
                                {selectedStudent.projects.map((project) => (
                                  <Card key={project.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                      {project.imageUrls && project.imageUrls[0] && (
                                        <img 
                                          src={project.imageUrls[0]} 
                                          alt={project.title}
                                          className="w-24 h-16 object-cover rounded-lg"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-semibold text-lg">{project.title}</h4>
                                        </div>
                                        {project.description && (
                                          <p className="text-muted-foreground mt-2">
                                            {project.description}
                                          </p>
                                        )}
                                        {project.technologies && project.technologies.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-3">
                                            {project.technologies.map((tech) => (
                                              <Badge key={tech} variant="secondary" className="text-xs">
                                                {tech}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-4 mt-4">
                                          <span className="text-sm text-muted-foreground">
                                            Created: {new Date(project.createdAt).toLocaleDateString()}
                                          </span>
                                          <div className="flex space-x-2">
                                            {project.githubUrl && (
                                              <Button variant="ghost" size="sm" asChild>
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                  <Github className="w-4 h-4 mr-1" />
                                                  Code
                                                </a>
                                              </Button>
                                            )}
                                            {project.projectUrl && (
                                              <Button variant="ghost" size="sm" asChild>
                                                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                                  <ExternalLink className="w-4 h-4 mr-1" />
                                                  Live Demo
                                                </a>
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="ratings" className="space-y-4">
                            <StudentRating 
                              studentId={parseInt(selectedStudent.id)} 
                              studentName={selectedStudent.fullName}
                              isExpertView={true}
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button variant="default" size="sm" className="flex-1">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find more students.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <RealTimeLeaderboard onStudentSelect={handleStudentSelect} showMyRank={false} />
        </TabsContent>
      </Tabs>

      {/* Student Profile Dialog */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.fullName} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                    {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                  <p className="text-muted-foreground mb-2">{selectedStudent.careerPath}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedStudent.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{selectedStudent.university}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedStudent.yearOfStudy}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedStudent.rating.toFixed(1)}/5.0</span>
                    </div>
                    <Badge variant={selectedStudent.isAvailableForWork ? "default" : "secondary"}>
                      {selectedStudent.isAvailableForWork ? "Available for Work" : "Not Available"}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Profile {selectedStudent.profileCompleteness}% complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Social Links */}
              <div className="flex flex-wrap gap-2">
                {selectedStudent.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${selectedStudent.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {selectedStudent.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${selectedStudent.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
                {selectedStudent.linkedinUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {selectedStudent.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {selectedStudent.portfolioUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Portfolio
                    </a>
                  </Button>
                )}
                {selectedStudent.resumeUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Resume
                    </a>
                  </Button>
                )}
              </div>

              {/* Detailed Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Progress</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="ratings">Expert Ratings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground">{selectedStudent.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">University:</span>
                          <span className="font-medium">{selectedStudent.university}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Degree:</span>
                          <span className="font-medium">{selectedStudent.degree}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Year:</span>
                          <span className="font-medium">{selectedStudent.yearOfStudy}</span>
                        </div>
                        {selectedStudent.gpa && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GPA:</span>
                            <span className="font-medium">{selectedStudent.gpa}/4.0</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Work Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Work Preferences</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground text-sm">Preferred Job Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedStudent.preferredJobTypes.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedStudent.expectedSalary && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Salary:</span>
                            <span className="font-medium">{selectedStudent.expectedSalary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Learning Analytics Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Learning Analytics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{selectedStudent.learningProgress.totalHours}</div>
                        <div className="text-sm text-muted-foreground">Learning Hours</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{selectedStudent.learningProgress.completedCourses}</div>
                        <div className="text-sm text-muted-foreground">Courses Completed</div>
                      </div>
                      <div className="text-center p-4 bg-green-500/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{selectedStudent.learningProgress.projectsCompleted}</div>
                        <div className="text-sm text-muted-foreground">Projects Done</div>
                      </div>
                      <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">{selectedStudent.learningProgress.learningStreak}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Skills & Proficiency</h3>
                    <div className="space-y-4">
                      {selectedStudent.skills.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getSkillColor(skill.category)}`}></div>
                              <span className="font-medium">{skill.name}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {skill.category}
                              </Badge>
                            </div>
                            <span className="text-sm font-medium">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                          {skill.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.certifications.map((cert) => (
                                <Badge key={cert} variant="secondary" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Progress Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Learning Progress</h3>
                    <div className="flex items-end space-x-2 h-32">
                      {selectedStudent.learningProgress.monthlyProgress.map((month, index) => (
                        <div key={month.month} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary rounded-t" 
                            style={{ 
                              height: `${(month.hours / Math.max(...selectedStudent.learningProgress.monthlyProgress.map(m => m.hours))) * 100}%`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <span className="text-xs text-muted-foreground mt-1">{month.month}</span>
                          <span className="text-xs font-medium">{month.hours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Achievements & Certifications</h3>
                    <div className="space-y-4">
                      {selectedStudent.achievements.map((achievement) => (
                        <Card key={achievement.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {getAchievementIcon(achievement.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{achievement.title}</h4>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {achievement.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {achievement.issuer} â€¢ {new Date(achievement.date).toLocaleDateString()}
                                </span>
                                {achievement.credentialUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={achievement.credentialUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      View
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Projects Portfolio</h3>
                    <div className="grid gap-6">
                      {selectedStudent.projects.map((project) => (
                        <Card key={project.id} className="p-6">
                          <div className="flex items-start space-x-4">
                            {project.imageUrls && project.imageUrls[0] && (
                              <img 
                                src={project.imageUrls[0]} 
                                alt={project.title}
                                className="w-24 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-lg">{project.title}</h4>
                              </div>
                              {project.description && (
                                <p className="text-muted-foreground mt-2">
                                  {project.description}
                                </p>
                              )}
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {project.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center space-x-4 mt-4">
                                <span className="text-sm text-muted-foreground">
                                  Created: {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                  {project.githubUrl && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-4 h-4 mr-1" />
                                        Code
                                      </a>
                                    </Button>
                                  )}
                                  {project.projectUrl && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        Live Demo
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ratings" className="space-y-4">
                  <StudentRating 
                    studentId={parseInt(selectedStudent.id)}
                    studentName={selectedStudent.fullName}
                    isExpertView={true}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentBrowser;

