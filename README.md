\# Vehicle Insurance Fraud Detection Using Machine Learning



A full-stack decision-support application that analyzes automobile insurance claims and predicts whether a claim is likely to be \*Fraud\* or \*Not Fraud\* using Machine Learning and predefined fraud detection rules.



The system combines a React frontend, Spring Boot backend, Python Machine Learning service, MySQL database, and a rule engine.



\---



\## Project Overview



Insurance fraud can cause significant financial losses for insurance companies. This project provides a system that analyzes historical automobile insurance claim data and produces a statistical fraud prediction.



The application provides:



\- Machine Learning based fraud prediction

\- Fraud probability

\- Rule-based suspicious claim detection

\- Risk indicators

\- Interactive claim analysis form

\- Full-stack integration between React, Spring Boot and Python

\- One-click project startup



> \*Important:\* This application is a statistical decision-support tool. A fraud prediction is not proof of fraud and requires human investigation.



\---



\## System Architecture



```text

&#x20;                   ┌──────────────────────┐

&#x20;                   │      React UI        │

&#x20;                   │     Frontend         │

&#x20;                   │      Port 5173       │

&#x20;                   └──────────┬───────────┘

&#x20;                              │

&#x20;                              │ REST API

&#x20;                              ▼

&#x20;                   ┌──────────────────────┐

&#x20;                   │    Spring Boot       │

&#x20;                   │      Backend         │

&#x20;                   │      Port 8080       │

&#x20;                   └──────────┬───────────┘

&#x20;                              │

&#x20;                ┌─────────────┴─────────────┐

&#x20;                │                           │

&#x20;                ▼                           ▼

&#x20;      ┌──────────────────┐       ┌──────────────────┐

&#x20;      │ Python ML Service │       │   Rule Engine    │

&#x20;      │     Flask        │       │  Spring Boot     │

&#x20;      │    Port 5000     │       │                  │

&#x20;      └────────┬─────────┘       └──────────────────┘

&#x20;               │

&#x20;               ▼

&#x20;      ┌──────────────────┐

&#x20;      │ Trained ML Model │

&#x20;      │     Joblib       │

&#x20;      └──────────────────┘



&#x20;                   ┌──────────────────────┐

&#x20;                   │       MySQL          │

&#x20;                   │      Database        │

&#x20;                   └──────────────────────┘

&#x20;  Technologies Used

Frontend

React

Vite

JavaScript

HTML

CSS

Backend

Java

Spring Boot

REST API

Maven

Java HttpClient

Machine Learning

Python

Flask

Pandas

NumPy

Scikit-learn

Joblib

Database

MySQL

Development Tools

Git

GitHub

Visual Studio Code

Eclipse

Dataset

The project uses the automobile insurance claim dataset containing:

15,420 insurance claim records

32 input features

FraudFound as the target variable

Target values:

Yes → Fraud

No  → Not Fraud

The dataset is stored at:

ml-service/dataset/carclaims.csv

Main Features

1\. Claim Analysis

Users can enter information about:

Vehicle

Policy

Policyholder

Accident/Claim

Supporting evidence

and submit the claim for analysis.

2\. Machine Learning Prediction

The ML service analyzes the claim and returns:

Prediction

Fraud probability

Example:

Prediction: Not Fraud

Fraud Probability: 37.34%

3\. Rule Engine

The Spring Boot backend checks predefined suspicious patterns.

Current indicators include:

No Police Report

No Witness Present

External Agent

4\. Risk Indicators

The application displays detected rule-based risk indicators along with the ML result.

5\. Decision Support

The final result combines:

ML Prediction

&#x20;     +

Fraud Probability

&#x20;     +

Rule Engine Flags

&#x20;     =

Claim Risk Information

Project Structure

vehicle-insurance-fraud-detection/

│

├── backend/

│   ├── src/

│   ├── pom.xml

│   └── mvnw.cmd

│

├── frontend/

│   ├── src/

│   ├── public/

│   ├── package.json

│   └── vite.config.js

│

├── ml-service/

│   ├── dataset/

│   │   └── carclaims.csv

│   │

│   ├── model/

│   │   └── fraud\_detection\_model.joblib

│   │

│   ├── app.py

│   └── train\_model.py

│

├── database/

│

├── start-project.bat

├── .gitignore

└── README.md

How to Run the Project

Option 1 — One-Click Startup

The easiest way to start the complete application is:

start-project.bat

From the project directory:

cd D:\\vehicle-insurance-fraud-detection

.\\start-project.bat

The script starts:

ML Service     → http://127.0.0.1:5000

Backend        → http://localhost:8080

Frontend       → http://localhost:5173

The frontend will automatically open in the browser.

Manual Startup

If you want to run each service separately:

1\. Start ML Service

Open a terminal:

cd D:\\vehicle-insurance-fraud-detection\\ml-service

venv\\Scripts\\activate

python app.py

ML service:

http://127.0.0.1:5000

Health check:

http://127.0.0.1:5000/health

2\. Start Spring Boot Backend

Open another terminal:

cd D:\\vehicle-insurance-fraud-detection\\backend

.\\mvnw.cmd spring-boot:run

Backend:

http://localhost:8080

Claim analysis endpoint:

POST /api/claims/analyze

3\. Start React Frontend

Open another terminal:

cd D:\\vehicle-insurance-fraud-detection\\frontend

npm install

npm run dev

Frontend:

http://localhost:5173

npm install is normally required only after cloning the project or when dependencies change.

ML Service Setup

Create and activate the Python virtual environment:

cd ml-service

py -3.13 -m venv venv

venv\\Scripts\\activate

Install the required packages:

pip install pandas numpy scikit-learn joblib flask

The trained model is already included in:

ml-service/model/fraud\_detection\_model.joblib

Therefore, normal application startup does not require model training.

Model Training

If the model needs to be retrained:

cd ml-service

venv\\Scripts\\activate

python train\_model.py

The training script uses:

ml-service/dataset/carclaims.csv

and generates the trained model used by the Flask prediction service.

API Flow

The claim analysis flow is:

React Frontend

&#x20;     │

&#x20;     ▼

POST /api/claims/analyze

&#x20;     │

&#x20;     ▼

Spring Boot Backend

&#x20;     │

&#x20;     ├──────────────► Rule Engine

&#x20;     │

&#x20;     ▼

Python ML Service

&#x20;     │

&#x20;     ▼

Machine Learning Model

&#x20;     │

&#x20;     ▼

Prediction + Probability

&#x20;     │

&#x20;     ▼

Spring Boot

&#x20;     │

&#x20;     ▼

React Result Dashboard

Example Result

A claim analysis may return information such as:

Prediction:

Not Fraud



Fraud Probability:

37.34%



Rule Engine Flags:

\- No Police Report

\- No Witness Present

\- External Agent



Risk Indicator Count:

3

The exact prediction and probability depend on the submitted claim data and trained model.

Important Disclaimer

This project is intended for educational and decision-support purposes.

A Machine Learning prediction does not establish that an insurance claim is fraudulent.

All predictions and rule-engine indicators should be reviewed by a qualified human investigator before any real-world decision is made.

Future Improvements

Possible future enhancements include:

Model performance dashboard

Additional classification algorithms

Model comparison metrics

Improved class-imbalance handling

Authentication and authorization

Claim history management

Advanced analytics

Deployment to cloud infrastructure

Automated model retraining



