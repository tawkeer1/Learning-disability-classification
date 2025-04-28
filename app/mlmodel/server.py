from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load model and encoder
model = joblib.load('learning_disability_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

class Features(BaseModel):
    Reading_Score: float
    Math_Score: float
    Attention_Span: float
    Memory_Retention: float
    Visual_Processing: float
    Verbal_Reasoning: float
    Age: int

@app.post("/predict")
def predict(features: Features):
    try:
        input_array = np.array([
            features.Reading_Score,
            features.Math_Score,
            features.Attention_Span,
            features.Memory_Retention,
            features.Visual_Processing,
            features.Verbal_Reasoning,
            features.Age
        ]).reshape(1, -1)

        prediction = model.predict(input_array)
        predicted_label = label_encoder.inverse_transform(prediction)[0]

        return {"prediction": predicted_label}
    
    except Exception as e:
        return {"error": str(e)}
