import React from 'react'
import { FormField } from '../molecules/FormField'
import { ActionButton } from '../molecules/ActionButton'
import { Text } from '../atoms/Text'
import { Spacer } from '../atoms/Spacer'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormStep {
  title: string
  description?: string
  fields: FormFieldConfig[]
}

export interface FormFieldConfig {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: string) => string | undefined
}

export interface MultiStepFormProps {
  steps: FormStep[]
  currentStep: number
  formData: Record<string, string>
  onFieldChange: (fieldId: string, value: string) => void
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  loading?: boolean
  errors?: Record<string, string>
  className?: string
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  currentStep,
  formData,
  onFieldChange,
  onNext,
  onPrevious,
  onSubmit,
  loading = false,
  errors = {},
  className
}) => {
  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  const validateCurrentStep = () => {
    const stepFields = currentStepData.fields
    const stepErrors: string[] = []

    stepFields.forEach(field => {
      const value = formData[field.id] || ''
      
      if (field.required && !value.trim()) {
        stepErrors.push(`${field.label} is required`)
      }
      
      if (field.validation && value) {
        const error = field.validation(value)
        if (error) {
          stepErrors.push(error)
        }
      }
    })

    return stepErrors
  }

  const handleNext = () => {
    const stepErrors = validateCurrentStep()
    if (stepErrors.length === 0) {
      if (isLastStep) {
        onSubmit()
      } else {
        onNext()
      }
    }
  }

  const renderField = (field: FormFieldConfig) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:border-red-500'
            )}
          />
          {error && (
            <Text variant="small" color="error">
              {error}
            </Text>
          )}
        </div>
      )
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            id={field.id}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              error && 'border-red-500 focus:border-red-500'
            )}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <Text variant="small" color="error">
              {error}
            </Text>
          )}
        </div>
      )
    }

    return (
      <FormField
        key={field.id}
        id={field.id}
        label={field.label}
        type={(field.type as 'text' | 'email' | 'password' | 'number' | 'tel' | 'url') || 'text'}
        value={value}
        onChange={(newValue) => onFieldChange(field.id, newValue)}
        placeholder={field.placeholder}
        required={field.required}
        error={error}
      />
    )
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <div className="space-y-4">
          <CardTitle>{currentStepData.title}</CardTitle>
          {currentStepData.description && (
            <Text variant="p" color="muted">
              {currentStepData.description}
            </Text>
          )}
          <Progress value={progress} className="w-full" />
          <Text variant="small" color="muted" align="center">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {currentStepData.fields.map(renderField)}

          <Spacer size="lg" />

          <div className="flex justify-between">
            <ActionButton
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstStep || loading}
              icon={ArrowLeft}
              iconPosition="left"
            >
              Previous
            </ActionButton>

            <ActionButton
              onClick={handleNext}
              disabled={loading}
              loading={loading}
              icon={isLastStep ? Check : ArrowRight}
              iconPosition="right"
            >
              {isLastStep ? 'Submit' : 'Next'}
            </ActionButton>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
