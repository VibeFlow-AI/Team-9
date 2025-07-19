"use client"

import { useState } from "react";
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
  Loader2,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts";

const mentorHighlights = [
  {
    id: 1,
    name: "Rahul Lavan",
    subject: "Science",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    students: 234,
    price: 45,
    badge: "Science",
    specialty: "Physics",
    subjects: ["Science", "Physics", "Biology"],
    duration: "30 mins - 1 hour",
    languages: ["English", "Tamil"],
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled"
  },
  {
    id: 2,
    name: "Chathum Rahal",
    subject: "Mathematics",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    students: 189,
    price: 42,
    badge: "Mathematics",
    specialty: "History",
    subjects: ["Mathematics", "History", "English"],
    duration: "1 hour",
    languages: ["English"],
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled"
  },
  {
    id: 3,
    name: "Malsha Fernando",
    subject: "Chemistry",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5.0,
    students: 156,
    price: 48,
    badge: "Chemistry",
    specialty: "Art",
    subjects: ["Chemistry", "Art", "Commerce"],
    duration: "1 hour",
    languages: ["Sinhala"],
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled"
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
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const { login, signup, isLoading, error } = useAuth();

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const getAvatarBgClass = (mentorName: string) => {
    if (mentorName === "Rahul Lavan") return "bg-blue-100";
    if (mentorName === "Chathum Rahal") return "bg-orange-100";
    return "bg-purple-100";
  };

  const getAvatarTextClass = (mentorName: string) => {
    if (mentorName === "Rahul Lavan") return "text-blue-600";
    if (mentorName === "Chathum Rahal") return "text-orange-600";
    return "text-purple-600";
  };

  const getBadgeClass = (index: number) => {
    if (index === 0) return "bg-blue-100 text-blue-800";
    if (index === 1) return "bg-green-100 text-green-800";
    return "bg-purple-100 text-purple-800";
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setLoginForm({ email: "", password: "" });
    setSignupForm({ email: "", password: "" });
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
      await signup(signupForm.email, signupForm.password);
      handleAuthSuccess();
    } catch (err) {
      console.error("Signup error:", err);
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
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <header className="bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1d1d1b] rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button className="text-[#1d1d1b] hover:text-[#6a4dff] transition-colors">
              Home
            </button>
            <button className="text-[#1d1d1b] hover:text-[#6a4dff] transition-colors">
              Sessions
            </button>
            <button className="text-[#1d1d1b] hover:text-[#6a4dff] transition-colors">
              About
            </button>
          </nav>

          <Button 
            onClick={handleGetStarted}
            className="bg-[#1d1d1b] hover:bg-[#434343] text-white px-6"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1d1d1b] leading-tight">
              Empowering Students with Personalized Mentorship 📚
            </h1>

            <p className="text-lg text-[#434343] max-w-md">
              EduVibe connects students with experienced mentors to guide them through their academic
            </p>

            <Button 
              onClick={handleGetStarted}
              className="bg-[#1d1d1b] hover:bg-[#434343] text-white px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </div>

          {/* Photo Collage */}
          <div className="relative h-96 lg:h-[500px]">
            <div className="absolute top-0 right-12 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=96&width=96"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-16 left-8 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=128&width=128"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-32 right-0 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=112&width=112"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-32 left-0 w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=144&width=144"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-16 right-8 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=128&width=128"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-20 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=96&width=96"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-8 left-16 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's in it for Students Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-[#f4f4f4] to-[#d9ff00]/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1d1d1b] mb-6">What's in it for Students?</h2>

          <p className="text-lg text-[#434343] max-w-2xl mx-auto mb-12">
            EduVibe is a student-mentor platform designed to personalize learning journeys. It connects students with
            mentors who offer guidance, support, and practical industry insights.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                <img
                  src="/placeholder.svg?height=192&width=300"
                  alt="Personalized Learning"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#1d1d1b] mb-3">Personalized Learning</h3>
                <p className="text-[#434343] text-sm">
                  We tailor the mentorship experience to fit each student's unique goals, learning style, and pace
                  making every session impactful.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200">
                <img
                  src="/placeholder.svg?height=192&width=300"
                  alt="Real Mentors"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#1d1d1b] mb-3">Real Mentors, Real Guidance</h3>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200">
                <img
                  src="/placeholder.svg?height=192&width=300"
                  alt="Growth & Career"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#1d1d1b] mb-3">Growth & Career Readiness</h3>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                  src="/placeholder.svg?height=192&width=300"
                  alt="Insights-Driven Support"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#1d1d1b] mb-3">Insights-Driven Support</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Session Highlights Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-[#d9ff00]/20 to-purple-100/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1d1d1b] mb-6">Session Highlights – Trending Now</h2>

          <p className="text-lg text-[#434343] max-w-3xl mx-auto mb-12">
            Join the sessions students are raving about. These expert-led, high-impact sessions are designed to help you
            unlock your full potential whether you're polishing your resume, mapping out your career path, or getting
            ready to ace technical interviews.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {mentorHighlights.map((mentor) => (
              <Card key={mentor.id} className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarBgClass(mentor.name)}`}>
                      <span className={`font-bold text-lg ${getAvatarTextClass(mentor.name)}`}>
                        {mentor.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-[#1d1d1b]">{mentor.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.subjects.map((subject, index) => (
                      <Badge 
                        key={`${mentor.id}-subject-${index}`}
                        variant="secondary" 
                        className={getBadgeClass(index)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-[#434343] mb-4 text-left">
                    {mentor.description}
                  </p>

                  <div className="text-left text-xs text-[#8f8f8f] mb-4">
                    <p>
                      <strong>Duration:</strong> {mentor.duration}
                    </p>
                    <p>
                      <strong>Preferred Language:</strong> {mentor.languages.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button className="bg-[#1d1d1b] hover:bg-[#434343] text-white flex-1 mr-2">Book a session</Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            className="border-[#1d1d1b] text-[#1d1d1b] hover:bg-[#1d1d1b] hover:text-white px-8 bg-transparent"
          >
            Load More Sessions
          </Button>
        </div>
      </section>

      {/* Auth Modal - Keep existing auth modal unchanged */}
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
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {/* Email Signup Form */}
              <form onSubmit={handleEmailSignup} className="space-y-4">
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
                  disabled={isLoading || !signupForm.email || !signupForm.password}
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
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
