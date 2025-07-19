"use client"

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

// Mock mentor data
const mockMentors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Biology", "Genetics"],
    experience: "10+ years",
    rating: 4.9,
    students: 127,
    price: 45,
    languages: ["English"],
    levels: ["A-Level", "University"],
    bio: "Specialized in molecular biology and genetics with extensive research background.",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Physics", "Mathematics"],
    experience: "8+ years",
    rating: 4.8,
    students: 89,
    price: 40,
    languages: ["English", "Chinese"],
    levels: ["O-Level", "A-Level"],
    bio: "Expert in theoretical physics and advanced mathematics.",
  },
  {
    id: 3,
    name: "Dr. Aisha Patel",
    avatar: "/placeholder.svg?height=60&width=60",
    subjects: ["Chemistry", "Biology"],
    experience: "12+ years",
    rating: 5.0,
    students: 156,
    price: 50,
    languages: ["English", "Hindi"],
    levels: ["A-Level", "University"],
    bio: "Renowned chemistry professor with focus on organic chemistry.",
  },
  // Add more mock mentors...
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
  const [selectedDuration, setSelectedDuration] = useState("")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([])
  const [studentData, setStudentData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load student data from localStorage
    const data = localStorage.getItem("studentData")
    if (data) {
      setStudentData(JSON.parse(data))
    }

    // Load booked sessions
    const sessions = localStorage.getItem("bookedSessions")
    if (sessions) {
      setBookedSessions(JSON.parse(sessions))
    }
  }, [])

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = !selectedSubject || mentor.subjects.includes(selectedSubject)
    return matchesSearch && matchesSubject
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

    const updatedSessions = [...bookedSessions, newSession]
    setBookedSessions(updatedSessions)
    localStorage.setItem("bookedSessions", JSON.stringify(updatedSessions))

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
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{mentor.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{mentor.students} students</span>
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
            <div className="flex items-center space-x-2">
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
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search mentors or subjects..."
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
                    </SelectContent>
                  </Select>
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
                    <Button onClick={() => (document.querySelector('[value="explore"]') as HTMLButtonElement | null)?.click()}>
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
