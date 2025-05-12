import sys
import json
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and MultiLabelBinarizer
model = joblib.load(os.path.join(BASE_DIR, 'multi_label_model.pkl'))
mlb = joblib.load(os.path.join(BASE_DIR, 'mlb.pkl'))

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
        proba = model.predict_proba(input_array)

        # Fix: probability of label being 1 (i.e., disability present)
        probabilities = {
            mlb.classes_[i]: round(float(proba[i][0][1]) * 100, 2)
            for i in range(len(mlb.classes_))
        }

        labels = mlb.inverse_transform(prediction)

        return {
            "prediction": labels[0] if labels else [],
            "probabilities": probabilities
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        result = predict(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
