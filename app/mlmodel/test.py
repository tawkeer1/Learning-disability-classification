import pandas as pd
import numpy as np

# Random generator
rng = np.random.default_rng(seed=42)

# Total desired samples
total_samples = 3000

# Define disability classes and desired uneven distribution
class_distribution = {
    'None': 1000,
    'ADHD': 600,
    'Dysgraphia': 500,
    'Dyslexia': 450,
    'Dyscalculia': 350,
    'Auditory Processing Disorder': 100
}

# Ensure the total matches
assert sum(class_distribution.values()) == total_samples, "Class sizes must sum to 3000"

# Class-specific distributions (same as before)
distribution_params = {
    'None': {
        'Reading Score': (75, 10),
        'Math Score': (75, 10),
        'Attention Span': (70, 8),
        'Memory Retention': (70, 10),
        'Visual Processing': (75, 8),
        'Verbal Reasoning': (75, 10)
    },
    'ADHD': {
        'Reading Score': (65, 12),
        'Math Score': (65, 12),
        'Attention Span': (40, 12),
        'Memory Retention': (60, 10),
        'Visual Processing': (65, 10),
        'Verbal Reasoning': (68, 9)
    },
    'Dysgraphia': {
        'Reading Score': (65, 10),
        'Math Score': (68, 10),
        'Attention Span': (60, 10),
        'Memory Retention': (65, 10),
        'Visual Processing': (50, 12),
        'Verbal Reasoning': (60, 10)
    },
    'Dyslexia': {
        'Reading Score': (50, 12),
        'Math Score': (70, 10),
        'Attention Span': (60, 10),
        'Memory Retention': (55, 10),
        'Visual Processing': (60, 10),
        'Verbal Reasoning': (50, 10)
    },
    'Dyscalculia': {
        'Reading Score': (70, 10),
        'Math Score': (45, 12),
        'Attention Span': (60, 10),
        'Memory Retention': (55, 10),
        'Visual Processing': (65, 10),
        'Verbal Reasoning': (65, 10)
    },
    'Auditory Processing Disorder': {
        'Reading Score': (65, 10),
        'Math Score': (65, 10),
        'Attention Span': (60, 10),
        'Memory Retention': (55, 10),
        'Visual Processing': (60, 10),
        'Verbal Reasoning': (45, 10)
    },
}

# Function to generate class-specific data
def generate_class_data(cls, n):
    params = distribution_params[cls]
    return pd.DataFrame({
        'Reading Score': rng.normal(*params['Reading Score'], size=n).clip(0, 100),
        'Math Score': rng.normal(*params['Math Score'], size=n).clip(0, 100),
        'Attention Span': rng.normal(*params['Attention Span'], size=n).clip(0, 100),
        'Memory Retention': rng.normal(*params['Memory Retention'], size=n).clip(0, 100),
        'Visual Processing': rng.normal(*params['Visual Processing'], size=n).clip(0, 100),
        'Verbal Reasoning': rng.normal(*params['Verbal Reasoning'], size=n).clip(0, 100),
        'Age': rng.integers(7, 18, size=n),
        'Disability': [cls] * n
    })

# Generate and combine all class data
df_list = [generate_class_data(cls, n) for cls, n in class_distribution.items()]
synthetic_df = pd.concat(df_list, ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

# Save to CSV (optional)
synthetic_df.to_csv("learning_disability_dataset.csv", index=False)

# Print class distribution
print(synthetic_df['Disability'].value_counts())
