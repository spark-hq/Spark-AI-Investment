from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Spark Investment Python Service",
    description="F&O Calculations and Analytics Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "Spark Investment Python Service",
        "status": "running",
        "version": "1.0.0",
        "description": "F&O Calculations and Analytics"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "python-service",
        "port": os.getenv("PORT", "8000")
    }

@app.get("/api/test")
async def test():
    return {
        "message": "Python service is working!",
        "endpoints": ["/", "/health", "/api/test", "/docs"]
    }

@app.get("/api/calculate/basic")
async def calculate_basic():
    """Basic calculation endpoint - placeholder for F&O calculations"""
    return {
        "message": "F&O calculation endpoint",
        "note": "Will implement Black-Scholes, Greeks, etc. when needed",
        "status": "ready"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    print(" Python Service Started!")
    print(f" Port: {os.getenv('PORT', '8000')}")
    print(f"🔗 Docs: http://localhost:{os.getenv('PORT', '8000')}/docs")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    print(" Python Service Shutting Down...")