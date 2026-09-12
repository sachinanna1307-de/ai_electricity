let isRegisterMode = false;

let autoInterval = null;

let consumptionHistory = [];



const firebaseURL = "https://smart-electricity-d5293-default-rtdb.firebaseio.com/eb_units.json";

let firebaseInterval = null;



// Password Show/Hide Toggle Function

function togglePasswordVisibility() {

let passInput = document.getElementById("password");

let eyeIcon = document.getElementById("eyeIcon");

if (passInput.type === "password") {

passInput.type = "text";

eyeIcon.innerText = "🙈";

} else {

passInput.type = "password";

eyeIcon.innerText = "👁️";

}

}



function toggleAuthMode() {

isRegisterMode = !isRegisterMode;

let title = document.getElementById("authTitle");

let subtitle = document.getElementById("authSubtitle");

let btn = document.getElementById("authBtn");

let switchText = document.getElementById("switchText");

let msg = document.getElementById("loginMessage");



msg.innerText = "";

if (isRegisterMode) {

title.innerText = "Register Profile";

subtitle.innerText = "Create new IoT portal account";

btn.innerText = "Register Account";

switchText.innerText = "Existing User? Login here";

} else {

title.innerText = "IoT EB Portal";

subtitle.innerText = "Secure Login to Live Grid Monitor";

btn.innerText = "Login to Dashboard";

switchText.innerText = "New User? Register Profile";

}

}



function handleAuth() {

let user = document.getElementById("username").value.trim();

let pass = document.getElementById("password").value.trim();

let msg = document.getElementById("loginMessage");



if (user === "" || pass === "") {

msg.style.color = "#f87171";

msg.innerText = "⚠️ Fill in all details!";

return;

}



if (isRegisterMode) {

if (localStorage.getItem(user)) {

msg.style.color = "#f87171";

msg.innerText = "⚠️ User already exists!";

return;

}

localStorage.setItem(user, pass);

msg.style.color = "#34d399";

msg.innerText = "✅ Registered successfully! Please login.";

setTimeout(() => toggleAuthMode(), 1200);

} else {

let savedPass = localStorage.getItem(user);

if ((user === "admin" && pass === "admin123") || savedPass === pass) {

msg.style.color = "#34d399";

msg.innerText = "✅ Access Granted!";

setTimeout(() => {

document.getElementById("loginPage").style.display = "none";

document.getElementById("dashboard").style.display = "block";

}, 600);

} else {

msg.style.color = "#f87171";

msg.innerText = "❌ Incorrect Credentials!";

}

}

}



function logout() {

if (autoInterval) clearInterval(autoInterval);

if (firebaseInterval) {

clearInterval(firebaseInterval);

firebaseInterval = null;

}

document.getElementById("dashboard").style.display = "none";

document.getElementById("loginPage").style.display = "flex";

document.getElementById("username").value = "";

document.getElementById("password").value = "";

document.getElementById("loginMessage").innerText = "";

}



// TN Slab Tariff Calculation

function calculateTNSlabBill(units) {

let bill = 0;

if (units <= 100) {

bill = 0;

} else if (units <= 200) {

bill = (units - 100) * 2.25;

} else if (units <= 500) {

bill = (100 * 2.25) + ((units - 200) * 4.50);

} else {

bill = (100 * 2.25) + (300 * 4.50) + ((units - 500) * 6.00);

}

return Math.round(bill);

}



function checkUnits() {

let units = Number(document.getElementById("unitInput").value);

if (isNaN(units) || units < 0) return;



let now = new Date();

let dateStr = now.toISOString().split('T')[0];

let timeStr = now.toTimeString().split(' ')[0].substring(0, 5);


consumptionHistory.push({ date: dateStr, time: timeStr, units: units });



let nextAlert = Math.ceil(units / 2) * 2;

if (units % 2 === 0) nextAlert = units + 2;

let remaining = nextAlert - units;



let estimatedBill = calculateTNSlabBill(units);



if (units > 0 && (units % 2 === 0 || remaining === 0)) {

let alarm = document.getElementById("alarmSound");

if (alarm) {

alarm.currentTime = 0;

alarm.play().catch(e => console.log("Audio play blocked"));

}

document.getElementById("status").style.color = "#f87171";

document.getElementById("status").innerText = `🚨 ALARM: ${units} Units Reached! Sound Alert Triggered.`;

} else {

document.getElementById("status").style.color = "#34d399";

document.getElementById("status").innerText = `💡 Normal Operation. ${remaining} Units remaining to next milestone.`;

}



if(document.getElementById("currentUnits")) document.getElementById("currentUnits").innerText = units + " Units";

if(document.getElementById("estimatedBill")) document.getElementById("estimatedBill").innerText = "Estimated Bill: ₹" + estimatedBill;

if(document.getElementById("nextAlert")) document.getElementById("nextAlert").innerText = nextAlert + " Units";

if(document.getElementById("remainingUnits")) document.getElementById("remainingUnits").innerText = remaining + " Units";


if(document.getElementById("cardCurrent")) document.getElementById("cardCurrent").innerText = units + " Units";

if(document.getElementById("cardBill")) document.getElementById("cardBill").innerText = "₹" + estimatedBill;

if(document.getElementById("cardNext")) document.getElementById("cardNext").innerText = nextAlert + " Units";

if(document.getElementById("cardRemaining")) document.getElementById("cardRemaining").innerText = remaining + " Units";



if(document.getElementById("totalUnitsDisplay")) document.getElementById("totalUnitsDisplay").innerText = units + " Units";


let todayRecords = consumptionHistory.filter(item => item.date === dateStr);

let todayUsed = todayRecords.length > 0 ? todayRecords[todayRecords.length - 1].units - todayRecords[0].units : 0;

if(document.getElementById("todayUnitsDisplay")) document.getElementById("todayUnitsDisplay").innerText = todayUsed + " Units";



let percentage = (units % 2) === 0 ? 100 : 50;

if(document.getElementById("progressBar")) document.getElementById("progressBar").style.width = percentage + "%";

}



function checkDateRange() {

let start = document.getElementById("startDate").value;

let end = document.getElementById("endDate").value;


if(!start || !end) {

alert("Please select both start and end dates!");

return;

}



let filtered = consumptionHistory.filter(item => item.date >= start && item.date <= end);

let sumUnits = filtered.reduce((acc, curr) => acc + curr.units, 0);


if(document.getElementById("rangeResult")) {

document.getElementById("rangeResult").innerText = `📊 Units consumed between ${start} and ${end}: ${sumUnits} Units`;

}

}



function checkTimeRange() {

let sTime = document.getElementById("startTime").value;

let eTime = document.getElementById("endTime").value;



if(!sTime || !eTime) {

alert("Please select start and end time!");

return;

}



let todayStr = new Date().toISOString().split('T')[0];

let filteredTime = consumptionHistory.filter(item => item.date === todayStr && item.time >= sTime && item.time <= eTime);

let timeUnits = filteredTime.reduce((acc, curr) => acc + curr.units, 0);



if(document.getElementById("timeResult")) {

document.getElementById("timeResult").innerText = `⏰ Units consumed between ${sTime} and ${eTime}: ${timeUnits} Units`;

}

}



function toggleAutoSimulation() {

let autoBtn = document.querySelector(".auto-btn");

if (autoInterval) {

clearInterval(autoInterval);

autoInterval = null;

if(autoBtn) {

autoBtn.innerText = "🤖 Toggle IoT Live Mode";

autoBtn.style.background = "#10b981";

}

alert("IoT Live Simulation Stopped.");

} else {

if(autoBtn) {

autoBtn.innerText = "⏹️ Stop Simulation";

autoBtn.style.background = "#ef4444";

}

alert("IoT Live Simulation Started!");


let currentVal = Number(document.getElementById("unitInput").value) || 0;

autoInterval = setInterval(() => {

currentVal += 1;

document.getElementById("unitInput").value = currentVal;

checkUnits();

}, 2000);

}

}



function fetchFirebaseData() {

fetch(firebaseURL)

.then(response => response.json())

.then(data => {

if (data !== null) {

let val = (typeof data === 'object' && data.units !== undefined) ? data.units : data;

if(val !== undefined && !isNaN(val)) {

document.getElementById("unitInput").value = val;

checkUnits();

}

}

})

.catch(error => console.log("Firebase Fetch Error:", error));

}



function toggleESP32LiveSync() {

let btn = document.getElementById("syncBtn");

if (firebaseInterval) {

clearInterval(firebaseInterval);

firebaseInterval = null;

if(btn) {

btn.innerText = "🔄 Connect ESP32 Live Data";

btn.style.background = "#3b82f6";

}

alert("Cloud Live Sync Stopped.");

} else {

alert("Cloud Live Sync Started! Syncing from Firebase.");

if(btn) {

btn.innerText = "⏹️ Stop Cloud Sync";

btn.style.background = "#ef4444";

}

firebaseInterval = setInterval(fetchFirebaseData, 3000);

}

} 

