"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { BookOpen, User, GraduationCap, Target } from "lucide-react"
import { useNavigate } from "react-router"
import { useAppActions, type StudentData as StudentContextData } from "@/contexts"

interface LocalStudentData {
  // Part 1: Basic Information
  fullName: string
  age: string
  email: string
  contactNumber: string

  // Part 2: Academic Background
  educationLevel: string
  school: string

  // Part 3: Subject & Skill Assessment
  subjectsOfInterest: string
  currentYear: string
  skillLevels: Record<string, string>
  learningStyle: string[]
  hasLearningDisabilities: boolean
  learningDisabilitiesDescription: string
}

export default function StudentOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const { setStudentData: saveStudentData } = useAppActions()
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState<LocalStudentData>({
    fullName: "",
    age: "",
    email: "",
    contactNumber: "",
    educationLevel: "",
    school: "",
    subjectsOfInterest: "",
    currentYear: "",
    skillLevels: {},
    learningStyle: [],
    hasLearningDisabilities: false,
    learningDisabilitiesDescription: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const subjects = studentData.subjectsOfInterest
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s)

  const handleInputChange = (field: keyof LocalStudentData, value: any) => {
    setStudentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillLevelChange = (subject: string, level: string) => {
    setStudentData((prev) => ({
      ...prev,
      skillLevels: { ...prev.skillLevels, [subject]: level },
    }))
  }

  const handleLearningStyleChange = (style: string, checked: boolean) => {
    setStudentData((prev) => ({
      ...prev,
      learningStyle: checked ? [...prev.learningStyle, style] : prev.learningStyle.filter((s) => s !== style),
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
    // Convert local data to context format
    const contextData: StudentContextData = {
      fullName: studentData.fullName,
      email: studentData.email,
      grade: studentData.educationLevel,
      subjectsOfInterest: studentData.subjectsOfInterest,
      learningGoals: "", // This would need to be added to the form or derived
      availability: [], // This would need to be added to the form
      learningStyle: studentData.learningStyle.join(", ")
    }
    
    // Save to context
    saveStudentData(contextData)
    navigate("/student/dashboard")
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Who Are You?</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={studentData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={studentData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="Enter your age"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={studentData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={studentData.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            placeholder="Enter your contact number"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Academic Background</h2>
        <p className="text-gray-600">Tell us about your current education</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="educationLevel">Current Education Level *</Label>
          <Select
            value={studentData.educationLevel}
            onValueChange={(value) => handleInputChange("educationLevel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade-9">Grade 9</SelectItem>
              <SelectItem value="ordinary-level">Ordinary Level</SelectItem>
              <SelectItem value="advanced-level">Advanced Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">School *</Label>
          <Input
            id="school"
            value={studentData.school}
            onChange={(e) => handleInputChange("school", e.target.value)}
            placeholder="Enter your school name"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Subject & Skill Assessment</h2>
        <p className="text-gray-600">Help us understand your learning needs</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="subjectsOfInterest">Subjects of Interest *</Label>
          <Input
            id="subjectsOfInterest"
            value={studentData.subjectsOfInterest}
            onChange={(e) => handleInputChange("subjectsOfInterest", e.target.value)}
            placeholder="e.g., Biology, Physics, Chemistry (comma separated)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentYear">Current Year *</Label>
          <Input
            id="currentYear"
            type="number"
            value={studentData.currentYear}
            onChange={(e) => handleInputChange("currentYear", e.target.value)}
            placeholder="Enter your current academic year"
          />
        </div>

        {subjects.length > 0 && (
          <div className="space-y-4">
            <Label>Current Skill Level (Per Subject)</Label>
            {subjects.map((subject) => (
              <div key={subject} className="p-4 border rounded-lg">
                <Label className="text-sm font-medium mb-3 block">{subject}</Label>
                <RadioGroup
                  value={studentData.skillLevels[subject] || ""}
                  onValueChange={(value) => handleSkillLevelChange(subject, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id={`${subject}-beginner`} />
                    <Label htmlFor={`${subject}-beginner`}>Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id={`${subject}-intermediate`} />
                    <Label htmlFor={`${subject}-intermediate`}>Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id={`${subject}-advanced`} />
                    <Label htmlFor={`${subject}-advanced`}>Advanced</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <Label>Preferred Learning Style</Label>
          <div className="grid grid-cols-2 gap-4">
            {["Visual", "Hands-On", "Theoretical", "Mixed"].map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={style}
                  checked={studentData.learningStyle.includes(style)}
                  onCheckedChange={(checked) => handleLearningStyleChange(style, checked as boolean)}
                />
                <Label htmlFor={style}>{style}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="learningDisabilities"
              checked={studentData.hasLearningDisabilities}
              onCheckedChange={(checked) => handleInputChange("hasLearningDisabilities", checked)}
            />
            <Label htmlFor="learningDisabilities">
              Do you have any learning disabilities or accommodations needed?
            </Label>
          </div>
          {studentData.hasLearningDisabilities && (
            <Textarea
              value={studentData.learningDisabilitiesDescription}
              onChange={(e) => handleInputChange("learningDisabilitiesDescription", e.target.value)}
              placeholder="Please describe your learning disabilities or accommodations needed"
            />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduVibe
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Student Onboarding</h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
          <Progress value={progress} className="mt-4" />
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center">Complete Your Profile</CardTitle>
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
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
