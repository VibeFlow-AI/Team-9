"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Brain,
  Zap,
  CheckCircle,
  TrendingUp,
  Award,
  Shield,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts";

const features = [
  {
    id: 1,
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Matching",
    description: "Smart algorithm finds your perfect mentor match",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    icon: <Target className="w-6 h-6" />,
    title: "Personalized Learning",
    description: "Tailored sessions for your specific needs",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Booking",
    description: "Schedule sessions in just a few clicks",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    icon: <Shield className="w-6 h-6" />,
    title: "Verified Mentors",
    description: "All mentors are professionally verified",
    gradient: "from-orange-500 to-red-500",
  },
];

const stats = [
  { number: "50K+", label: "Active Students", icon: <Users className="w-5 h-5" /> },
  { number: "2K+", label: "Expert Mentors", icon: <Award className="w-5 h-5" /> },
  { number: "100K+", label: "Sessions Completed", icon: <CheckCircle className="w-5 h-5" /> },
  { number: "98%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
];

const mentorHighlights = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    subject: "Advanced Biology",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    students: 234,
    price: 45,
    badge: "Top Rated",
    specialty: "Genetics & Molecular Biology",
  },
  {
    id: 2,
    name: "Prof. Michael Rodriguez",
    subject: "Physics & Mathematics",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    students: 189,
    price: 42,
    badge: "Most Popular",
    specialty: "Quantum Physics & Calculus",
  },
  {
    id: 3,
    name: "Dr. Aisha Patel",
    subject: "Chemistry",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5.0,
    students: 156,
    price: 48,
    badge: "Expert",
    specialty: "Organic Chemistry",
  },
];

const testimonials = [
  {
    name: "Maya Johnson",
    role: "A-Level Student",
    content: "EduVibe transformed my understanding of biology. My grades improved from C to A* in just 4 months!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    improvement: "+2 Grades",
  },
  {
    name: "Alex Chen",
    role: "University Student",
    content:
      "The AI matching system is incredible. Found the perfect physics mentor who understood exactly what I needed.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    improvement: "40% Better",
  },
  {
    name: "Sarah Williams",
    role: "O-Level Student",
    content: "Amazing platform! The mentors are patient, knowledgeable, and the booking system is so easy to use.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    improvement: "Top 10%",
  },
];

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, loginWithGitHub, isLoading, error } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextBenefit = () => {
    setCurrentBenefit((prev) => (prev + 1) % features.length);
  };

  const prevBenefit = () => {
    setCurrentBenefit((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setLoginForm({ email: "", password: "" });
    setSignupForm({ name: "", email: "", password: "" });
    navigate("/role-selection");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(loginForm.email, loginForm.password);
      handleAuthSuccess();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(signupForm.email, signupForm.password, signupForm.name, "student");
      handleAuthSuccess();
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      handleAuthSuccess();
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await loginWithGitHub();
      handleAuthSuccess();
    } catch (err) {
      console.error("GitHub login error:", err);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduVibe
              </span>
            </div>
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Learning Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Connect with
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Expert Mentors
                  </span>
                  for Personalized Learning
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your academic journey with AI-matched mentors,
                  personalized sessions, and interactive learning experiences
                  designed just for you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Learning Today
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 rounded-full text-lg transition-all duration-300 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/placeholder.svg?height=300&width=250"
                  alt="Student 1"
                  className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300"
                />
                <img
                  src="/placeholder.svg?height=300&width=250"
                  alt="Mentor"
                  className="rounded-2xl shadow-2xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300 mt-8"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EduVibe?</h2>
            <p className="text-xl text-gray-600">
              Discover the benefits that make learning extraordinary
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={prevBenefit}
                className="absolute left-0 z-10 rounded-full shadow-lg bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Card className="max-w-md mx-auto transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    {features[currentBenefit].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {features[currentBenefit].title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {features[currentBenefit].description}
                  </p>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                size="icon"
                onClick={nextBenefit}
                className="absolute right-0 z-10 rounded-full shadow-lg bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {features.map((feature, index) => (
                <button
                  key={`feature-${feature.title}-${index}`}
                  onClick={() => setCurrentBenefit(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentBenefit
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Session Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Featured Learning Sessions
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most popular mentor-led sessions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorHighlights.map((mentor) => (
              <Card
                key={mentor.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{mentor.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {mentor.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {mentor.subject}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {mentor.badge}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {mentor.specialty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Expert Level</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{mentor.students} students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${mentor.price}/hr
                    </span>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Success stories from students who transformed their learning journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={`star-${testimonials[currentTestimonial].name}-${i}`} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={testimonials[currentTestimonial].avatar} />
                      <AvatarFallback>
                        {testimonials[currentTestimonial].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-lg">{testimonials[currentTestimonial].name}</p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {testimonials[currentTestimonial].improvement}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={`testimonial-${testimonial.name}-${index}`}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome to EduVibe
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Tabs
            value={authMode}
            onValueChange={(value) => {
              setAuthMode(value as "login" | "signup");
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={handleLoginInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={handleLoginInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={isLoading || !loginForm.email || !loginForm.password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <Button
                  onClick={handleGitHubLogin}
                  variant="outline"
                  className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  Continue with GitHub
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {/* Email Signup Form */}
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    placeholder="Enter your full name"
                    value={signupForm.name}
                    onChange={handleSignupInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={handleSignupInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={handleSignupInputChange}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>

                {/* Terms and Privacy */}
                <p className="text-xs text-gray-600 text-center">
                  By signing up, you agree to our{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline underline-offset-2"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                </p>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={isLoading || !signupForm.name || !signupForm.email || !signupForm.password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or create account with
                  </span>
                </div>
              </div>

              {/* Social Signup Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Sign up with Google
                </Button>

                <Button
                  onClick={handleGitHubLogin}
                  variant="outline"
                  className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  Sign up with GitHub
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
