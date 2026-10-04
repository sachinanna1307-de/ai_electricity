# ⚡ Smart Electricity Usage – IoT Grid Platform & Dashboard

A comprehensive, real-time IoT electricity monitoring and management dashboard designed for residential consumers. The application integrates smart meter simulation, progressive tariff slab bill calculations, artificial intelligence for consumption forecasting, statistical anomaly detection, historical analytics, and personalized energy-saving suggestions.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Setup & Running Locally](#-setup--running-locally)

---

## 🌟 Project Overview
Domestic electricity bills in states like Tamil Nadu (TANGEDCO) follow progressive multi-tier tariff slabs. Consumers often unknowingly cross critical threshold boundaries (e.g., 100, 200, 400, 500 units), resulting in sudden steep billing jumps. 

This platform bridges the information gap between the utility meter and the consumer by providing:
- Real-time unit tracking and visual progressive gauge indicators.
- Instant progressive slab breakdown calculations.
- Machine learning-driven consumption forecasts and trend alerts.
- Automated anomaly detection for abnormal consumption surges.
- Actionable, personalized AI energy-saving recommendations based on actual usage patterns.

---

## 🚀 Key Features

### 1. Smart Meter Control & Real-Time Visualization
- Direct simulated sensor reading input or live cloud feed via ESP32 / IoT microcontrollers.
- Circular SVG gauge with real-time percentage indicators and threshold warnings.
- Continuous progress bar towards the upcoming 100-unit milestone limit.

### 2. Progressive Tariff Slab Calculation (TANGEDCO Model)
- **0–100 Units:** Free tier (₹0.00/unit)
- **101–400 Units:** ₹4.95/unit (capacity: 300 units)
- **401–500 Units:** ₹6.65/unit (capacity: 100 units)
- **501–600 Units:** ₹8.80/unit (capacity: 100 units)
- **601–800 Units:** ₹9.95/unit (capacity: 200 units)
- **801–1000 Units:** ₹11.05/unit (capacity: 200 units)
- **Above 1000 Units:** ₹12.15/unit
- Transparent modal and inline breakdowns for every active slab.

### 3. AI Consumption Prediction
- Mathematical rolling average model evaluating historical consumption entries.
- Computes **Predicted Monthly Consumption** (units and estimated tariff bill).
- Determines dynamic **Trend Direction**: Increasing (↗), Stable (→), or Decreasing (↘).
- **Graceful Fallback:** Displays *"More data is required for a reliable prediction."* when fewer than 3 records exist.

### 4. Abnormal Usage Detection
- Dynamic statistical anomaly detection comparing incoming readings against the user's historical baseline average and unit delta jumps ($\ge 1.5\times$ baseline and $\ge 15$ units delta).
- Displays prominent warning banner: *"Abnormal consumption detected. Your usage is higher than your normal pattern."*
- Operates concurrently with the existing 100-unit milestone alarm system.

### 5. Consumption History & Trends Chart
- Interactive Chart.js visualizer with filter toggles:
  - **Daily Trend:** Recent day-by-day consumption breakdown.
  - **Monthly Trend:** 12-month calendar consumption trajectory.
  - **Timeline Logs:** Chronological sequential readings.
- Persistent local storage (`smart_eb_consumption_history`) ensuring history survives across sessions.

### 6. AI Energy-Saving Suggestions
- Contextual intelligence housed in the **Energy Saving Tips** section.
- Analyzes actual consumption data to produce 2–3 personalized, actionable suggestions:
  - *Increasing Trend:* Alerts users to high-power draws and recommends load shifting.
  - *High Usage:* Pinpoints phantom standby loads and heavy appliance cooling settings (24°C recommendation).
  - *Optimal Range:* Reinforces healthy consumption habits to preserve subsidized tiers.
- **Graceful Fallback:** Displays *"More usage data is required to provide personalized suggestions."* when insufficient data (< 2 records) is available.

### 7. Secure Authentication & User Profiles
- Firebase Authentication with email/password and Google Sign-In support.
- Demo Administrator credentials (`admin` / `admin123`) for rapid testing.
- Strict session gatekeeping ensuring the Login Screen always appears first prior to dashboard access.

---

## 🛠 Technology Stack
- **Frontend UI:** HTML5, Modern CSS3 (Glassmorphism, CSS Custom Properties, Dark Mode support).
- **Client Logic:** Vanilla JavaScript (ES6+ modular architecture).
- **Data Visualization:** Chart.js (v4.4.1).
- **Authentication & Backend:** Firebase Authentication (v10.8.0), Firebase Realtime Database.
- **Local Persistence:** Browser `localStorage` API.

---

## 💻 Setup & Running Locally

1. Clone or download the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/Smart-Electricity-App.git
   cd Smart-Electricity-App
   ```

2. Open the project in any modern web browser:
   - Double-click `index.html`, or
   - Use VS Code Live Server / PowerShell HTTP server:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scratch/serve.ps1
     ```

3. Log in using either:
   - **Demo Credentials:**
     - **Email / Username:** `admin` or `admin@gmail.com`
     - **Password:** `admin123`
   - **Firebase Credentials:** Sign up with your personal email or use Google Sign-In.
