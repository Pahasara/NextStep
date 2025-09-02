import React from 'react';
import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, User, Mail, Lock, Loader2, GraduationCap, Briefcase } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
    const { user, signIn, signUp, loading } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Login form state
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    // Signup form state  
    const [signupData, setSignupData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        role: "" as UserRole | ""
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error } = await signIn(loginData.email, loginData.password);

        if (error) {
            setError(error.message);
            toast.error("Login failed: " + error.message);
        } else {
            toast.success("Welcome back!");
            // Redirect based on user role will be handled by the useAuth hook
            navigate("/");
        }

        setIsLoading(false);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (signupData.password !== signupData.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        if (!signupData.role) {
            setError("Please select your role");
            setIsLoading(false);
            return;
        }

        const { error } = await signUp(
            signupData.email,
            signupData.password,
            signupData.role as UserRole,
            signupData.fullName
        );

        if (error) {
            setError(error.message);
            toast.error("Signup failed: " + error.message);
        } else {
            toast.success("Account created successfully!");
            navigate("/");
        }

        setIsLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="flex items-center justify-center space-x-2 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">NextStep</span>
                </div>

                <Card className="glass-card border-border/50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                        <CardDescription>
                            Join NextStep to discover your ICT career path
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login" className="space-y-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                className="pl-10"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                        variant="hero"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" className="space-y-4">
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-name"
                                                type="text"
                                                placeholder="John Doe"
                                                className="pl-10"
                                                value={signupData.fullName}
                                                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                className="pl-10"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role-select">I am a</Label>
                                        <Select onValueChange={(value) => setSignupData({ ...signupData, role: value as UserRole })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="student">
                                                    <div className="flex items-center space-x-2">
                                                        <GraduationCap className="w-4 h-4" />
                                                        <span>Student</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="industry_expert">
                                                    <div className="flex items-center space-x-2">
                                                        <Briefcase className="w-4 h-4" />
                                                        <span>Industry Expert / Employer</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Student specific fields */}
                                    {signupData.role === 'student' && (
                                        <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                            <h4 className="font-medium text-sm text-primary">Student Information</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="university">University</Label>
                                                    <Input
                                                        id="university"
                                                        placeholder="University of Colombo"
                                                        value={signupData.university}
                                                        onChange={(e) => setSignupData({ ...signupData, university: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="degree">Degree Program</Label>
                                                    <Input
                                                        id="degree"
                                                        placeholder="Computer Science"
                                                        value={signupData.degree}
                                                        onChange={(e) => setSignupData({ ...signupData, degree: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="year">Year of Study</Label>
                                                    <Select onValueChange={(value) => setSignupData({ ...signupData, yearOfStudy: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select year" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1st Year">1st Year</SelectItem>
                                                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                                                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                                                            <SelectItem value="4th Year">4th Year</SelectItem>
                                                            <SelectItem value="Graduate">Graduate</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Industry expert specific fields */}
                                    {signupData.role === 'industry_expert' && (
                                        <div className="space-y-4 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                                            <h4 className="font-medium text-sm text-secondary">Professional Information</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="company">Company</Label>
                                                    <Input
                                                        id="company"
                                                        placeholder="Tech Solutions Lanka"
                                                        value={signupData.company}
                                                        onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="position">Position</Label>
                                                    <Input
                                                        id="position"
                                                        placeholder="Senior Software Engineer"
                                                        value={signupData.position}
                                                        onChange={(e) => setSignupData({ ...signupData, position: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="industry">Industry</Label>
                                                    <Input
                                                        id="industry"
                                                        placeholder="Information Technology"
                                                        value={signupData.industry}
                                                        onChange={(e) => setSignupData({ ...signupData, industry: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="experience">Experience</Label>
                                                    <Select onValueChange={(value) => setSignupData({ ...signupData, experience: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select experience" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1-2 years">1-2 years</SelectItem>
                                                            <SelectItem value="3-5 years">3-5 years</SelectItem>
                                                            <SelectItem value="5-10 years">5-10 years</SelectItem>
                                                            <SelectItem value="10+ years">10+ years</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={signupData.confirmPassword}
                                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                        variant="hero"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                {signupData.role === 'student' && <GraduationCap className="mr-2 h-4 w-4" />}
                                                {signupData.role === 'industry_expert' && <Briefcase className="mr-2 h-4 w-4" />}
                                                Create {signupData.role === 'student' ? 'Student' : 'Professional'} Account
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Auth;
