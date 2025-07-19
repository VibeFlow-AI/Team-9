import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Calendar, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BookedSession {
  id: string
  studentName: string
  studentAge: number
  studentAvatar: string
  subjects: string[]
  date: string
  time: string
  status: "pending" | "confirmed" | "completed"
}

// Mock data for sessions
const mockSessions: BookedSession[] = [
  {
    id: "1",
    studentName: "Maya Chen",
    studentAge: 17,
    studentAvatar: "/placeholder.svg?height=40&width=40",
    subjects: ["Biology", "Genetics"],
    date: "2024-01-25",
    time: "14:00",
    status: "confirmed",
  },
  {
    id: "2",
    studentName: "Alex Johnson",
    studentAge: 16,
    studentAvatar: "/placeholder.svg?height=40&width=40",
    subjects: ["Biology"],
    date: "2024-01-26",
    time: "16:00",
    status: "pending",
  },
  {
    id: "3",
    studentName: "Sarah Williams",
    studentAge: 18,
    studentAvatar: "/placeholder.svg?height=40&width=40",
    subjects: ["Chemistry", "Biology"],
    date: "2024-01-27",
    time: "10:00",
    status: "confirmed",
  },
]

export default function MentorDashboard() {
  const [mentorData, setMentorData] = useState<any>(null)
  const [sessions, setSessions] = useState<BookedSession[]>(mockSessions)
  const navigate = useNavigate()

  useEffect(() => {
    // Load mentor data from localStorage
    const data = localStorage.getItem("mentorData")
    if (data) {
      setMentorData(JSON.parse(data))
    }
  }, [])

  // Prepare data for age distribution pie chart
  const ageGroups = sessions.reduce(
    (acc, session) => {
      const ageGroup = session.studentAge < 16 ? "13-15" : session.studentAge < 18 ? "16-17" : "18+"
      acc[ageGroup] = (acc[ageGroup] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ageData = Object.entries(ageGroups).map(([age, count]) => ({
    name: age,
    value: count,
  }))

  // Prepare data for subject interests bar chart
  const subjectInterests = sessions.reduce(
    (acc, session) => {
      session.subjects.forEach((subject) => {
        acc[subject] = (acc[subject] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const subjectData = Object.entries(subjectInterests).map(([subject, count]) => ({
    subject,
    students: count,
  }))

  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EduVibe
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {mentorData?.fullName || "Mentor"}</span>
              <Button variant="outline" onClick={() => navigate("/")}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mentor Dashboard</h1>
          <p className="text-gray-600">Manage your sessions and track student engagement</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confirmed Sessions</p>
                  <p className="text-2xl font-bold">{sessions.filter((s) => s.status === "confirmed").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold">{sessions.filter((s) => s.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Age Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Student Age Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Interests Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Subject Interest Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booked Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No sessions scheduled</h3>
                  <p className="text-gray-600">Students will book sessions with you soon!</p>
                </div>
              ) : (
                sortedSessions.map((session) => (
                  <Card key={session.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={session.studentAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {session.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">{session.studentName}</h3>
                            <p className="text-sm text-gray-600">Age: {session.studentAge}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {session.subjects.map((subject) => (
                                <Badge key={subject} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Clock className="w-4 h-4" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={session.status === "confirmed" ? "default" : "secondary"}>
                              {session.status}
                            </Badge>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              Start Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
