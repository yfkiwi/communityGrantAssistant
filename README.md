# Community Grant Assistant - Voice-First Demo

A React + TypeScript + Tailwind CSS application that demonstrates a voice-first approach to grant writing for Community Economic Development Officers (CEDOs) in Canada's northern indigenous communities.

## Features

- **Voice-First Interface**: Start conversations naturally with voice input
- **Real-Time Proposal Building**: AI assistant updates proposal sections as you chat
- **Progress Tracking**: Visual checklist showing completion status (11 standard sections)
- **Split-Screen Layout**: Chat on the right, progress on the left
- **Sophisticated Demo Flow**: 10-step conversation showcasing full grant writing process
- **Document Upload**: Upload CED plans and other documents during conversation
- **System Updates**: Real-time notifications showing AI analysis and section updates
- **Custom Sections**: Add custom proposal sections via voice or text
- **Modern UI**: Clean, accessible design with Tailwind CSS and animations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Voice Integration**: Ready for EventLabs integration

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── main.tsx           # App entry point
├── App.tsx            # Main app component with routing
├── types.ts           # TypeScript interfaces
├── index.css          # Tailwind CSS + custom styles
├── WelcomePage.tsx    # Landing page with features
├── AssistantPage.tsx  # Main split-screen interface
├── VoiceChat.tsx      # Chat component with voice input
└── Checklist.tsx      # Progress tracking component
```

## Demo Features

### Welcome Page
- Hero section with clear value proposition
- Feature highlights (38+ hours saved, context-aware AI, authentic voice)
- Step-by-step "How It Works" guide
- Call-to-action to start voice conversation

### Assistant Page
- **Left Panel**: Proposal progress checklist with visual indicators
- **Right Panel**: Voice chat interface with demo conversation logic
- **Demo Responses**: Simulated AI that responds to common grant writing topics
- **Section Updates**: Proposal sections update automatically based on conversation

### Voice Chat
- Text and voice input options
- Message history with timestamps
- Processing indicators
- Document upload placeholder
- Responsive design

## Demo Conversation Flow

The enhanced demo showcases a complete 10-step grant writing process:

1. **Project Introduction**: Community greenhouse project
2. **Funding Program**: Indigenous Community Support Fund
3. **Document Upload**: CED Plan analysis with priority extraction
4. **AI Analysis**: Real-time document analysis and alignment
5. **Section Generation**: Executive Summary and Community Context
6. **Problem Statement**: Detailed community needs assessment
7. **Content Review**: Voice reading of generated content
8. **Content Refinement**: User feedback and AI adjustments
9. **Custom Sections**: Adding Youth Impact & Training Plan
10. **Budget Planning**: Detailed financial breakdown

### Key Demo Features:
- **Real-time Section Updates**: Watch sections complete as you chat
- **Document Analysis**: Upload CED plans and see AI extract key priorities
- **System Notifications**: Live updates showing AI processing
- **Custom Section Addition**: Add tailored sections via conversation
- **Progress Tracking**: Visual progress bar and completion indicators

## Customization

- **Voice Integration**: Replace demo voice logic with EventLabs API
- **AI Responses**: Update `getDemoResponse()` function with real AI integration
- **Sections**: Modify default proposal sections in `AssistantPage.tsx`
- **Styling**: Customize colors and layout in `tailwind.config.js`

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Next Steps

1. Integrate with EventLabs voice API
2. Connect to real AI service (OpenAI, Anthropic, etc.)
3. Add document upload and analysis
4. Implement proposal export functionality
5. Add user authentication and project saving
6. Deploy to production environment

---

Built for CEDOs and small communities in Canada's North. This demo showcases how voice-first interfaces can make grant writing more accessible and efficient.
