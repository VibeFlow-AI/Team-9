import React from 'react'
import { Text } from '../atoms/Text'
import { Input, Label } from '../atoms'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  label: string
  id: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && 'border-red-500 focus:border-red-500')}
      />
      {error && (
        <Text variant="small" color="error" className="mt-1">
          {error}
        </Text>
      )}
    </div>
  )
}
