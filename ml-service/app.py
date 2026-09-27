from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os

app = Flask(__name__)

# ---------------------------------------------------------
# Load trained ML model
# ---------------------------------------------------------

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model",
    "fraud_detection_model.joblib"
)

model = joblib.load(MODEL_PATH)

print("ML model loaded successfully!")


# ---------------------------------------------------------
# Dataset feature columns
# ---------------------------------------------------------

FEATURE_COLUMNS = [
    "Month",
    "WeekOfMonth",
    "DayOfWeek",
    "Make",
    "AccidentArea",
    "DayOfWeekClaimed",
    "MonthClaimed",
    "WeekOfMonthClaimed",
    "Sex",
    "MaritalStatus",
    "Age",
    "Fault",
    "PolicyType",
    "VehicleCategory",
    "VehiclePrice",
    "PolicyNumber",
    "RepNumber",
    "Deductible",
    "DriverRating",
    "Days:Policy-Accident",
    "Days:Policy-Claim",
    "PastNumberOfClaims",
    "AgeOfVehicle",
    "AgeOfPolicyHolder",
    "PoliceReportFiled",
    "WitnessPresent",
    "AgentType",
    "NumberOfSuppliments",
    "AddressChange-Claim",
    "NumberOfCars",
    "Year",
    "BasePolicy"
]


# ---------------------------------------------------------
# API field names -> Dataset field names
# ---------------------------------------------------------

FIELD_MAPPING = {
    "Days_Policy_Accident": "Days:Policy-Accident",
    "Days_Policy_Claim": "Days:Policy-Claim",
    "AddressChange_Claim": "AddressChange-Claim"
}


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ML service is running"
    })


# ---------------------------------------------------------
# Prediction Endpoint
# ---------------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Get JSON request
        data = request.get_json()

        # Check empty request
        if not data:
            return jsonify({
                "error": "Request body is empty"
            }), 400


        # -------------------------------------------------
        # Convert API field names to dataset field names
        # -------------------------------------------------

        for api_name, dataset_name in FIELD_MAPPING.items():

            if api_name in data:
                data[dataset_name] = data.pop(api_name)


        # -------------------------------------------------
        # Check required fields
        # -------------------------------------------------

        missing_fields = []

        for field in FEATURE_COLUMNS:

            if field not in data:
                missing_fields.append(field)


        if missing_fields:

            return jsonify({
                "error": "Missing required fields",
                "fields": missing_fields
            }), 400


        # -------------------------------------------------
        # Create DataFrame
        # -------------------------------------------------

        df = pd.DataFrame([data])


        # -------------------------------------------------
        # Keep columns in exactly the same order
        # as the training dataset
        # -------------------------------------------------

        df = df[FEATURE_COLUMNS]


        # -------------------------------------------------
        # Make prediction
        # -------------------------------------------------

        prediction = model.predict(df)[0]


        # -------------------------------------------------
        # Fraud probability
        # -------------------------------------------------

        probability = 0.0

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(df)[0]

            # Find probability of Fraud class
            if hasattr(model, "classes_"):

                classes = list(model.classes_)

                if 1 in classes:
                    fraud_index = classes.index(1)
                    probability = probabilities[fraud_index]

                elif "Yes" in classes:
                    fraud_index = classes.index("Yes")
                    probability = probabilities[fraud_index]

                else:
                    probability = max(probabilities)

            else:
                probability = max(probabilities)


        # -------------------------------------------------
        # Convert prediction to readable result
        # -------------------------------------------------

        if prediction == 1 or str(prediction).lower() == "yes":
            result = "Fraud"
        else:
            result = "Not Fraud"


        # -------------------------------------------------
        # Return response
        # -------------------------------------------------

        return jsonify({
            "prediction": result,
            "fraud_probability": round(float(probability), 4)
        })


    except Exception as e:

        print("Prediction Error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# ---------------------------------------------------------
# Start Flask Server
# ---------------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )