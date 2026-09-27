@echo off
title Vehicle Insurance Fraud Detection

echo ==========================================
echo   VEHICLE INSURANCE FRAUD DETECTION
echo ==========================================
echo.

echo Starting ML Service...
start "ML Service - Flask" cmd /k "cd /d D:\vehicle-insurance-fraud-detection\ml-service && venv\Scripts\python.exe app.py"

timeout /t 3 /nobreak >nul

echo Starting Spring Boot Backend...
start "Backend - Spring Boot" cmd /k "cd /d D:\vehicle-insurance-fraud-detection\backend && mvnw.cmd spring-boot:run"

timeout /t 5 /nobreak >nul

echo Starting React Frontend...
start "Frontend - React" cmd /k "cd /d D:\vehicle-insurance-fraud-detection\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening application...
start http://localhost:5173

echo.
echo ==========================================
echo   ALL SERVICES STARTED
echo ==========================================
echo.
echo ML Service : http://127.0.0.1:5000
echo Backend    : http://localhost:8080
echo Frontend   : http://localhost:5173
echo.
pause