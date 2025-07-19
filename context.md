# EduVibe Hackathon Context

## Project Overview
**EduVibe** is an AI-powered EdTech platform connecting students with mentors for personalized learning. The platform serves two main personas:
- **Maya** (Student) - preparing for Biology A/L practical exam
- **Dr. Patel** (Mentor) - university lecturer wanting to help students

## Core Platform Requirements

### Essential Features
- Multi-part form based student onboarding system
- Mentor recommendation system based on student goals
- Interactive mentor session booking system
- Student dashboard for viewing booked sessions
- Mentor dashboard for session management

### Key User Flow
1. **Home Page** → "Get Started" button
2. **Sign-up Modal** → First-time users
3. **Role Selection** → Student or Mentor registration
4. **Onboarding Forms** → Role-specific information collection
5. **Dashboard Redirect** → Based on user role

## Task Breakdown

### Task 1: Engaging Homepage Flow
**Objective**: Create homepage matching Figma designs
- **Hero Section**: Descriptive title, paragraph, complex graphics
- **Carousel Section**: Sliding cards highlighting student benefits
- **Session Highlights**: Mock mentor session cards
- **Requirements**: Mobile/desktop responsive, animations, state management
- **Reference**: [Design Figma File](https://www.figma.com/design/e2g4PhByvDAuNLDr1xKH8J/Hackathon-Task?node-id=0-1&t=JU4iMlVRwUvKIVpp-1)

### Task 2: Student Onboarding Flow
**Objective**: Multi-part student registration and dashboard

**Onboarding Form Parts**:
1. **Who Are You?** - Name, Age, Email, Contact
2. **Academic Background** - Education level, School
3. **Subject & Skills** - Interests, Skill levels, Learning style, Accommodations

**Student Dashboard**:
- **Explore Tab**: All available mentor sessions
- **Booked Sessions Tab**: Student's booked sessions (initially empty)

### Task 3: Mentor Matching and Booking
**Objective**: Mentor discovery and booking interface

**Requirements**:
- Mock profiles for **12+ mentors**
- Intelligent matching algorithm (ML/Non-ML)
- Session booking modal (date/time selection)
- Payment confirmation (bank slip upload)
- 2-hour fixed session duration

### Task 4: Mentor Onboarding Flow
**Objective**: Mentor registration process

**Onboarding Form Parts**:
1. **Personal Info** - Name, Age, Email, Contact, Language, Location, Bio, Role
2. **Areas of Expertise** - Subjects, Experience, Student levels
3. **Social Links** - LinkedIn (mandatory), GitHub/Portfolio (optional), Profile picture

### Task 5: Mentor Dashboard
**Objective**: Session management dashboard

**Dashboard Features**:
- **Analytics**: Age-based pie chart of students
- **Subject Breakdown**: Horizontal bar chart of student interests
- **Session Management**: Sorted sessions with student details and call-to-action

## Technical Considerations

### AI Integration Focus Areas
- **Time Management**: Using AI for efficient development
- **Planning**: AI-assisted project structuring
- **Brainstorming**: Feature ideation with AI
- **Performance**: AI-driven optimization
- **State Management**: Front-end state handling with AI assistance

### Edge Cases to Handle
- State loss during form submission/page refresh
- Booking conflicts and stale data
- Mobile responsiveness and z-index issues
- Multiple mentor profiles causing UI confusion
- Time zone mismatches

### State Management Requirements
- Form state persistence across interactions
- Real-time booking updates
- Dashboard state consistency
- Navigation state retention

## Evaluation Criteria

### Development Quality (30%)
- Architectural design and component interaction
- Technology choice justification
- Code quality and maintainability
- UI similarity to high-fidelity designs
- Platform scalability
- Token usage efficiency
- Code documentation and modularity

### Research Report (50%)
- AI experimentation documentation
- Prompt engineering strategies
- Error diagnosis and remediation
- AI performance benchmarking
- Insights and recommendations
- Report clarity and structure

### Presentation (20%)
- Timing and structure (5 min demo + 7 min Q&A)
- Feature demonstration clarity
- Report findings summarization
- Q&A response effectiveness
- Professional engagement

## Implementation Notes

### Critical Requirements
1. Read entire case study before starting
2. Create dedicated Register page with role selection
3. Implement "Get Started" button flow with modal
4. Handle existing user sessions appropriately
5. Focus on AI experimentation, not just feature completion

### Mock Data Requirements
- Minimum 12 mentor profiles
- Diverse subject areas and expertise levels
- Realistic student-mentor matching scenarios

### UI/UX Priorities
- Match Figma designs closely
- Ensure mobile responsiveness
- Implement smooth animations
- Maintain consistent state across navigation

## Success Metrics Summary
- **50%** Report quality (AI experimentation documentation)
- **30%** Development quality (architecture, code, UI)
- **20%** Presentation quality (demo and Q&A)

## Technology Stack Considerations
- Modern, updated frameworks and libraries
- Efficient state management solution
- Responsive design implementation
- AI integration capabilities
- Scalable architecture patterns

---

*Focus: Experiment with AI throughout development while building a functional, well-designed platform that serves both students and mentors effectively.*
