import sys
import json
import joblib
import numpy as np
import os
from collections import Counter
# Get absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models
models = {
    'random_forest': joblib.load(os.path.join(BASE_DIR, 'saved_models/random_forest_model.pkl')),
    'svm': joblib.load(os.path.join(BASE_DIR, 'saved_models/svm_model.pkl')),
    'logistic_regression': joblib.load(os.path.join(BASE_DIR, 'saved_models/logistic_regression_model.pkl')),
    'knn': joblib.load(os.path.join(BASE_DIR, 'saved_models/knn_model.pkl')),
    'gradient_boosting': joblib.load(os.path.join(BASE_DIR, 'saved_models/gradient_boosting_model.pkl')),
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

        votes = {label: [] for label in mlb.classes_}  # To collect predictions from all models
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
                            prob_pos = 0.0

                        probabilities[label] = round(float(prob_pos) * 100, 2)
                else:
                    for i, label in enumerate(mlb.classes_):
                        probabilities[label] = round(float(probas[0][i]) * 100, 2)
            else:
                for label in mlb.classes_:
                    probabilities[label] = None

            labels = mlb.inverse_transform(pred)
            label_list = labels[0] if labels else []

            # Track votes for majority voting
            for label in mlb.classes_:
                votes[label].append(1 if label in label_list else 0)

            results[model_name] = {
                "prediction": label_list,
                "probabilities": probabilities
            }

        # Majority vote decision (each class independently)
        majority_vote = []
        for label, label_votes in votes.items():
            if sum(label_votes) > len(label_votes) / 2:
                majority_vote.append(label)

        results["finalPrediction"] = majority_vote

        return results

    except Exception as e:
        return {"error": str(e)}

# Entry point for subprocess call
if __name__ == "__main__":
    try:
        args = json.loads(sys.argv[1])

        if args.get("explain"):
            # Return feature importances from RandomForest
            rf_model = models.get("random_forest")
            if rf_model is not None and hasattr(rf_model.estimators_[0], "feature_importances_"):
                feature_names = [
                    "Age", "Gender", "Sleep Quality", "Attention Span", "Memory Retention",
                    "Visual Processing", "Reading Score", "Math Score", "Verbal Reasoning",
                    "Spelling Accuracy", "Family History"
                ]
                importances = rf_model.estimators_[0].feature_importances_
                result = dict(zip(feature_names, importances))
                print(json.dumps({"feature_importances": result}))
            else:
                print(json.dumps({"error": "RandomForest model not available or unsupported"}))
        else:
            result = predict(args)
            print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

