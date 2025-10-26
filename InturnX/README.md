# InturnX - AI-Powered Experiential Learning Platform

InturnX is a comprehensive full-stack web application that revolutionizes coding education through AI-powered learning, real-time coding battles, and personalized internship recommendations.

## 🚀 Features

### Core Functionality
- **AI-Powered Learning**: Personalized course recommendations using sentence transformers
- **Real-Time Coding Battles**: Socket.io-powered 1v1 code challenges
- **Smart Internship Matching**: AI resume analysis and job recommendations
- **Code Quality Analysis**: Automated code evaluation using CodeBERT
- **AI Chat Mentor**: Interactive learning assistant powered by OpenAssistant

### User Experience
- **Progress Tracking**: XP system with badges and achievements
- **Project Submissions**: GitHub/ZIP upload with AI feedback
- **Community Features**: Discussion forums and peer learning
- **Admin Dashboard**: Complete content management system

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **TailwindCSS** + **DaisyUI** for styling
- **React Router v7** for navigation
- **Axios** for API communication
- **Monaco Editor** for code editing
- **Context API** for state management

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Socket.io** for real-time features
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads

### AI Service
- **Python** + **FastAPI**
- **Hugging Face Transformers**
- **Open-source AI Models**:
  - sentence-transformers/all-MiniLM-L6-v2 (recommendations)
  - facebook/bart-large-cnn (course summarization)
  - microsoft/CodeBERT-base (code analysis)
  - bert-base-uncased (resume analysis)
  - OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5 (chat)

## 📁 Project Structure

```
inturnx/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context API
│   │   └── ...
│   ├── package.json
│   └── .env
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB models
│   ├── middleware/       # Auth middleware
│   ├── utils/           # Utilities
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env
├── ai_service/           # Python AI service
│   ├── main.py          # FastAPI app
│   ├── recommend.py     # Recommendation engine
│   ├── resume_analyzer.py # Resume analysis
│   ├── code_eval.py     # Code evaluation
│   ├── chat_mentor.py   # AI chat mentor
│   ├── requirements.txt
│   └── .env
└── README.md
```

## 🏁 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inturx
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   # Copy .env and configure MongoDB URI and JWT secret
   ```

3. **Set up the AI service**
   ```bash
   cd ../ai_service
   pip install -r requirements.txt
   # Configure .env if needed
   ```

4. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   # Configure .env with API base URL
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start the AI service**
   ```bash
   cd ai_service
   python main.py
   # or
   uvicorn main:app --reload --port 8000
   ```

3. **Start the backend**
   ```bash
   cd ../server
   npm start
   # or for development
   npm run dev
   ```

4. **Start the frontend**
   ```bash
   cd ../client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inturnx
JWT_SECRET=your-super-secret-jwt-key
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### AI Service (.env)
```env
PORT=8000
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (admin)

### Projects
- `POST /api/projects/submit` - Submit project
- `GET /api/projects/user/:id` - Get user projects

### Internships
- `GET /api/internships` - Get all internships
- `POST /api/internships/apply` - Apply for internship

### AI Services
- `POST /api/ai/recommend` - Get learning recommendations
- `POST /api/ai/analyze-resume` - Analyze resume
- `POST /api/ai/chat-mentor` - Chat with AI mentor

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd server
# Configure for production
npm run build
# Deploy to Render/Railway
```

### AI Service (Hugging Face Spaces)
```bash
cd ai_service
# Deploy to Hugging Face Spaces
```

### Database (MongoDB Atlas)
- Create Atlas cluster
- Update MONGODB_URI in server/.env

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Open-source AI models from Hugging Face
- React, Node.js, and FastAPI communities
- All contributors and users

---

**InturnX** - Transforming coding education through AI and interactive learning experiences.
