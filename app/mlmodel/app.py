import sys
import json
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the trained model and LabelEncoder
model = joblib.load(os.path.join(BASE_DIR, 'learning_disability_model.pkl'))
label_encoder = joblib.load(os.path.join(BASE_DIR, 'label_encoder.pkl'))

# Function to make prediction
def predict(features):
    try:
        input_array = np.array([
            features["Reading Score"],
            features["Math Score"],
            features["Attention Span"],
            features["Memory Retention"],
            features["Visual Processing"],
            features["Verbal Reasoning"],
            features["Age"]
        ]).reshape(1, -1)

        prediction = model.predict(input_array)
        predicted_label = label_encoder.inverse_transform(prediction)[0]

        return {"prediction": predicted_label}
    except Exception as e:
        return {"error": str(e)}

# Entry point
if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        result = predict(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
