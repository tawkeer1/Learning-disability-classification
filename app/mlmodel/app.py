import sys
import json
import numpy as np
import joblib
import os
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.exceptions import NotFittedError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load all necessary models and objects
try:
    scaler = joblib.load(os.path.join(BASE_DIR, 'saved_models', 'scaler.pkl'))
    mlb = joblib.load(os.path.join(BASE_DIR, 'saved_models', 'mlb.pkl'))
    selected_features = joblib.load(os.path.join(BASE_DIR, 'saved_models', 'selected_features.pkl'))

    models = {
        'random_forest': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'random_forest_model.pkl')),
        'svm': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'svm_model.pkl')),
        'logistic_regression': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'logistic_regression_model.pkl')),
        'knn': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'knn_model.pkl')),
        'gradient_boosting': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'gradient_boosting_model.pkl')),
        'deep_learning': load_model(os.path.join(BASE_DIR, 'saved_models', 'deep_learning_model.h5')),
    }

except Exception as e:
    print(json.dumps({"error": f"Model loading failed: {str(e)}"}))
    sys.exit(1)

def run_prediction(input_json):
    try:
        # Handle feature importance request
        if input_json.get("explain") is True:
            rf_model = models['random_forest']
            importances = rf_model.estimators_[0].feature_importances_ \
                if hasattr(rf_model, "estimators_") else rf_model.feature_importances_
            return {"feature_importances": dict(zip(selected_features, importances.tolist()))}

        # Create DataFrame
        X = pd.DataFrame([input_json])

        # Encode categorical features
        X['Gender'] = X['Gender'].map({'Male': 0, 'Female': 1})
        X['Sleep Quality'] = X['Sleep Quality'].map({'Poor': 0, 'Average': 1, 'Good': 2})
        X['Family History'] = X['Family History'].map({'No': 0, 'Yes': 1})

        # Ensure correct columns
        missing = set(selected_features) - set(X.columns)
        if missing:
            return {"error": f"Missing input features: {missing}"}

        X = X[selected_features]
        X_scaled = scaler.transform(X)

    except Exception as e:
        return {"error": f"Input processing error: {str(e)}"}

    predictions = {}
    all_preds = []

    for name, model in models.items():
        try:
            if name == 'deep_learning':
                probs = model.predict(X_scaled, verbose=0)[0]
                preds = (probs > 0.5).astype(int)
                prob_map = {mlb.classes_[i]: round(float(probs[i]) * 100, 2) for i in range(len(mlb.classes_))}
            else:
                probs = model.predict_proba(X_scaled)
                preds = model.predict(X_scaled)[0]
                prob_map = {
                    mlb.classes_[i]: round(float(probs[i][0][1]) * 100, 2)
                    for i in range(len(mlb.classes_))
                }

            pred_labels = [mlb.classes_[i] for i, val in enumerate(preds) if val == 1]

            predictions[name] = {
                "prediction": pred_labels,
                "probabilities": prob_map
            }
            all_preds.append(preds)

        except NotFittedError:
            predictions[name] = {"error": "Model not fitted."}
        except Exception as e:
            predictions[name] = {"error": str(e)}

    votes = np.sum(np.array(all_preds), axis=0)
    final_prediction = [mlb.classes_[i] for i, count in enumerate(votes) if count >= 3]

    return {
        "finalPrediction": final_prediction,
        **predictions
    }

# ✅ CLI entrypoint (used by Node.js via spawn or for testing)
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input JSON provided."}))
        sys.exit(1)

    try:
        input_data = json.loads(sys.argv[1])
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)

    result = run_prediction(input_data)
    print(json.dumps(result))
