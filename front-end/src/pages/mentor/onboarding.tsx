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
import axios from "axios"

// Add enums to match Prisma schema exactly
enum Language {
  ENGLISH = "ENGLISH",
  SINHALA = "SINHALA",
  TAMIL = "TAMIL",
  OTHER = "OTHER"
}

enum Experience {
  NONE = "NONE",
  ONE_TO_THREE_YEARS = "ONE_TO_THREE_YEARS",
  THREE_TO_FIVE_YEARS = "THREE_TO_FIVE_YEARS",
  FIVE_PLUS_YEARS = "FIVE_PLUS_YEARS"
}

enum EducationLevel {
  GRADE_9 = "GRADE_9",
  ORDINARY_LEVEL = "ORDINARY_LEVEL",
  ADVANCED_LEVEL = "ADVANCED_LEVEL",
  UNIVERSITY = "UNIVERSITY"
}

interface MentorData {
  // Part 1: Personal Information
  age: string
  contactNumber: string
  preferredLanguage: string
  currentLocation: string
  shortBio: string
  professionalRole: string

  // Part 2: Areas of Expertise
  subjectsToTeach: string[]
  teachingExperience: string
  preferredStudentLevels: string[]

  // Part 3: Social & Professional Links
  linkedinProfile: string
  githubPortfolio: string
  profilePictureUrl: string
}

export default function MentorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [mentorData, setMentorData] = useState<MentorData>({
    age: "",
    contactNumber: "",
    preferredLanguage: "",
    currentLocation: "",
    shortBio: "",
    professionalRole: "",
    subjectsToTeach: [],
    teachingExperience: "",
    preferredStudentLevels: [],
    linkedinProfile: "",
    githubPortfolio: "",
    profilePictureUrl: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof MentorData, value: any) => {
    setMentorData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true)
    try {
      // Transform data to match Prisma schema
      const mentorDataForSubmit = {
        age: parseInt(mentorData.age),
        contactNumber: mentorData.contactNumber,
        preferredLanguage: mentorData.preferredLanguage as Language,
        currentLocation: mentorData.currentLocation,
        shortBio: mentorData.shortBio,
        professionalRole: mentorData.professionalRole,
        subjectsToTeach: mentorData.subjectsToTeach,
        teachingExperience: mapExperienceToEnum(mentorData.teachingExperience),
        preferredStudentLevels: mentorData.preferredStudentLevels.map(level => mapEducationLevel(level)),
        linkedinProfile: mentorData.linkedinProfile,
        githubPortfolio: mentorData.githubPortfolio || null,
        profilePictureUrl: mentorData.profilePictureUrl || null,
        isActive: true
      };

      // Send data to backend
      await axios.post(
        "http://localhost:3000/api/v1/users/mentor/onboard",
        mentorDataForSubmit,
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate("/mentor/dashboard");
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      alert("Failed to complete onboarding. Please check your data and try again.");
    } finally {
      setIsSubmitting(false)
    }
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!mentorData.age || parseInt(mentorData.age) < 18) {
      alert("Age must be 18 or older");
      return false;
    }
    if (!mentorData.preferredLanguage) {
      alert("Please select your preferred language");
      return false;
    }
    if (!mentorData.shortBio || mentorData.shortBio.length < 50) {
      alert("Please provide a detailed bio (minimum 50 characters)");
      return false;
    }
    if (mentorData.subjectsToTeach.length === 0) {
      alert("Please select at least one subject to teach");
      return false;
    }
    if (!mentorData.teachingExperience) {
      alert("Please select your teaching experience");
      return false;
    }
    if (mentorData.preferredStudentLevels.length === 0) {
      alert("Please select at least one student level");
      return false;
    }
    if (!mentorData.linkedinProfile || !mentorData.linkedinProfile.includes('linkedin.com')) {
      alert("Please provide a valid LinkedIn profile URL");
      return false;
    }
    return true;
  };

  const mapExperienceToEnum = (exp: string): Experience => {
    const map: { [key: string]: Experience } = {
      'none': Experience.NONE,
      '1-3': Experience.ONE_TO_THREE_YEARS,
      '3-5': Experience.THREE_TO_FIVE_YEARS,
      '5+': Experience.FIVE_PLUS_YEARS
    };
    return map[exp] || Experience.NONE;
  };

  const mapEducationLevel = (level: string): EducationLevel => {
    const map: { [key: string]: EducationLevel } = {
      'Grade 9': EducationLevel.GRADE_9,
      'Ordinary Level': EducationLevel.ORDINARY_LEVEL,
      'Advanced Level': EducationLevel.ADVANCED_LEVEL,
      'University': EducationLevel.UNIVERSITY
    };
    return map[level] || EducationLevel.UNIVERSITY;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={mentorData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="Enter your age"
            min="18"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
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
              <SelectItem value={Language.ENGLISH}>English</SelectItem>
              <SelectItem value={Language.SINHALA}>Sinhala</SelectItem>
              <SelectItem value={Language.TAMIL}>Tamil</SelectItem>
              <SelectItem value={Language.OTHER}>Other</SelectItem>
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
          placeholder="Introduce yourself and your teaching experience (minimum 50 characters)"
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
      <div className="space-y-4">
        <Label>Subjects to Teach *</Label>
        <div className="grid grid-cols-2 gap-4">
          {[
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "English",
            "Computer Science",
            "History",
            "Geography"
          ].map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={subject}
                checked={mentorData.subjectsToTeach.includes(subject)}
                onCheckedChange={(checked) => {
                  const newSubjects = checked
                    ? [...mentorData.subjectsToTeach, subject]
                    : mentorData.subjectsToTeach.filter(s => s !== subject);
                  handleInputChange("subjectsToTeach", newSubjects);
                }}
              />
              <Label htmlFor={subject}>{subject}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Teaching Experience *</Label>
        <Select
          value={mentorData.teachingExperience}
          onValueChange={(value) => handleInputChange("teachingExperience", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Experience</SelectItem>
            <SelectItem value="1-3">1-3 Years</SelectItem>
            <SelectItem value="3-5">3-5 Years</SelectItem>
            <SelectItem value="5+">5+ Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Preferred Level of Students *</Label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "Grade 9", label: "Grade 9" },
            { value: "Ordinary Level", label: "Ordinary Level" },
            { value: "Advanced Level", label: "Advanced Level" },
            { value: "University", label: "University" }
          ].map((level) => (
            <div key={level.value} className="flex items-center space-x-2">
              <Checkbox
                id={level.value}
                checked={mentorData.preferredStudentLevels.includes(level.value)}
                onCheckedChange={(checked) => {
                  const newLevels = checked
                    ? [...mentorData.preferredStudentLevels, level.value]
                    : mentorData.preferredStudentLevels.filter(l => l !== level.value);
                  handleInputChange("preferredStudentLevels", newLevels);
                }}
              />
              <Label htmlFor={level.value}>{level.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="linkedinProfile">LinkedIn Profile URL *</Label>
        <Input
          id="linkedinProfile"
          type="url"
          value={mentorData.linkedinProfile}
          onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubPortfolio">GitHub Portfolio URL (Optional)</Label>
        <Input
          id="githubPortfolio"
          type="url"
          value={mentorData.githubPortfolio}
          onChange={(e) => handleInputChange("githubPortfolio", e.target.value)}
          placeholder="https://github.com/your-username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profilePictureUrl">Profile Picture URL (Optional)</Label>
        <Input
          id="profilePictureUrl"
          type="url"
          value={mentorData.profilePictureUrl}
          onChange={(e) => handleInputChange("profilePictureUrl", e.target.value)}
          placeholder="https://example.com/your-picture.jpg"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Mentor Onboarding</h1>
          <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
          <Progress value={progress} className="mt-4" />
        </div>

        <Card>
          <CardContent className="pt-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Complete Onboarding"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
