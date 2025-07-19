import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BookOpen, Search, Star, Clock, Users, Calendar, Upload } from "lucide-react"
import { useNavigate } from "react-router"
import { useAppContext, useAppActions, useAuth } from "@/contexts"

// Enhanced mock mentor data with 15+ mentors
const mockMentors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Biology", "Genetics", "Molecular Biology"],
    experience: "10+ years",
    rating: 4.9,
    students: 127,
    price: 45,
    languages: ["English"],
    levels: ["A-Level", "University"],
    bio: "Specialized in molecular biology and genetics with extensive research background at Cambridge University.",
    location: "London, UK",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Physics", "Mathematics", "Quantum Mechanics"],
    experience: "8+ years",
    rating: 4.8,
    students: 89,
    price: 40,
    languages: ["English", "Chinese"],
    levels: ["O-Level", "A-Level"],
    bio: "Expert in theoretical physics and advanced mathematics with PhD from MIT.",
    location: "Singapore",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: 3,
    name: "Dr. Aisha Patel",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Chemistry", "Biology", "Biochemistry"],
    experience: "12+ years",
    rating: 5.0,
    students: 156,
    price: 50,
    languages: ["English", "Hindi"],
    levels: ["A-Level", "University"],
    bio: "Renowned chemistry professor with focus on organic chemistry and drug discovery.",
    location: "Mumbai, India",
    availability: ["Monday", "Tuesday", "Wednesday"],
  },
  {
    id: 4,
    name: "Prof. James Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Mathematics", "Statistics", "Calculus"],
    experience: "15+ years",
    rating: 4.7,
    students: 203,
    price: 42,
    languages: ["English", "Spanish"],
    levels: ["O-Level", "A-Level", "University"],
    bio: "Mathematics professor specializing in advanced calculus and statistical analysis.",
    location: "Barcelona, Spain",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: 5,
    name: "Dr. Emily Thompson",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["English Literature", "Creative Writing", "Linguistics"],
    experience: "9+ years",
    rating: 4.9,
    students: 98,
    price: 38,
    languages: ["English"],
    levels: ["O-Level", "A-Level"],
    bio: "English literature expert with published works in contemporary fiction analysis.",
    location: "Toronto, Canada",
    availability: ["Tuesday", "Thursday", "Sunday"],
  },
  {
    id: 6,
    name: "Prof. Ahmed Hassan",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Computer Science", "Programming", "AI/ML"],
    experience: "7+ years",
    rating: 4.8,
    students: 145,
    price: 55,
    languages: ["English", "Arabic"],
    levels: ["A-Level", "University"],
    bio: "Computer science professor specializing in artificial intelligence and machine learning.",
    location: "Cairo, Egypt",
    availability: ["Monday", "Tuesday", "Thursday"],
  },
  {
    id: 7,
    name: "Dr. Lisa Anderson",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Psychology", "Sociology", "Research Methods"],
    experience: "11+ years",
    rating: 4.6,
    students: 87,
    price: 43,
    languages: ["English"],
    levels: ["A-Level", "University"],
    bio: "Clinical psychologist with expertise in cognitive behavioral therapy and research.",
    location: "Sydney, Australia",
    availability: ["Wednesday", "Friday", "Saturday"],
  },
  {
    id: 8,
    name: "Prof. David Kim",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Economics", "Business Studies", "Finance"],
    experience: "13+ years",
    rating: 4.7,
    students: 134,
    price: 48,
    languages: ["English", "Korean"],
    levels: ["A-Level", "University"],
    bio: "Economics professor with Wall Street experience in financial markets analysis.",
    location: "Seoul, South Korea",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: 9,
    name: "Dr. Maria Gonzalez",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["History", "Political Science", "International Relations"],
    experience: "14+ years",
    rating: 4.8,
    students: 112,
    price: 41,
    languages: ["English", "Spanish", "Portuguese"],
    levels: ["O-Level", "A-Level"],
    bio: "History professor specializing in Latin American politics and international relations.",
    location: "Mexico City, Mexico",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: 10,
    name: "Prof. Robert Taylor",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Geography", "Environmental Science", "Climate Studies"],
    experience: "10+ years",
    rating: 4.5,
    students: 76,
    price: 39,
    languages: ["English"],
    levels: ["O-Level", "A-Level"],
    bio: "Environmental scientist with field research experience in climate change studies.",
    location: "Vancouver, Canada",
    availability: ["Monday", "Tuesday", "Friday"],
  },
  {
    id: 11,
    name: "Dr. Priya Sharma",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Physics", "Astronomy", "Astrophysics"],
    experience: "8+ years",
    rating: 4.9,
    students: 91,
    price: 46,
    languages: ["English", "Hindi"],
    levels: ["A-Level", "University"],
    bio: "Astrophysicist with research experience at NASA and expertise in space exploration.",
    location: "Bangalore, India",
    availability: ["Wednesday", "Thursday", "Sunday"],
  },
  {
    id: 12,
    name: "Prof. Jean-Pierre Dubois",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["French", "Literature", "European History"],
    experience: "16+ years",
    rating: 4.7,
    students: 158,
    price: 44,
    languages: ["French", "English"],
    levels: ["O-Level", "A-Level"],
    bio: "French literature professor with expertise in 19th-century European literary movements.",
    location: "Paris, France",
    availability: ["Monday", "Wednesday", "Saturday"],
  },
  {
    id: 13,
    name: "Dr. Rachel Green",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Art History", "Fine Arts", "Design"],
    experience: "9+ years",
    rating: 4.6,
    students: 73,
    price: 37,
    languages: ["English"],
    levels: ["O-Level", "A-Level"],
    bio: "Art historian specializing in Renaissance and contemporary art movements.",
    location: "Florence, Italy",
    availability: ["Tuesday", "Thursday", "Friday"],
  },
  {
    id: 14,
    name: "Prof. Hassan Al-Rashid",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Arabic", "Islamic Studies", "Middle Eastern History"],
    experience: "12+ years",
    rating: 4.8,
    students: 95,
    price: 40,
    languages: ["Arabic", "English"],
    levels: ["O-Level", "A-Level", "University"],
    bio: "Islamic studies scholar with expertise in classical Arabic literature and history.",
    location: "Dubai, UAE",
    availability: ["Sunday", "Monday", "Wednesday"],
  },
  {
    id: 15,
    name: "Dr. Anna Petrov",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Russian", "Slavic Literature", "Eastern European History"],
    experience: "11+ years",
    rating: 4.7,
    students: 67,
    price: 42,
    languages: ["Russian", "English"],
    levels: ["A-Level", "University"],
    bio: "Slavic literature expert with focus on 20th-century Russian and Eastern European writers.",
    location: "Moscow, Russia",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
]

// Add mock booked sessions data
const mockBookedSessions: BookedSession[] = [
  {
    id: "1",
    mentor: mockMentors[0], // Dr. Sarah Wilson
    date: "2024-01-25",
    time: "14:00",
    status: "confirmed",
    paymentSlip: "bank_slip_001.jpg",
  },
  {
    id: "2",
    mentor: mockMentors[2], // Dr. Aisha Patel
    date: "2024-01-27",
    time: "16:00",
    status: "pending",
    paymentSlip: "bank_slip_002.jpg",
  },
  {
    id: "3",
    mentor: mockMentors[5], // Prof. Ahmed Hassan
    date: "2024-01-30",
    time: "10:00",
    status: "confirmed",
    paymentSlip: "bank_slip_003.jpg",
  },
]

interface BookedSession {
  id: string
  mentor: any
  date: string
  time: string
  status: "pending" | "confirmed" | "completed"
  paymentSlip?: string
}

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const { state } = useAppContext()
  const { addBookedSession } = useAppActions()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedExperience, setSelectedExperience] = useState("all")

  // Get data from context instead of localStorage
  const studentData = state.studentData
  const bookedSessions = state.bookedSessions
  const user = state.user

  useEffect(() => {
    // If no student data in context, redirect to onboarding
    if (!studentData) {
      navigate("/student/onboarding")
    }
  }, [studentData, navigate])

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject =
      selectedSubject === "all" ||
      mentor.subjects.some((subject) => subject.toLowerCase().includes(selectedSubject.toLowerCase()))

    const matchesPriceRange =
      selectedPriceRange === "all" ||
      (selectedPriceRange === "low" && mentor.price <= 40) ||
      (selectedPriceRange === "medium" && mentor.price > 40 && mentor.price <= 45) ||
      (selectedPriceRange === "high" && mentor.price > 45)

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4+" && mentor.rating >= 4.0) ||
      (selectedRating === "4.5+" && mentor.rating >= 4.5) ||
      (selectedRating === "4.8+" && mentor.rating >= 4.8)

    const matchesExperience =
      selectedExperience === "all" ||
      (selectedExperience === "5+" && mentor.experience.includes("5+")) ||
      (selectedExperience === "10+" &&
        (mentor.experience.includes("10+") ||
          mentor.experience.includes("11+") ||
          mentor.experience.includes("12+") ||
          mentor.experience.includes("13+") ||
          mentor.experience.includes("14+") ||
          mentor.experience.includes("15+") ||
          mentor.experience.includes("16+")))

    return matchesSearch && matchesSubject && matchesPriceRange && matchesRating && matchesExperience
  })

  // AI-powered mentor matching based on student interests
  const getRecommendedMentors = () => {
    if (!studentData?.subjectsOfInterest) return mockMentors

    const studentSubjects = studentData.subjectsOfInterest.split(",").map((s: string) => s.trim().toLowerCase())

    return mockMentors
      .map((mentor) => ({
        ...mentor,
        matchScore: mentor.subjects.reduce((score, subject) => {
          return score + (studentSubjects.includes(subject.toLowerCase()) ? 1 : 0)
        }, 0),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const handleBookSession = (mentor: any) => {
    setSelectedMentor(mentor)
    setShowBookingModal(true)
  }

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setShowBookingModal(false)
      setShowPaymentModal(true)
    }
  }

  const handlePaymentSubmit = () => {
    const newSession: BookedSession = {
      id: Date.now().toString(),
      mentor: selectedMentor,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
    }

    // Add to context instead of local state
    addBookedSession(newSession)

    setShowPaymentModal(false)
    setSelectedMentor(null)
    setSelectedDate("")
    setSelectedTime("")
  }

  const renderMentorCard = (mentor: any) => (
    <Card key={mentor.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {mentor.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{mentor.bio}</p>
            <p className="text-xs text-gray-500 mb-2">📍 {mentor.location}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{mentor.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{mentor.students} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{mentor.experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Subjects</p>
            <div className="flex flex-wrap gap-2">
              {mentor.subjects.map((subject: string) => (
                <Badge key={subject} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Languages</p>
            <div className="flex flex-wrap gap-2">
              {mentor.languages.map((lang: string) => (
                <Badge key={lang} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Teaching Levels</p>
            <div className="flex flex-wrap gap-2">
              {mentor.levels.map((level: string) => (
                <Badge key={level} variant="outline" className="text-xs">
                  {level}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Available Days</p>
            <div className="flex flex-wrap gap-1">
              {mentor.availability.map((day: string) => (
                <Badge key={day} variant="secondary" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">${mentor.price}/session</div>
          <Button
            onClick={() => handleBookSession(mentor)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduVibe
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {studentData?.fullName || "Student"}</span>
              <Button variant="outline" onClick={() => navigate("/")}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Discover mentors and manage your learning sessions</p>
        </div>

        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="explore">Explore Mentors</TabsTrigger>
            <TabsTrigger value="sessions">Booked Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {/* Enhanced Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search mentors, subjects, or locations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="low">$35-40</SelectItem>
                        <SelectItem value="medium">$41-45</SelectItem>
                        <SelectItem value="high">$46+</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Minimum Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4+">4.0+ Stars</SelectItem>
                        <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                        <SelectItem value="4.8+">4.8+ Stars</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Experience</SelectItem>
                        <SelectItem value="5+">5+ Years</SelectItem>
                        <SelectItem value="10+">10+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      Showing {filteredMentors.length} of {mockMentors.length} mentors
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedSubject("all")
                        setSelectedPriceRange("all")
                        setSelectedRating("all")
                        setSelectedExperience("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Mentors */}
            {studentData?.subjectsOfInterest && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {getRecommendedMentors().slice(0, 3).map(renderMentorCard)}
                </div>
              </div>
            )}

            {/* All Mentors */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Mentors</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredMentors.map(renderMentorCard)}</div>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Booked Sessions</h2>
              {bookedSessions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No sessions booked yet</h3>
                    <p className="text-gray-600 mb-4">Start exploring mentors to book your first session</p>
                    <Button onClick={() => (document.querySelector('[value="explore"]') as HTMLElement | null)?.click()}>
                      Explore Mentors
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {bookedSessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={session.mentor.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {session.mentor.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{session.mentor.name}</h3>
                            <p className="text-gray-600">{session.mentor.subjects.join(", ")}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{session.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{session.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={session.status === "confirmed" ? "default" : "secondary"} className="mb-2">
                              {session.status}
                            </Badge>
                            <div className="text-2xl font-bold text-blue-600">${session.mentor.price}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Session with {selectedMentor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Session Details:</p>
              <p className="font-semibold">Duration: 2 hours (fixed)</p>
              <p className="font-semibold">Price: ${selectedMentor?.price}</p>
            </div>
            <Button
              onClick={handleDateTimeSelect}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Continue to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Session Summary</h3>
              <p>Mentor: {selectedMentor?.name}</p>
              <p>Date: {selectedDate}</p>
              <p>Time: {selectedTime}</p>
              <p>Duration: 2 hours</p>
              <p className="text-xl font-bold text-blue-600 mt-2">Total: ${selectedMentor?.price}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankSlip">Upload Bank Slip</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload your bank slip</p>
                <Input type="file" accept="image/*" className="hidden" />
                <Button variant="outline">Choose File</Button>
              </div>
            </div>
            <Button
              onClick={handlePaymentSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
