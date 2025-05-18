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
        features.get("Age", 0),
        gender,
        sleep_quality,
        features.get("Attention Span", 0),
        features.get("Memory Retention", 0),
        features.get("Visual Processing", 0),
        features.get("Reading Score", 0),
        features.get("Math Score", 0),
        features.get("Verbal Reasoning", 0),
        features.get("Spelling Accuracy", 0),
        family_history
    ]

# Prediction function
def predict(features):
    try:
        input_array = np.array([preprocess(features)])
        results = {}

        for model_name, model in models.items():
            pred = model.predict(input_array)
            probabilities = {}

            if hasattr(model, "predict_proba"):
                probas = model.predict_proba(input_array)

                if isinstance(probas, list):
                    for i, label in enumerate(mlb.classes_):
                        estimator = model.estimators_[i]
                        classes = estimator.classes_

                        if 1 in classes:
                            pos_index = list(classes).index(1)
                            prob_pos = probas[i][0][pos_index]
                        else:
                            prob_pos = 0.0  # Default to 0% if class 1 not present

                        probabilities[label] = round(float(prob_pos) * 100, 2)
                else:
                    for i, label in enumerate(mlb.classes_):
                        probabilities[label] = round(float(probas[0][i]) * 100, 2)
            else:
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
