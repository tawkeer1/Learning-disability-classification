import sys
import json
import numpy as np
import joblib
import os
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.exceptions import NotFittedError

# === File checks ===
required_files = [
    'saved_models/scaler.pkl',
    'saved_models/mlb.pkl',
    'saved_models/random_forest_model.pkl',
    'saved_models/svm_model.pkl',
    'saved_models/logistic_regression_model.pkl',
    'saved_models/knn_model.pkl',
    'saved_models/gradient_boosting_model.pkl',
    'saved_models/deep_learning_model.h5'
]

for file in required_files:
    if not os.path.exists(file):
        print(json.dumps({"error": f"Missing required model file: {file}"}))
        sys.exit(1)

# === Load all models and preprocessing objects ===
try:
    scaler = joblib.load('saved_models/scaler.pkl')
    mlb = joblib.load('saved_models/mlb.pkl')

    models = {
        'random_forest': joblib.load('saved_models/random_forest_model.pkl'),
        'svm': joblib.load('saved_models/svm_model.pkl'),
        'logistic_regression': joblib.load('saved_models/logistic_regression_model.pkl'),
        'knn': joblib.load('saved_models/knn_model.pkl'),
        'gradient_boosting': joblib.load('saved_models/gradient_boosting_model.pkl'),
        'deep_learning': load_model('saved_models/deep_learning_model.h5'),
    }

except Exception as e:
    print(json.dumps({"error": f"Model loading error: {str(e)}"}))
    sys.exit(1)

# === Parse input features ===
try:
    input_data = json.loads(sys.argv[1])
    X = pd.DataFrame([input_data])

    # Preprocess categorical features
    X['Gender'] = X['Gender'].map({'Male': 0, 'Female': 1})
    X['Sleep Quality'] = X['Sleep Quality'].map({'Poor': 0, 'Average': 1, 'Good': 2})

    # Ensure consistent column order
    X_scaled = scaler.transform(X)

except Exception as e:
    print(json.dumps({"error": f"Input processing error: {str(e)}"}))
    sys.exit(1)

# === Generate predictions from each model ===
predictions = {}
all_outputs = []

for name, model in models.items():
    try:
        if name == 'deep_learning':
            probs = model.predict(X_scaled, verbose=0)[0]
            preds = (probs > 0.5).astype(int)
        else:
            probs = model.predict_proba(X_scaled)
            preds = model.predict(X_scaled)[0]

        label_names = mlb.classes_
        pred_labels = [label_names[i] for i, val in enumerate(preds) if val == 1]

        if name == 'deep_learning':
            prob_map = {label_names[i]: round(float(probs[i]) * 100, 2) for i in range(len(label_names))}
        else:
            prob_map = {label_names[i]: round(float(probs[i][1]) * 100, 2) for i in range(len(label_names))}

        predictions[name] = {
            "prediction": pred_labels,
            "probabilities": prob_map
        }

        all_outputs.append(preds)

    except NotFittedError:
        predictions[name] = {"error": "Model not fitted."}
    except Exception as e:
        predictions[name] = {"error": str(e)}

# === Majority Voting Logic ===
votes = np.sum(np.array(all_outputs), axis=0)
final_prediction = [mlb.classes_[i] for i, count in enumerate(votes) if count >= 3]

# === Final Output ===
output = {
    "finalPrediction": final_prediction,
    **predictions
}

print(json.dumps(output))
