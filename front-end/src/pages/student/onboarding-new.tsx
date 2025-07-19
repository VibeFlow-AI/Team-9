import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/templates/AppLayout'
import { MultiStepForm } from '@/components/organisms/MultiStepForm'
import type { FormStep } from '@/components/organisms/MultiStepForm'
import { Text } from '@/components/atoms/Text'

interface StudentOnboardingData {
  // Personal Information
  fullName: string
  age: string
  email: string
  contactNumber: string
  currentLocation: string
  
  // Academic Background
  educationLevel: string
  fieldOfStudy: string
  institution: string
  gpa: string
  
  // Learning Goals
  learningObjectives: string
  preferredTopics: string
  timeCommitment: string
  preferredMentorType: string
  
  // Additional Information
  previousExperience: string
  specificChallenges: string
  expectations: string
}

const formSteps: FormStep[] = [
  {
    title: 'Personal Information',
    description: 'Tell us a bit about yourself',
    fields: [
      { id: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'age', label: 'Age', type: 'number', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
      { id: 'currentLocation', label: 'Current Location', type: 'text', required: true }
    ]
  },
  {
    title: 'Academic Background',
    description: 'Share your educational background',
    fields: [
      { 
        id: 'educationLevel', 
        label: 'Education Level', 
        type: 'select', 
        required: true,
        options: [
          { value: 'high-school', label: 'High School' },
          { value: 'undergraduate', label: 'Undergraduate' },
          { value: 'graduate', label: 'Graduate' },
          { value: 'postgraduate', label: 'Postgraduate' }
        ]
      },
      { id: 'fieldOfStudy', label: 'Field of Study', type: 'text', required: true },
      { id: 'institution', label: 'Institution', type: 'text', required: true },
      { id: 'gpa', label: 'GPA (optional)', type: 'text' }
    ]
  },
  {
    title: 'Learning Goals',
    description: 'What do you want to achieve?',
    fields: [
      { id: 'learningObjectives', label: 'Learning Objectives', type: 'textarea', required: true },
      { id: 'preferredTopics', label: 'Preferred Topics', type: 'textarea', required: true },
      { 
        id: 'timeCommitment', 
        label: 'Time Commitment', 
        type: 'select', 
        required: true,
        options: [
          { value: '1-2-hours', label: '1-2 hours per week' },
          { value: '3-5-hours', label: '3-5 hours per week' },
          { value: '6-10-hours', label: '6-10 hours per week' },
          { value: '10-plus-hours', label: '10+ hours per week' }
        ]
      },
      { 
        id: 'preferredMentorType', 
        label: 'Preferred Mentor Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'industry-professional', label: 'Industry Professional' },
          { value: 'academic-researcher', label: 'Academic Researcher' },
          { value: 'entrepreneur', label: 'Entrepreneur' },
          { value: 'any', label: 'Any' }
        ]
      }
    ]
  },
  {
    title: 'Additional Information',
    description: 'Help us match you with the right mentor',
    fields: [
      { id: 'previousExperience', label: 'Previous Experience', type: 'textarea' },
      { id: 'specificChallenges', label: 'Specific Challenges', type: 'textarea' },
      { id: 'expectations', label: 'Expectations from Mentorship', type: 'textarea', required: true }
    ]
  }
]

export default function StudentOnboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<StudentOnboardingData>({
    fullName: '',
    age: '',
    email: '',
    contactNumber: '',
    currentLocation: '',
    educationLevel: '',
    fieldOfStudy: '',
    institution: '',
    gpa: '',
    learningObjectives: '',
    preferredTopics: '',
    timeCommitment: '',
    preferredMentorType: '',
    previousExperience: '',
    specificChallenges: '',
    expectations: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const validateStep = (stepIndex: number) => {
    const stepFields = formSteps[stepIndex].fields
    const newErrors: Record<string, string> = {}

    stepFields.forEach(field => {
      const value = formData[field.id as keyof StudentOnboardingData]
      
      if (field.required && !value?.trim()) {
        newErrors[field.id] = `${field.label} is required`
      }
      
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Please enter a valid email address'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success - navigate to dashboard
      navigate('/student/dashboard')
    } catch (error) {
      console.error('Onboarding failed:', error)
      setErrors({ submit: 'Failed to complete onboarding. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout title="VibeFlow">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Text variant="h1" weight="bold" className="text-3xl mb-2">
            Student Onboarding
          </Text>
          <Text variant="p" color="muted">
            Let's set up your profile to find the perfect mentor for you
          </Text>
        </div>

        <MultiStepForm
          steps={formSteps}
          currentStep={currentStep}
          formData={formData as unknown as Record<string, string>}
          onFieldChange={handleFieldChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          loading={loading}
          errors={errors}
        />
      </div>
    </AppLayout>
  )
}
