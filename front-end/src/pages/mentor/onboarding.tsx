"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { BookOpen, User, GraduationCap, Link } from "lucide-react"
import { useNavigate } from "react-router"

interface MentorData {
  // Part 1: Personal Information
  fullName: string
  age: string
  email: string
  contactNumber: string
  preferredLanguage: string
  currentLocation: string
  shortBio: string
  professionalRole: string

  // Part 2: Areas of Expertise
  subjects: string[]
  experience: string
  preferredLevels: string[]

  // Part 3: Social & Professional Links
  linkedinProfile: string
  portfolioUrl: string
  profilePicture: string
}

export default function MentorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [mentorData, setMentorData] = useState<MentorData>({
    fullName: "",
    age: "",
    email: "",
    contactNumber: "",
    preferredLanguage: "",
    currentLocation: "",
    shortBio: "",
    professionalRole: "",
    subjects: [],
    experience: "",
    preferredLevels: [],
    linkedinProfile: "",
    portfolioUrl: "",
    profilePicture: "",
  })

  const navigate = useNavigate()
  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof MentorData, value: any) => {
    setMentorData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setMentorData((prev) => ({
      ...prev,
      subjects: checked ? [...prev.subjects, subject] : prev.subjects.filter((s) => s !== subject),
    }))
  }

  const handleLevelChange = (level: string, checked: boolean) => {
    setMentorData((prev) => ({
      ...prev,
      preferredLevels: checked ? [...prev.preferredLevels, level] : prev.preferredLevels.filter((l) => l !== level),
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Save mentor data and redirect to dashboard
    localStorage.setItem("mentorData", JSON.stringify(mentorData))
    localStorage.setItem("userRole", "mentor")
    navigate("/mentor/dashboard")
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={mentorData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={mentorData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="Enter your age"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={mentorData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={mentorData.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            placeholder="Enter your contact number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredLanguage">Preferred Language *</Label>
          <Select
            value={mentorData.preferredLanguage}
            onValueChange={(value) => handleInputChange("preferredLanguage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="sinhala">Sinhala</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentLocation">Current Location *</Label>
          <Input
            id="currentLocation"
            value={mentorData.currentLocation}
            onChange={(e) => handleInputChange("currentLocation", e.target.value)}
            placeholder="Enter your current location"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortBio">Short Bio *</Label>
        <Textarea
          id="shortBio"
          value={mentorData.shortBio}
          onChange={(e) => handleInputChange("shortBio", e.target.value)}
          placeholder="Introduce yourself in 2-3 sentences"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalRole">Professional Role *</Label>
        <Input
          id="professionalRole"
          value={mentorData.professionalRole}
          onChange={(e) => handleInputChange("professionalRole", e.target.value)}
          placeholder="e.g., University Professor, Research Scientist"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Areas of Expertise</h2>
        <p className="text-gray-600">Share your teaching expertise</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Subjects you are planning to teach *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Biology",
              "Physics",
              "Chemistry",
              "Mathematics",
              "English",
              "History",
              "Geography",
              "Economics",
              "Computer Science",
            ].map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={mentorData.subjects.includes(subject)}
                  onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                />
                <Label htmlFor={subject}>{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Teaching/Training Experience *</Label>
          <Select value={mentorData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5+">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Preferred Level of Students *</Label>
          <div className="grid grid-cols-2 gap-4">
            {["Grade 3-5", "Grade 6-9", "Grade 10-11", "Advanced Level"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={mentorData.preferredLevels.includes(level)}
                  onCheckedChange={(checked) => handleLevelChange(level, checked as boolean)}
                />
                <Label htmlFor={level}>{level}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Link className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Social & Professional Links</h2>
        <p className="text-gray-600">Help students learn more about you</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="linkedinProfile">LinkedIn Profile *</Label>
          <Input
            id="linkedinProfile"
            type="url"
            value={mentorData.linkedinProfile}
            onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">GitHub or Portfolio (Optional)</Label>
          <Input
            id="portfolioUrl"
            type="url"
            value={mentorData.portfolioUrl}
            onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
            placeholder="https://github.com/yourusername or your portfolio URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profilePicture">Upload Profile Picture</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">Click to upload your profile picture</p>
            <Input type="file" accept="image/*" className="hidden" />
            <Button variant="outline">Choose File</Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EduVibe
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Mentor Onboarding</h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
          <Progress value={progress} className="mt-4" />
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center">Complete Your Mentor Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="px-8 bg-transparent">
                Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 px-8"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8"
                >
                  Complete Onboarding
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
