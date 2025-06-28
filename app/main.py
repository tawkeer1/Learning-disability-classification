from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mlmodel.app import run_prediction

app = FastAPI()

# Optional: Allow CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(request: Request):
    try:
        input_json = await request.json()
        result = run_prediction(input_json)
        return result
    except Exception as e:
        return {"error": f"Server error: {str(e)}"}
