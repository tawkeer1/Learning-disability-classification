import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mlmodel.app import run_prediction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict_endpoint(data: dict):
    return run_prediction(data)

# Run only when executed directly (not during import)
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))  # Render will provide this
    uvicorn.run("main:app", host="0.0.0.0", port=port)
