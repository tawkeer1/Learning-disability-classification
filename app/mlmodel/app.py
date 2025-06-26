import sys
import json
import numpy as np
import joblib
import os
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.exceptions import NotFittedError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Required files
required_files = [
    'scaler.pkl',
    'mlb.pkl',
    'random_forest_model.pkl',
    'svm_model.pkl',
    'logistic_regression_model.pkl',
    'knn_model.pkl',
    'gradient_boosting_model.pkl',
    'deep_learning_model.h5'
]

# Check all required files exist
for file in required_files:
    if not os.path.exists(os.path.join(BASE_DIR, 'saved_models', file)):
        print(json.dumps({"error": f"Missing required model file: saved_models/{file}"}))
        sys.exit(1)

# Load scaler and label binarizer
try:
    scaler = joblib.load(os.path.join(BASE_DIR, 'saved_models', 'scaler.pkl'))
    mlb = joblib.load(os.path.join(BASE_DIR, 'saved_models', 'mlb.pkl'))
except Exception as e:
    print(json.dumps({"error": f"Loading scaler/mlb failed: {str(e)}"}))
    sys.exit(1)

# Load models
try:
    models = {
        'random_forest': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'random_forest_model.pkl')),
        'svm': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'svm_model.pkl')),
        'logistic_regression': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'logistic_regression_model.pkl')),
        'knn': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'knn_model.pkl')),
        'gradient_boosting': joblib.load(os.path.join(BASE_DIR, 'saved_models', 'gradient_boosting_model.pkl')),
        'deep_learning': load_model(os.path.join(BASE_DIR, 'saved_models', 'deep_learning_model.h5')),
    }
except Exception as e:
    print(json.dumps({"error": f"Loading models failed: {str(e)}"}))
    sys.exit(1)

# Expected input features in exact order
expected_columns = [
    "Age", "Gender", "Sleep Quality", "Attention Span", "Memory Retention",
    "Visual Processing", "Reading Score", "Math Score", "Verbal Reasoning",
    "Spelling Accuracy", "Family History"
]

# Parse input JSON string from CLI argument
try:
    input_data = json.loads(sys.argv[1])

    # Special case: feature importance explanation request
    if input_data.get("explain") is True:
        try:
            rf_model = models['random_forest']
            importances = rf_model.estimators_[0].feature_importances_ \
                if hasattr(rf_model, "estimators_") else rf_model.feature_importances_
            output = {
                "feature_importances": dict(zip(expected_columns, importances.tolist()))
            }
            print(json.dumps(output))
            sys.exit(0)
        except Exception as e:
            print(json.dumps({"error": f"Feature importance error: {str(e)}"}))
            sys.exit(1)

    # Convert input data to DataFrame
    X = pd.DataFrame([input_data])

    # Encode categorical features to numeric
    X['Gender'] = X['Gender'].map({'Male': 0, 'Female': 1})
    X['Sleep Quality'] = X['Sleep Quality'].map({'Poor': 0, 'Average': 1, 'Good': 2})
    X['Family History'] = X['Family History'].map({'No': 0, 'Yes': 1})

    # Check for missing columns
    missing_cols = set(expected_columns) - set(X.columns)
    if missing_cols:
        raise ValueError(f"Missing input features: {missing_cols}")

    # Reorder columns exactly as during training
    X = X[expected_columns]

    # Scale features
    X_scaled = scaler.transform(X)

except Exception as e:
    print(json.dumps({"error": f"Input processing error: {str(e)}"}))
    sys.exit(1)

# Prepare output dictionary
predictions = {}
all_preds = []

for name, model in models.items():
    try:
        if name == 'deep_learning':
            probs = model.predict(X_scaled, verbose=0)[0]
            preds = (probs > 0.5).astype(int)
            prob_map = {mlb.classes_[i]: round(float(probs[i]) * 100, 2) for i in range(len(mlb.classes_))}
        else:
            # MultiOutputClassifier's predict_proba returns list of arrays, each (1,2)
            probs = model.predict_proba(X_scaled)
            preds = model.predict(X_scaled)[0]
            prob_map = {
                mlb.classes_[i]: round(float(probs[i][0][1]) * 100, 2)
                for i in range(len(mlb.classes_))
            }

        # Convert binary predictions to label names
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

# Majority voting: at least 3 models must agree
votes = np.sum(np.array(all_preds), axis=0)
final_prediction = [mlb.classes_[i] for i, count in enumerate(votes) if count >= 3]

output = {
    "finalPrediction": final_prediction,
    **predictions
}

print(json.dumps(output))
