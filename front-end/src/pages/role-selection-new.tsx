import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { ActionButton } from '@/components/molecules/ActionButton'
import { Text } from '@/components/atoms/Text'
import { Spacer } from '@/components/atoms/Spacer'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Users } from 'lucide-react'

export default function RoleSelection() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor' | null>(null)

  const handleRoleSelect = (role: 'student' | 'mentor') => {
    setSelectedRole(role)
    // Navigate to the appropriate onboarding flow
    setTimeout(() => {
      navigate(`/${role}/onboarding`)
    }, 200)
  }

  return (
    <AuthLayout
      title="Choose Your Role"
      subtitle="Select how you'd like to use VibeFlow"
    >
      <div className="space-y-6">
        <Text variant="p" color="muted" align="center">
          Are you here to learn or to teach?
        </Text>

        <Spacer size="md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Option */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'student' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleRoleSelect('student')}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              
              <div className="space-y-2">
                <Text variant="h4" weight="semibold">
                  I'm a Student
                </Text>
                <Text variant="p" color="muted" className="text-sm">
                  I want to learn from experienced mentors and improve my skills
                </Text>
              </div>

              <ActionButton
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelect('student')
                }}
              >
                Get Started as Student
              </ActionButton>
            </CardContent>
          </Card>

          {/* Mentor Option */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'mentor' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleRoleSelect('mentor')}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <Text variant="h4" weight="semibold">
                  I'm a Mentor
                </Text>
                <Text variant="p" color="muted" className="text-sm">
                  I want to share my knowledge and help others grow in their careers
                </Text>
              </div>

              <ActionButton
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelect('mentor')
                }}
              >
                Get Started as Mentor
              </ActionButton>
            </CardContent>
          </Card>
        </div>

        <Spacer size="lg" />

        <div className="text-center">
          <Text variant="small" color="muted">
            You can always change your role later in your profile settings
          </Text>
        </div>
      </div>
    </AuthLayout>
  )
}
