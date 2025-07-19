import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Text } from '@/components/atoms/Text'
import { ActionButton } from '@/components/molecules/ActionButton'
import { InfoCard } from '@/components/molecules/InfoCard'
import { Users, BookOpen, Star, ArrowRight, GraduationCap, Award } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Connect with experienced professionals from leading companies and institutions',
      value: '1000+'
    },
    {
      icon: BookOpen,
      title: 'Personalized Learning',
      description: 'Get customized guidance tailored to your specific goals and learning style',
      value: '24/7'
    },
    {
      icon: Star,
      title: 'Proven Success',
      description: 'Join thousands of students who have accelerated their careers through mentorship',
      value: '95%'
    }
  ]

  const stats = [
    { label: 'Active Mentors', value: '1,200+' },
    { label: 'Students Helped', value: '5,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Sessions Completed', value: '10,000+' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="bold" className="text-2xl text-blue-600">
              VibeFlow
            </Text>
            <div className="flex items-center space-x-4">
              <ActionButton
                variant="ghost"
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </ActionButton>
              <ActionButton
                onClick={() => navigate('/role-selection')}
              >
                Get Started
              </ActionButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Text variant="h1" weight="bold" className="text-5xl mb-6 text-gray-900">
            Accelerate Your Learning with{' '}
            <span className="text-blue-600">Expert Mentors</span>
          </Text>
          
          <Text variant="p" color="muted" className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with industry professionals who will guide you through your learning journey,
            provide personalized feedback, and help you achieve your career goals.
          </Text>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <ActionButton
              size="lg"
              onClick={() => navigate('/role-selection')}
              icon={ArrowRight}
              iconPosition="right"
              className="px-8 py-4 text-lg"
            >
              Start Learning Today
            </ActionButton>
            
            <ActionButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
              className="px-8 py-4 text-lg"
            >
              Learn More
            </ActionButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <Text variant="h3" weight="bold" className="text-3xl text-blue-600 mb-2">
                  {stat.value}
                </Text>
                <Text variant="p" color="muted" className="text-sm">
                  {stat.label}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Text variant="h2" weight="bold" className="text-3xl mb-4">
              Why Choose VibeFlow?
            </Text>
            <Text variant="p" color="muted" className="text-lg max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <InfoCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                value={feature.value}
                variant="outlined"
                className="text-center"
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Text variant="h2" weight="bold" className="text-3xl mb-4">
              How It Works
            </Text>
            <Text variant="p" color="muted" className="text-lg max-w-2xl mx-auto">
              Get started in just a few simple steps
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <Text variant="h4" weight="semibold" className="mb-2">
                1. Create Your Profile
              </Text>
              <Text variant="p" color="muted">
                Tell us about your goals, experience, and what you want to learn
              </Text>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <Text variant="h4" weight="semibold" className="mb-2">
                2. Find Your Mentor
              </Text>
              <Text variant="p" color="muted">
                Browse profiles and connect with mentors who match your needs
              </Text>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <Text variant="h4" weight="semibold" className="mb-2">
                3. Start Learning
              </Text>
              <Text variant="p" color="muted">
                Schedule sessions and begin your personalized learning journey
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <Text variant="h2" weight="bold" className="text-3xl mb-4 text-white">
            Ready to Start Your Journey?
          </Text>
          <Text variant="p" className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already accelerating their careers with VibeFlow
          </Text>
          
          <ActionButton
            size="lg"
            variant="secondary"
            onClick={() => navigate('/role-selection')}
            icon={ArrowRight}
            iconPosition="right"
            className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started Now
          </ActionButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Text variant="h3" weight="bold" className="text-2xl text-white mb-4">
              VibeFlow
            </Text>
            <Text variant="p" className="text-gray-400">
              © 2025 VibeFlow. All rights reserved.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  )
}
