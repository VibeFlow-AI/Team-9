# Atomic Design System Documentation

## Overview

This frontend has been rebuilt using **Atomic Design** principles, which organize components into a hierarchical structure for better maintainability, reusability, and scalability.

## Architecture

```
src/components/
├── atoms/           # Basic UI building blocks
├── molecules/       # Simple component combinations
├── organisms/       # Complex component combinations
├── templates/       # Page layout components
├── ui/             # Enhanced shadcn/ui components
└── index.ts        # Main export file
```

## Component Hierarchy

### 🔬 Atoms (Basic Building Blocks)

The smallest, indivisible components that serve as the foundation of the design system.

#### `Text`
- **Purpose**: Unified text rendering with consistent typography
- **Props**: `variant`, `size`, `weight`, `color`, `align`
- **Usage**: All text content throughout the app

```tsx
<Text variant="h1" weight="bold" color="primary">
  Welcome to VibeFlow
</Text>
```

#### `Icon`
- **Purpose**: Consistent icon rendering with size and color variants
- **Props**: `icon`, `size`, `color`, `variant`
- **Usage**: All icons throughout the app

```tsx
<Icon icon={User} size="md" color="primary" />
```

#### `Spacer`
- **Purpose**: Consistent spacing between components
- **Props**: `size`, `axis`
- **Usage**: Layout spacing

```tsx
<Spacer size="lg" axis="vertical" />
```

#### `Loader`
- **Purpose**: Loading states with different variants
- **Props**: `size`, `variant`, `color`
- **Usage**: Loading indicators

```tsx
<Loader variant="spinner" size="md" />
```

### 🧪 Molecules (Simple Combinations)

Components that combine atoms to create more complex, reusable UI elements.

#### `FormField`
- **Purpose**: Complete form input with label and error handling
- **Combines**: `Input` + `Label` + `Text` (for errors)
- **Usage**: All form inputs

```tsx
<FormField
  label="Email"
  value={email}
  onChange={setEmail}
  type="email"
  required
  error={errors.email}
/>
```

#### `ActionButton`
- **Purpose**: Enhanced button with icon support and loading states
- **Combines**: `Button` + `Icon` + `Text`
- **Usage**: All interactive buttons

```tsx
<ActionButton
  icon={Plus}
  iconPosition="left"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Create Session
</ActionButton>
```

#### `InfoCard`
- **Purpose**: Display metrics, stats, or information in card format
- **Combines**: `Card` + `Text` + `Icon`
- **Usage**: Dashboard metrics, feature highlights

```tsx
<InfoCard
  title="Total Sessions"
  value={42}
  icon={Calendar}
  trend={{ value: 12, direction: 'up' }}
/>
```

#### `UserAvatar`
- **Purpose**: User representation with avatar, name, and role
- **Combines**: `Avatar` + `Text` + `Badge`
- **Usage**: User profiles, session participants

```tsx
<UserAvatar
  name="John Doe"
  email="john@example.com"
  role="Student"
  showDetails={true}
  onClick={handleProfileClick}
/>
```

### 🧬 Organisms (Complex Combinations)

Sophisticated components that combine molecules and atoms to create distinct sections of the interface.

#### `Header`
- **Purpose**: Application header with navigation and user actions
- **Combines**: `Text` + `UserAvatar` + `ActionButton` + navigation
- **Usage**: Main app header

```tsx
<Header
  title="VibeFlow"
  user={currentUser}
  navigation={navigationItems}
  onLogout={handleLogout}
/>
```

#### `MultiStepForm`
- **Purpose**: Wizard-style form with progress tracking
- **Combines**: `FormField` + `ActionButton` + `Progress` + `Card`
- **Usage**: Onboarding forms, complex data entry

```tsx
<MultiStepForm
  steps={onboardingSteps}
  currentStep={currentStep}
  formData={formData}
  onFieldChange={handleFieldChange}
  onNext={handleNext}
  onSubmit={handleSubmit}
/>
```

#### `DashboardMetrics`
- **Purpose**: Dashboard overview with key metrics
- **Combines**: Multiple `InfoCard` components
- **Usage**: Dashboard overview sections

```tsx
<DashboardMetrics
  stats={dashboardStats}
  userRole="student"
  onCardClick={handleMetricClick}
/>
```

#### `SessionList`
- **Purpose**: Display list of sessions with actions
- **Combines**: `Card` + `UserAvatar` + `ActionButton` + `Text` + `Badge`
- **Usage**: Session management, history

```tsx
<SessionList
  sessions={upcomingSessions}
  userRole="student"
  onSessionClick={handleSessionClick}
  onJoinSession={handleJoinSession}
/>
```

### 📋 Templates (Page Layouts)

High-level components that define page structure and combine organisms to create complete page layouts.

#### `AppLayout`
- **Purpose**: Main application layout with header and content area
- **Combines**: `Header` + content container
- **Usage**: All authenticated pages

```tsx
<AppLayout
  title="VibeFlow"
  user={user}
  navigation={nav}
  onLogout={handleLogout}
>
  {children}
</AppLayout>
```

#### `AuthLayout`
- **Purpose**: Authentication pages layout
- **Combines**: `Card` + `Text` + branding
- **Usage**: Login, signup, role selection

```tsx
<AuthLayout
  title="Welcome Back"
  subtitle="Sign in to your account"
>
  <LoginForm />
</AuthLayout>
```

#### `DashboardLayout`
- **Purpose**: Dashboard page layout with metrics and content sections
- **Combines**: `DashboardMetrics` + `SessionList` + additional content
- **Usage**: Dashboard pages

```tsx
<DashboardLayout
  userRole="student"
  stats={stats}
  recentSessions={recentSessions}
  upcomingSessions={upcomingSessions}
  additionalContent={<QuickActions />}
/>
```

## Usage Patterns

### 1. Component Import Strategy

Use the main index file for cleaner imports:

```tsx
// ✅ Good
import { Text, ActionButton, InfoCard, AppLayout } from '@/components'

// ❌ Avoid
import { Text } from '@/components/atoms/Text'
import { ActionButton } from '@/components/molecules/ActionButton'
```

### 2. Composition Over Configuration

Build complex UIs by composing smaller components:

```tsx
// ✅ Good - Compose molecules from atoms
const UserProfile = () => (
  <div className="space-y-4">
    <UserAvatar user={user} showDetails />
    <Text variant="p" color="muted">{user.bio}</Text>
    <ActionButton onClick={handleEdit}>Edit Profile</ActionButton>
  </div>
)
```

### 3. Consistent Theming

Use design tokens consistently across all levels:

```tsx
// ✅ Good - Use predefined variants
<Text variant="h2" weight="semibold" color="primary" />
<ActionButton variant="outline" size="lg" />
<InfoCard variant="outlined" />

// ❌ Avoid custom styling that breaks consistency
<h2 style={{ fontSize: '24px', color: '#333' }}>Title</h2>
```

### 4. Props Interface Consistency

Maintain consistent prop patterns across similar components:

```tsx
// All components support size variants
size?: 'sm' | 'md' | 'lg'

// All components support color variants
color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'

// All interactive components support disabled/loading states
disabled?: boolean
loading?: boolean
```

## State Management Integration

The atomic design system integrates seamlessly with our state management:

```tsx
// Components consume global state
import { useAppContext } from '@/context/AppContext'

const UserDashboard = () => {
  const { user, sessions, bookSession } = useAppContext()
  
  return (
    <AppLayout user={user}>
      <DashboardLayout
        userRole={user.role}
        stats={sessions.stats}
        upcomingSessions={sessions.upcoming}
        onBookSession={bookSession}
      />
    </AppLayout>
  )
}
```

## Best Practices

### 1. Single Responsibility
- Each component should have one clear purpose
- Atoms should be as minimal as possible
- Molecules should solve one specific UI pattern

### 2. Reusability
- Design components to be reusable across different contexts
- Use props to control behavior rather than creating variants
- Avoid hardcoded content or styles

### 3. Accessibility
- All interactive components include proper ARIA attributes
- Keyboard navigation is supported throughout
- Color contrast meets WCAG guidelines

### 4. Performance
- Components are optimized with React.memo where appropriate
- Heavy computations are memoized with useMemo/useCallback
- Lazy loading is used for complex organisms

### 5. Testing Strategy
```tsx
// Test atoms in isolation
test('Text component renders with correct variant', () => {
  render(<Text variant="h1">Heading</Text>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

// Test molecules with their composed atoms
test('FormField shows error message', () => {
  render(<FormField label="Email" error="Invalid email" />)
  expect(screen.getByText('Invalid email')).toBeInTheDocument()
})

// Test organisms with user interactions
test('SessionList allows joining sessions', () => {
  const onJoin = vi.fn()
  render(<SessionList sessions={mockSessions} onJoinSession={onJoin} />)
  fireEvent.click(screen.getByText('Join'))
  expect(onJoin).toHaveBeenCalled()
})
```

## Migration Notes

When migrating existing components:

1. **Identify the atomic level** - Is it an atom, molecule, organism, or template?
2. **Extract reusable patterns** - Look for repeated UI patterns that can become molecules
3. **Maintain backward compatibility** - Export legacy components during transition
4. **Update imports gradually** - Replace imports one file at a time
5. **Test thoroughly** - Ensure visual and functional parity

## File Organization

```
src/
├── components/
│   ├── atoms/
│   │   ├── Text.tsx
│   │   ├── Icon.tsx
│   │   ├── Spacer.tsx
│   │   ├── Loader.tsx
│   │   └── index.ts
│   ├── molecules/
│   │   ├── FormField.tsx
│   │   ├── ActionButton.tsx
│   │   ├── InfoCard.tsx
│   │   ├── UserAvatar.tsx
│   │   └── index.ts
│   ├── organisms/
│   │   ├── Header.tsx
│   │   ├── MultiStepForm.tsx
│   │   ├── DashboardMetrics.tsx
│   │   ├── SessionList.tsx
│   │   └── index.ts
│   ├── templates/
│   │   ├── AppLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── index.ts
│   ├── ui/           # shadcn/ui components
│   └── index.ts      # Main exports
├── pages/            # Page components using templates
└── hooks/            # Reusable logic hooks
```

This atomic design system provides a scalable foundation for the VibeFlow frontend, enabling rapid development while maintaining consistency and quality across the application.
