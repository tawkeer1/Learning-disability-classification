import pandas as pd
import random

def generate_sample():
    age = random.randint(7, 16)
    gender = random.choice(["Male", "Female"])
    sleep_quality = random.choice(["Poor", "Average", "Good"])
    family_history = random.choice([0, 1])  # 0 = No, 1 = Yes

    sleep_map = {
        "Poor": random.randint(30, 50),
        "Average": random.randint(51, 75),
        "Good": random.randint(76, 100)
    }
    sleep_score = sleep_map[sleep_quality]

    attention_span = random.randint(20, 90)
    memory_retention = random.randint(20, 90)
    visual_processing = random.randint(20, 90)
    reading_score = random.randint(20, 100)
    math_score = random.randint(20, 100)
    verbal_reasoning = random.randint(20, 100)
    spelling_accuracy = random.randint(20, 100)

    # --- Diagnosis rules ---
    adhd_score = 0
    dyslexia_score = 0

    # ADHD factors
    if attention_span < 40:
        adhd_score += 2
    elif attention_span < 60:
        adhd_score += 1

    if sleep_score < 50:
        adhd_score += 1
    if memory_retention < 50:
        adhd_score += 1
    if family_history and random.random() < 0.5:
        adhd_score += 1
    if age < 10 and attention_span < 45:
        adhd_score += 1

    # Dyslexia factors
    if reading_score < 50:
        dyslexia_score += 2
    elif reading_score < 60:
        dyslexia_score += 1

    if spelling_accuracy < 55:
        dyslexia_score += 1
    if verbal_reasoning < 60:
        dyslexia_score += 1
    if visual_processing < 50:
        dyslexia_score += 1
    if family_history and random.random() < 0.5:
        dyslexia_score += 1

    # Diagnosis thresholds
    adhd = adhd_score >= 3
    dyslexia = dyslexia_score >= 3

    # Final label
    label = "None"
    if adhd and dyslexia:
        label = "ADHD, Dyslexia"
    elif adhd:
        label = "ADHD"
    elif dyslexia:
        label = "Dyslexia"

    return {
        "Age": age,
        "Gender": gender,
        "Sleep Quality": sleep_quality,
        "Attention Span": attention_span,
        "Memory Retention": memory_retention,
        "Visual Processing": visual_processing,
        "Reading Score": reading_score,
        "Math Score": math_score,
        "Verbal Reasoning": verbal_reasoning,
        "Spelling Accuracy": float(spelling_accuracy),
        "Family History": family_history,
        "Labels": label
    }


# Generate 1000 samples
data = [generate_sample() for _ in range(1000)]
df = pd.DataFrame(data)

# Preview label counts
print("Label distribution:\n", df['Labels'].value_counts())

# Save dataset
df.to_csv("clean_realistic_dataset.csv", index=False)
print("Dataset saved as clean_realistic_dataset.csv")
