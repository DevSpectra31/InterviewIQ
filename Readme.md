
# InterviewIQ 🚀
### AI-Powered Mock Interview Platform

InterviewIQ is an AI-powered interview preparation platform that helps students and job seekers practice technical and HR interviews through role-based mock interviews, AI-generated questions, automated answer evaluation, personalized feedback, and performance analytics.

Built using the MERN Stack, Ollama, JWT Authentication, and Docker.

---

## 🌟 Features

### 🔐 Authentication & Authorization
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing using bcrypt

---

### 🎯 Interview Configuration

Users can create customized interviews based on:

#### Job Roles
- MERN Developer
- React Developer
- Node.js Developer
- Frontend Developer
- Backend Developer
- Java Developer

#### Experience Level
- Fresher
- 0–1 Years
- 1–3 Years

#### Difficulty Level
- Easy
- Medium
- Hard

---

### 🤖 AI Question Generation

Generates:
- Technical Questions
- HR Questions
- Scenario-Based Questions
- Role-Specific Questions
- Difficulty-Based Questions

Powered by locally hosted LLMs using Ollama.

---

### 📝 Interactive Interview Session

- One Question at a Time
- Auto Save Answers
- Previous / Next Navigation
- Interview Progress Tracking
- Interview Timer

---

### 🧠 AI Answer Evaluation

Each answer is evaluated based on:

- Technical Accuracy
- Concept Understanding
- Completeness
- Communication Clarity

AI returns:

- Score
- Strengths
- Weaknesses
- Missing Concepts
- Suggested Improvements
- Ideal Answer

---

### 📊 Final Interview Report

At the end of every interview:

- Overall Score
- Technical Score
- HR Score
- Strong Areas
- Weak Areas
- Personalized Feedback
- Recommended Topics

---

### 📈 Performance Analytics

Track:

- Total Interviews
- Average Score
- Best Score
- Progress Trends
- Topic-wise Performance

---

### 📚 Personalized Study Plan Generator

Generate AI-powered study plans based on weak areas.

Example:

```text
Day 1 - JavaScript Fundamentals
Day 2 - React Hooks
Day 3 - Node.js & Express
Day 4 - MongoDB Aggregation
Day 5 - Authentication & JWT
```

---

### 🎤 Voice-Based Interviews

- Speech-to-Text Support
- Voice Answer Submission
- Hands-Free Mock Interviews

---

### 🔄 AI Follow-Up Questions

AI dynamically generates follow-up questions if answers are incomplete.

Example:

```text
Question:
What is JWT?

Answer:
JWT is used for authentication.

Follow-Up:
Can you explain Refresh Tokens?
```

---

### 📄 Resume-Based Interview Generation

Upload your resume and generate personalized interview questions from:

- Projects
- Skills
- Technologies
- Experience

Example:

```text
I noticed you built a Food Delivery Application.

Can you explain how you integrated Razorpay payments?
```

---

### 🏢 Company-Specific Mock Interviews

Generate interview rounds for:

- TCS
- Infosys
- Wipro
- EPAM
- Accenture
- Cognizant

---

## 🏗️ System Architecture

```text
React Frontend
       │
       ▼
Express Backend
       │
 ┌─────┼─────────────┐
 ▼                   ▼
MongoDB           Ollama
                     │
                     ▼
              LLM Processing
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
 Questions      Evaluation     Feedback
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

### AI Layer
- Ollama
- Llama 3 / Qwen

### DevOps
- Docker
- Docker Compose

---

## 📂 Project Structure

```text
InterviewIQ
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       │   ├── Navbar
│       │   ├── Sidebar
│       │   ├── QuestionCard
│       │   ├── ReportCard
│       │   └── ProtectedRoute
│       │
│       ├── pages
│       │   ├── Login
│       │   ├── Register
│       │   ├── Dashboard
│       │   ├── InterviewSetup
│       │   ├── InterviewScreen
│       │   ├── Report
│       │   └── History
│       │
│       ├── context
│       ├── services
│       └── App.jsx
│
├── backend
│   ├── controllers
│   │   ├── authController.js
│   │   └── interviewController.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── interviewRoutes.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Interview.js
│   │   └── Question.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── services
│   │   └── ollamaService.js
│   │
│   ├── config
│   │   └── db.js
│   │
│   └── server.js
│
├── docker-compose.yml
├── README.md
└── .env
```

---

## 🗄️ Database Schema

### User

```javascript
{
  name: String,
  email: String,
  password: String,
  createdAt: Date
}
```

### Interview

```javascript
{
  userId: ObjectId,
  role: String,
  experienceLevel: String,
  difficulty: String,
  overallScore: Number,
  technicalScore: Number,
  hrScore: Number,
  feedback: String,
  createdAt: Date
}
```

### Question

```javascript
{
  interviewId: ObjectId,
  question: String,
  answer: String,
  score: Number,
  strengths: [String],
  weaknesses: [String],
  idealAnswer: String
}
```

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Interview

```http
POST /api/interview/start
POST /api/interview/submit
GET  /api/interview/history
GET  /api/interview/:id
```

---

## 🤖 Ollama Setup

Install and start Ollama:

```bash
ollama serve
```

Pull a model:

```bash
ollama pull llama3
```

or

```bash
ollama pull qwen3
```

Verify installation:

```bash
ollama list
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

OLLAMA_MODEL=llama3
```

---

## 🐳 Docker Setup

Build containers:

```bash
docker compose build
```

Run application:

```bash
docker compose up
```

Stop application:

```bash
docker compose down
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/interviewiq.git
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 💡 Prompt Engineering

### Question Generation

```text
Generate 5 interview questions for a MERN Developer.

Experience Level: Fresher
Difficulty: Medium

Return JSON only.
```

### Answer Evaluation

```text
Question:
{question}

Candidate Answer:
{answer}

Evaluate:

1. Score out of 10
2. Strengths
3. Weaknesses
4. Missing Concepts
5. Suggested Improvements
6. Ideal Answer

Return JSON only.
```

---

## 📈 Future Enhancements

- Coding Round Evaluation
- AI Video Interviewer
- Leaderboard System
- Multi-Language Support
- Email Performance Reports
- Team Hiring Dashboard
- Interview Scheduling
- Real-Time Collaboration
- AI Avatar Interviewer

---

## 🎯 Resume Description

Developed InterviewIQ, an AI-powered mock interview platform using React.js, Node.js, Express.js, MongoDB, JWT Authentication, Ollama, and Docker. Implemented role-based interview generation, automated answer evaluation, personalized feedback, interview analytics, adaptive follow-up questioning, and resume-based interview simulations using locally hosted Large Language Models.

---

## 🧠 Skills Demonstrated

- Full Stack Development
- React.js
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- REST API Design
- AI/LLM Integration
- Prompt Engineering
- Docker & Docker Compose
- Database Design
- Performance Analytics
- System Architecture

---

## ⭐ Project Goal

To help students and job seekers prepare for technical and HR interviews through realistic AI-powered mock interviews, actionable feedback, and personalized learning recommendations.