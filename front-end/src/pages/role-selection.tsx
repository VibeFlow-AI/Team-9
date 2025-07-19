import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Users, Star } from "lucide-react"

export default function RoleSelection() {
    const [selectedRole, setSelectedRole] = useState<"student" | "mentor" | null>(null)
    const navigate = useNavigate()

    const handleRoleSelect = (role: "student" | "mentor") => {
        setSelectedRole(role)
    }

    const handleContinue = () => {
        if (selectedRole === "student") {
            navigate("/student/onboarding")
        } else if (selectedRole === "mentor") {
            navigate("/mentor/onboarding")
        }
    }

    const getRoleDisplayName = () => {
        if (selectedRole === "student") return "Student"
        if (selectedRole === "mentor") return "Mentor"
        return "..."
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EduVibe
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
                    <p className="text-xl text-gray-600">How would you like to use EduVibe?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card
                        className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                            selectedRole === "student" ? "ring-4 ring-blue-500 shadow-2xl" : ""
                        }`}
                        onClick={() => handleRoleSelect("student")}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <CardTitle className="text-2xl">I'm a Student</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-gray-600 leading-relaxed">
                                Looking to learn from expert mentors and boost your academic performance
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center justify-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>Find perfect mentors</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <BookOpen className="w-4 h-4 text-blue-400" />
                                    <span>Personalized learning</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Users className="w-4 h-4 text-green-400" />
                                    <span>Interactive sessions</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                            selectedRole === "mentor" ? "ring-4 ring-purple-500 shadow-2xl" : ""
                        }`}
                        onClick={() => handleRoleSelect("mentor")}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <CardTitle className="text-2xl">I'm a Mentor</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-gray-600 leading-relaxed">
                                Ready to share your expertise and help students achieve their goals
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center justify-center space-x-2">
                                    <Users className="w-4 h-4 text-purple-400" />
                                    <span>Teach students</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>Build your reputation</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <BookOpen className="w-4 h-4 text-green-400" />
                                    <span>Flexible scheduling</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedRole}
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Continue as {getRoleDisplayName()}
                    </Button>
                </div>
            </div>
        </div>
    )
}
