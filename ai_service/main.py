from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from recommend import recommend_courses
from resume_analyzer import analyze_resume
from code_eval import evaluate_code
from chat_mentor import chat_with_mentor

app = FastAPI(title="InturnX AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    user_skills: list[str]
    completed_courses: list[str]

class ResumeAnalysisRequest(BaseModel):
    resume: str

class CodeEvaluationRequest(BaseModel):
    code: str
    language: str

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "InturnX AI"}

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    try:
        recommendations = recommend_courses(request.user_skills, request.completed_courses)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-resume")
async def analyze_resume_endpoint(request: ResumeAnalysisRequest):
    try:
        analysis = analyze_resume(request.resume)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate-code")
async def evaluate_code_endpoint(request: CodeEvaluationRequest):
    try:
        evaluation = evaluate_code(request.code, request.language)
        return {"evaluation": evaluation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat-mentor")
async def chat_mentor_endpoint(request: ChatRequest):
    try:
        response = chat_with_mentor(request.message, request.context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
