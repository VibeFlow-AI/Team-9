import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"  
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Users, Star, Clock, ChevronLeft, ChevronRight, Sparkles, Target, Brain, Zap } from "lucide-react"
import { useNavigate } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const benefits = [
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "AI-Powered Matching",
    description:
      "Our intelligent algorithm connects you with the perfect mentor based on your learning style and goals.",
  },
  {
    icon: <Target className="w-8 h-8 text-green-500" />,
    title: "Personalized Learning",
    description: "Tailored sessions designed specifically for your academic level and subject requirements.",
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-500" />,
    title: "Instant Booking",
    description: "Schedule sessions with top mentors in just a few clicks. No waiting, no hassle.",
  },
  {
    icon: <Users className="w-8 h-8 text-orange-500" />,
    title: "Expert Mentors",
    description: "Learn from verified professionals and experienced educators in your field of interest.",
  },
]

const mockSessions = [
  {
    id: 1,
    title: "Advanced Biology - Genetics Deep Dive",
    mentor: "Dr. Sarah Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "2 hours",
    price: "$45",
    rating: 4.9,
    tags: ["Biology", "Genetics", "A-Level"],
    students: 127,
  },
  {
    id: 2,
    title: "Physics Fundamentals - Mechanics",
    mentor: "Prof. Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "2 hours",
    price: "$40",
    rating: 4.8,
    tags: ["Physics", "Mechanics", "O-Level"],
    students: 89,
  },
  {
    id: 3,
    title: "Chemistry Lab Techniques",
    mentor: "Dr. Aisha Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "2 hours",
    price: "$50",
    rating: 5.0,
    tags: ["Chemistry", "Practical", "A-Level"],
    students: 156,
  },
]

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [currentBenefit, setCurrentBenefit] = useState(0)
  const navigate = useNavigate()

  const nextBenefit = () => {
    setCurrentBenefit((prev) => (prev + 1) % benefits.length)
  }

  const prevBenefit = () => {
    setCurrentBenefit((prev) => (prev - 1 + benefits.length) % benefits.length)
  }

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    navigate("/role-selection")
  }

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
                  Transform your academic journey with AI-matched mentors, personalized sessions, and interactive
                  learning experiences designed just for you.
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
            <p className="text-xl text-gray-600">Discover the benefits that make learning extraordinary</p>
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
                  <div className="mb-6 flex justify-center">{benefits[currentBenefit].icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{benefits[currentBenefit].title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefits[currentBenefit].description}</p>
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
              {benefits.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBenefit(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentBenefit ? "bg-blue-500 scale-125" : "bg-gray-300"
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
            <h2 className="text-4xl font-bold mb-4">Featured Learning Sessions</h2>
            <p className="text-xl text-gray-600">Explore our most popular mentor-led sessions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockSessions.map((session) => (
              <Card
                key={session.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={session.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {session.mentor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{session.mentor}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{session.rating}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{session.students} students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{session.price}</span>
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

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Welcome to EduVibe</DialogTitle>
          </DialogHeader>

          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <Button
                onClick={handleAuthSuccess}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Login
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" placeholder="Create a password" />
              </div>
              <Button
                onClick={handleAuthSuccess}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Sign Up
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
