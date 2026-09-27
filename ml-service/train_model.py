import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report
)


# =========================================================
# 1. LOAD DATASET
# =========================================================

DATASET_PATH = "dataset/carclaims.csv"

df = pd.read_csv(DATASET_PATH)
df = df.rename(columns={
    "Days:Policy-Accident": "Days_Policy_Accident",
    "Days:Policy-Claim": "Days_Policy_Claim",
    "AddressChange-Claim": "AddressChange_Claim"
})

print("=" * 60)
print("DATASET INFORMATION")
print("=" * 60)

print("Shape:", df.shape)
print("Columns:")
print(df.columns.tolist())

print("\nTarget distribution:")
print(df["FraudFound"].value_counts())


# =========================================================
# 2. CONVERT TARGET
# No Fraud = 0
# Yes Fraud = 1
# =========================================================

df["FraudFound"] = (
    df["FraudFound"]
    .astype(str)
    .str.strip()
    .str.lower()
    .map({
        "no": 0,
        "yes": 1
    })
)

if df["FraudFound"].isna().any():
    raise ValueError("Unexpected values found in FraudFound column.")


# =========================================================
# 3. FEATURES
#
# We use the fields required by our project UI.
#
# We intentionally exclude:
# PolicyNumber
# RepNumber
# Year
#
# These are not required in our claim-entry screen.
# =========================================================

FEATURES = [
    "Make",
    "VehicleCategory",
    "VehiclePrice",
    "AgeOfVehicle",
    "NumberOfCars",

    "PolicyType",
    "BasePolicy",
    "Deductible",
    "DriverRating",
    "Days_Policy_Accident",
    "Days_Policy_Claim",
    "PastNumberOfClaims",
    "AddressChange_Claim",

    "Age",
    "AgeOfPolicyHolder",
    "Sex",
    "MaritalStatus",

    "Month",
    "WeekOfMonth",
    "DayOfWeek",
    "AccidentArea",
    "DayOfWeekClaimed",
    "MonthClaimed",
    "WeekOfMonthClaimed",
    "Fault",

    "PoliceReportFiled",
    "WitnessPresent",
    "AgentType",
    "NumberOfSuppliments"
]


# =========================================================
# 4. CHECK FEATURES
# =========================================================

missing_features = [col for col in FEATURES if col not in df.columns]

if missing_features:
    print("\nMissing features:")
    print(missing_features)
    raise ValueError("Dataset columns do not match expected columns.")


X = df[FEATURES]
y = df["FraudFound"]


# =========================================================
# 5. IDENTIFY DATA TYPES
# =========================================================

categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numeric_features = X.select_dtypes(
    exclude=["object"]
).columns.tolist()

print("\nCategorical features:")
print(categorical_features)

print("\nNumeric features:")
print(numeric_features)


# =========================================================
# 6. PREPROCESSING
# =========================================================

numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]
)


categorical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)


preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            numeric_pipeline,
            numeric_features
        ),
        (
            "categorical",
            categorical_pipeline,
            categorical_features
        )
    ]
)


# =========================================================
# 7. TRAIN / TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))


# =========================================================
# 8. MODELS
# =========================================================

models = {

    "Logistic Regression":
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced"
        ),

    "Decision Tree":
        DecisionTreeClassifier(
            random_state=42,
            class_weight="balanced",
            max_depth=12
        ),

    "Random Forest":
        RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1,
            max_depth=20
        )
}


# =========================================================
# 9. TRAIN AND COMPARE MODELS
# =========================================================

results = {}

print("\n")
print("=" * 70)
print("MODEL COMPARISON")
print("=" * 70)

for model_name, model in models.items():

    print("\nTraining:", model_name)

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model)
        ]
    )

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    probabilities = pipeline.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    precision = precision_score(
        y_test,
        predictions,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0
    )

    roc_auc = roc_auc_score(
        y_test,
        probabilities
    )

    results[model_name] = {
        "pipeline": pipeline,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "roc_auc": roc_auc
    }

    print("\n", model_name)
    print("-" * 40)
    print("Accuracy :", round(accuracy, 4))
    print("Precision:", round(precision, 4))
    print("Recall   :", round(recall, 4))
    print("F1 Score :", round(f1, 4))
    print("ROC-AUC  :", round(roc_auc, 4))

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            predictions,
            target_names=[
                "Not Fraud",
                "Fraud"
            ],
            zero_division=0
        )
    )


# =========================================================
# 10. SELECT MODEL
#
# Fraud F1 score is used because our dataset is highly
# imbalanced and accuracy alone can be misleading.
# =========================================================

best_model_name = max(
    results,
    key=lambda name: results[name]["f1"]
)

best_pipeline = results[
    best_model_name
]["pipeline"]


print("\n")
print("=" * 70)
print("SELECTED MODEL")
print("=" * 70)

print("Model:", best_model_name)
print(
    "F1 Score:",
    round(
        results[best_model_name]["f1"],
        4
    )
)


# =========================================================
# 11. SAVE MODEL
# =========================================================

MODEL_DIR = "model"

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "fraud_model.joblib"
)

joblib.dump(
    best_pipeline,
    MODEL_PATH
)


print("\nModel saved successfully:")
print(MODEL_PATH)

print("\n")
print("=" * 70)
print("TRAINING COMPLETED")
print("=" * 70)