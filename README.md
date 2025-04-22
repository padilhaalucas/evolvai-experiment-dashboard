# Real-Time Experiment Monitoring Dashboard

<p align="center">
  <a href="https://nextjs.org/" target="blank"><img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" width="80" alt="Next.js Logo" /></a>
</p>

<p align="center">A modern and responsive real-time dashboard for monitoring A/B test experiments</p>

## 📊 Overview

This application serves as the frontend for a real-time experiment monitoring system. It visualizes live experiment data, providing immediate insights into A/B test performance with dynamic, interactive charts and comprehensive metrics displays.

### Key Features

- **Real-time Visualization**: Live-updating charts and metrics powered by Server-Sent Events (SSE)
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile views
- **Interactive Controls**: "Rabbit-Turtle" speed control system for adjusting data flow rate
- **Comprehensive Dashboard**: Multiple panels displaying metrics, visualizations, and event logs
- **Animated Components**: Smooth transitions and animations for an engaging user experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
$ npm install
```

### Running the Application

```bash
# Development mode
$ npm run dev

# Build for production
$ npm run build

# Production mode
$ npm start
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

## 📱 Pages

### Landing Page (`/`)

A visually appealing introduction to the application with:
- Animated typewriter text effect
- Feature overview with icons
- Call-to-action button to enter the dashboard

### Experiments Dashboard (`/experiments`)

The main dashboard consisting of:
- Metrics Panel: Key performance indicators for each variant
- Visualization Panel: Interactive charts comparing experiment data
- Event Log Panel: Chronological list of experiment events

## 🔄 Real-Time Data Handling

### Server-Sent Events (SSE)

The application uses SSE for real-time data streaming from the backend:

- **Custom Hook**: `useEventSource` manages the SSE connection, data parsing, and reconnection logic
- **React Context**: `ExperimentContext` distributes real-time data throughout the component tree
- **Persistent State**: Connection status and latest updates are preserved between sessions

## 🐇🐢 The "Rabbit-Turtle" System

This innovative feature allows users to control the speed of real-time data updates, providing flexibility based on specific monitoring needs.

### Speed Levels

The application offers a unified scale of update intervals:

```
UNIFIED_SCALE = [60000, 30000, 15000, 8000, 5000, 3000, 2000, 1000, 500]
```

- 🐢 **Turtle Mode**: Slower updates (8s - 60s) for focused analysis and reduced noise
- ⚖️ **Neutral Mode**: Standard update frequency (5s) for balanced monitoring
- 🐰 **Rabbit Mode**: Rapid updates (0.5s - 3s) for intensive real-time analysis

### Implementation

The system integrates seamlessly with the backend through:

- **Speed Control UI**: Interactive buttons with visual feedback for speed adjustment
- **Context-Managed State**: Current speed level maintained in application state
- **API Integration**: Automatic requests to the backend to synchronize update frequency
- **Visual Indicators**: Dynamic speed multiplier display (e.g., "2.5x", "1/12.0x")

### User Experience Considerations

As a senior software engineer, I implemented this feature because:

1. **Cognitive Load Management**: Different update speeds help users focus on the right level of detail for their current task
2. **Bandwidth Optimization**: Users can reduce update frequency when they don't need second-by-second updates
3. **Extended Analysis**: Slower speeds allow for more deliberate pattern recognition without constant distractions
4. **Stress Testing**: Accelerated updates help validate the robustness of the application and identify potential performance issues
5. **Flexible Presentation**: Presenters can adjust speed based on audience needs during demos or team reviews

## 🏗️ Architecture

The application follows a clean and modular architecture:

- **Pages**: Next.js page components that define routes and layout
- **Components**: UI elements organized by function (charts, controls, panels)
- **Contexts**: React context providers for global state management
- **Hooks**: Custom React hooks including the SSE connection manager
- **Types**: TypeScript type definitions ensuring type safety
- **Utils**: Helper functions for calculations and data formatting

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimal interface with ample whitespace
- **Responsive Layout**: Adapts seamlessly from mobile to desktop
- **Animated Transitions**: Smooth animations for state changes and data updates
- **Accessibility**: Semantic HTML and appropriate contrast ratios
- **Interactive Elements**: Tooltips, hover states, and feedback for user actions

## 🔧 Technical Implementation

### State Management

- React Context API for global experiment data
- Local component state for UI-specific concerns
- localStorage for persistence between sessions

### Data Visualization

- Dynamic charts that automatically update with incoming data
- Responsive sizing based on viewport dimensions
- Interactive elements (tooltips, highlights) for data exploration

### Performance Optimizations

- Memoization of expensive calculations
- Throttled updates to prevent UI jank
- Efficient rendering with React's virtual DOM

## 🛣️ Future Improvements

- Add user authentication system
- Implement dark mode toggle
- Support for multiple simultaneous experiments
- Advanced statistical analysis features
- Custom alert configurations for metric thresholds
- Export functionality for reports and data
- Expanded filtering options for event logs

## 🤝 Working with the Backend

This frontend application is designed to work with the accompanying NestJS backend API. To experience the full functionality:

1. Start the backend server (see backend README)
2. Configure the API URL in the frontend if necessary (default: `http://localhost:4000/api`)
3. Launch the frontend application
4. Navigate to the experiments dashboard
