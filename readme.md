the backend has been hosted on fly.
This repository will observe a new architectural change to Routes, controller, repository Pattern. 
************************************************************************************************************
## 🚧 Upcoming Features – SnapText v2.0

This section outlines the planned enhancements for the next major release of ChatApp. These updates focus on scalability, performance, and real-world functionality to demonstrate full-stack mastery and readiness for production environments.

### 🎯 Key Areas of Enhancement

#### 🛠️ 1. Codebase Refactoring
- Modular file and folder structure (controllers, services, routes, utils)
- Type-safe logic and enhanced folder isolation
- Scalable architecture to support future feature expansion

#### 📞 2. Real-Time Audio & Video Calling (WebRTC)
- Peer-to-peer calling with WebRTC integration
- Socket.io signaling server for call coordination
- Audio/video call UI components
- Reconnection & failure handling logic

#### 🤖 3. AI Assistant Integration
- ChatGPT-style assistant inside the chat
- Free tier: 6 AI queries/day
- After limit: prompts user to upgrade (Pro version)
- OpenAI API integration + caching for repeated queries

#### 💳 4. Stripe Payment Integration
- Secure payment gateway for upgrading to Pro
- Webhook handling and success/failure flows
- Dashboard to manage billing

#### 🔐 5. Advanced Security Practices
- Helmet.js for HTTP header protection
- Rate limiting for AI API & auth routes
- Sanitization of inputs to avoid injection attacks
- Securing routes via JWT and role-based access

#### 🧠 6. Caching & Optimization
- Redis integration for session storage and AI query caching
- Optimized MongoDB queries & pagination
- Image compression and lazy loading for media sharing

#### 🪟 7. UI/UX Enhancements
- Fully responsive design (mobile-first)
- Redesigned login and chat interface for smooth user experience
- Framer Motion for transitions and animations
- Clean component tree and better UI state handling

#### 📁 8. Developer Documentation
- API endpoints documented via Postman or Swagger
- Setup guide for local development and deployment
- Architecture diagram (included in `/docs` folder)

---

### 🧪 Why This Matters

> "This version of ChatApp isn't just a chat app. It's a full-stack, real-world-grade application that showcases my ability to think, design, and code like a production engineer."

Stay tuned for commits with the `🔧feature` tag as work begins on each enhancement.

---

### 📅 Development Timeline

- **May 27 - June 3**: Codebase cleanup, UI improvements
- **June 4 - June 15**: WebRTC and AI integration
- **June 16 - June 25**: Stripe + Security features
- **June 26 onward**: Bug fixes, optimization, final polish


