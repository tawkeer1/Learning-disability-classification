import sys
import json
import joblib
import numpy as np
import os

# Get absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models
models = {
    'random_forest': joblib.load(os.path.join(BASE_DIR, 'saved_models/random_forest_model.pkl')),
    'svm': joblib.load(os.path.join(BASE_DIR, 'saved_models/svm_model.pkl')),
    'logistic_regression': joblib.load(os.path.join(BASE_DIR, 'saved_models/logistic_regression_model.pkl')),
    'knn': joblib.load(os.path.join(BASE_DIR, 'saved_models/knn_model.pkl')),
}

# Load MultiLabelBinarizer
mlb = joblib.load(os.path.join(BASE_DIR, 'saved_models/mlb.pkl'))

# Preprocessing function to encode categorical features
def preprocess(features):
    gender = 0 if str(features.get("Gender", "")).lower() == "male" else 1
    sleep_quality_map = {"poor": 0, "average": 1, "good": 2}
    sleep_quality = sleep_quality_map.get(str(features.get("Sleep Quality", "average")).lower(), 1)
    family_history = 1 if str(features.get("Family History", "")).lower() == "yes" else 0

    return [
        features.get("Reading Score", 0),
        features.get("Math Score", 0),
        features.get("Attention Span", 0),
        features.get("Memory Retention", 0),
        features.get("Visual Processing", 0),
        features.get("Verbal Reasoning", 0),
        features.get("Age", 0),
        sleep_quality,
        features.get("Spelling Accuracy", 0),
        family_history,
        gender
    ]


# Prediction function
def predict(features):
    try:
        input_array = np.array([preprocess(features)])
        results = {}

        for model_name, model in models.items():
            pred = model.predict(input_array)
            
            probabilities = {}

            # Check if model supports predict_proba
            if hasattr(model, "predict_proba"):
                probas = model.predict_proba(input_array)

                # For multilabel classifiers, predict_proba returns a list of arrays (one per label)
                if isinstance(probas, list):
                    # probas[i] shape: (n_samples, 2) for label i
                    for i, label in enumerate(mlb.classes_):
                        prob_pos = probas[i][0][1]  # probability of class 1 for first sample
                        probabilities[label] = round(float(prob_pos) * 100, 2)
                else:
                    # For multi-class classifiers (not multilabel), probas shape: (n_samples, n_classes)
                    # Map each class to its probability
                    for i, label in enumerate(mlb.classes_):
                        prob = probas[0][i]
                        probabilities[label] = round(float(prob) * 100, 2)
            else:
                # Model does not support predict_proba
                for label in mlb.classes_:
                    probabilities[label] = None

            labels = mlb.inverse_transform(pred)

            results[model_name] = {
                "prediction": labels[0] if labels else [],
                "probabilities": probabilities
            }

        return results

    except Exception as e:
        return {"error": str(e)}


# Entry point for subprocess call
if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        result = predict(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
