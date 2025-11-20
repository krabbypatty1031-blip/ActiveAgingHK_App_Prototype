# 🏥 Hong Kong Senior Smart Community Care App

A mobile-first intelligent community care application designed specifically for Hong Kong seniors, supporting the "Aging in Place" concept.

## 🎯 Project Features

### Core Functions
- **Health Monitoring**: Traffic light color-coded display of vital signs (heart rate, blood pressure, steps, sleep)
- **Emergency Help**: SOS one-touch help + fall detection + 30-second countdown cancellation
- **AI Voice Assistant**: English voice recognition and synthesis, supporting daily queries and emergency keyword detection
- **Family Connection**: Voice-described photo albums, one-touch video calls, community activity registration
- **Family Monitoring**: Web-based dashboard for real-time viewing of senior health status

### Accessibility Design
- **Font Size**: Supports four sizes from 16px-28px
- **High Contrast**: Black and white high contrast mode
- **Voice Navigation**: Full English voice announcements
- **Touch Optimization**: Buttons ≥48x48dp, anti-mis-touch design
- **Simplified Operations**: Maximum two-level menu structure

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Access Application
- Senior End: http://localhost:5173
- Family End: http://localhost:5173/family

## 📱 Page Structure

```
src/
├── pages/              # Main page components
│   ├── Home.tsx        # Home page (greeting + navigation)
│   ├── HealthDashboard.tsx  # Health dashboard
│   ├── AIAssistant.tsx # AI voice assistant
│   ├── EmergencySystem.tsx   # Emergency help system
│   ├── SocialFamily.tsx # Social family interface
│   └── FamilyDashboard.tsx  # Family monitoring panel
├── components/         # Reusable components
│   └── AccessibilitySettings.tsx  # Accessibility settings
├── styles/             # Style files
│   └── accessibility.css       # Accessibility styles
└── App.tsx            # Main application component
```

## 🎨 Design Specifications

### Color System
- Background: #FFFFFF / #F5F7FA (light colors)
- Text: #333333 (dark colors)
- SOS Button: #FF4D4F (high saturation red)
- Status Indicators: Green=Normal, Yellow=Attention, Red=Abnormal

### Font Specifications
- Minimum Font Size: 18pt (meets accessibility standards)
- Headings: 24pt-32pt
- Button Text: 20pt-24pt
- Supports four font size adjustments

### Interaction Specifications
- Button Size: ≥48x48dp
- Touch Spacing: ≥8dp
- Voice Feedback: All operations have voice confirmation
- Vibration Feedback: Key operations provide tactile feedback

## 🔧 Technical Features

### Frontend Technology
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Accessibility Technology
- **Speech Synthesis**: Web Speech API (English)
- **Speech Recognition**: Web Speech API (English)
- **Vibration Feedback**: Vibration API
- **Font Adjustment**: CSS custom properties
- **High Contrast**: CSS filters and class switching

### Mobile Optimization
- **Responsive Design**: Mobile-first
- **PWA Support**: Can be installed as a native app
- **Touch Gestures**: Optimized touch experience
- **Offline Support**: Basic functions available offline

## 📋 Usage Instructions

### For Seniors
1. Open the app to see a friendly English greeting
2. Click large buttons to access various functions
3. Click the microphone icon when using the voice assistant
4. Click the red SOS button in emergency situations
5. Adjust font size and contrast through settings

### For Family Members
1. Visit `/family` to view the monitoring panel
2. Select the senior user to view
3. View real-time health data and trends
4. Receive emergency alerts and reminders
5. Contact seniors through quick actions

## 🛡️ Security Features

- **Emergency Help**: Multiple confirmation mechanisms to prevent accidental activation
- **Fall Detection**: 30-second countdown allows cancellation
- **Location Sharing**: Location sent only in emergency situations
- **Data Protection**: Sensitive information stored locally
- **Voice Privacy**: Voice recognition processed locally

## 🌟 Project Highlights

1. **Localized Design**: Fully adapted to Hong Kong senior usage habits
2. **Family Care**: Connects seniors with family emotional bonds
3. **Smart Alerts**: AI detects abnormal behavior and health conditions
4. **Simple and Easy to Use**: Minimalist design, reducing learning curve
5. **24/7 Guardian**: 24-hour health monitoring and emergency response

## 📞 Support

For questions or suggestions, please contact the development team.

---

**Let technology warm the hearts of seniors, let care transcend time and space.** 💕
