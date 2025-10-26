# InturnX Full-Stack Application Development TODO

## 1. Project Restructuring
- [x] Move existing React app files to `client/` subdirectory
- [x] Create `server/` directory with subdirectories: routes/, controllers/, models/, middleware/, utils/
- [x] Create `ai_service/` directory with files: main.py, recommend.py, resume_analyzer.py, code_eval.py, chat_mentor.py

## 2. Backend Setup (Node.js + Express)
- [x] Create `server/package.json` with dependencies (express, mongoose, socket.io, jwt, bcrypt, multer, axios, cors, dotenv, express-validator)
- [x] Install backend dependencies
- [x] Create `server/server.js` as main entry point
- [x] Set up MongoDB connection with Mongoose
- [x] Implement Mongoose models: User, Course, Internship, Project

## 3. AI Service Setup (Python + FastAPI)
- [x] Create `ai_service/requirements.txt` with dependencies (fastapi, uvicorn, transformers, torch, sentence-transformers, spacy, huggingface-hub, pydantic, python-multipart)
- [x] Install AI service dependencies
- [x] Implement `ai_service/main.py` with FastAPI app and routes
- [x] Implement `ai_service/recommend.py` using sentence-transformers/all-MiniLM-L6-v2
- [x] Implement `ai_service/resume_analyzer.py` using bert-base-uncased + spaCy
- [x] Implement `ai_service/code_eval.py` using microsoft/CodeBERT-base
- [x] Implement `ai_service/chat_mentor.py` using OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5

## 4. Backend Implementation
- [x] Implement auth middleware (JWT verification)
- [x] Create auth routes and controllers (signup, login, profile)
- [x] Create courses routes and controllers (GET /api/courses, POST /api/courses)
- [x] Create projects routes and controllers (POST /api/projects/submit, GET /api/projects/user/:id)
- [x] Create internships routes and controllers (GET /api/internships, POST /api/internships/apply)
- [x] Create AI service proxy routes (POST /api/ai/recommend, /api/ai/analyze-resume, /api/ai/evaluate-code, /api/ai/chat-mentor)
- [x] Integrate Socket.io for real-time coding battles
- [x] Implement file upload with Multer for projects and resumes

## 5. Frontend Enhancement (React)
- [x] Update `client/package.json` with additional dependencies (react-router-dom, axios, @monaco-editor/react, jwt-decode, socket.io-client)
- [x] Install frontend dependencies
- [x] Set up TailwindCSS and DaisyUI
- [x] Implement Context API for auth and global state
- [x] Create page components: Home, Login/Signup, Dashboard, LearningHub, CourseDetail, BattleArena, Projects, Internships, Community, AdminPanel
- [x] Set up React Router v7 for navigation
- [x] Integrate Monaco Editor for code editing
- [x] Implement auth forms with JWT handling
- [x] Add Axios interceptors for API requests

## 6. Integrations and Features
- [x] Connect frontend to backend APIs
- [x] Implement real-time coding battles with Socket.io
- [x] Integrate AI service calls from backend
- [ ] Add Google OAuth for auth (if possible)
- [ ] Implement light/dark mode toggle
- [x] Add progress tracking, XP, badges system
- [ ] Implement admin panel for managing data

## 7. Testing and Deployment Prep
- [x] Set up environment variables (.env files for secrets)
- [x] Test frontend-backend integration
- [x] Test backend-AI service integration
- [x] Test real-time features
- [x] Verify AI models load and function correctly
- [ ] Update README.md with setup and run instructions
- [ ] Prepare for deployment (Vercel for frontend, Render/Railway for backend, Hugging Face Spaces for AI, MongoDB Atlas)

## 8. Final Verification
- [x] Run the full application locally
- [ ] Test user flows: registration, login, course learning, project submission, battles, AI interactions
- [ ] Ensure all features work as specified
