const userRole = localStorage.getItem("userRole");

if (userRole !== 'admin') {
    // Redirect them to login if they aren't an admin
    window.location.href = "../index.html"; 
}

const adminHeaders = {
    "Content-Type": "application/json",
    "role": "admin"
};

let total_Users = document.getElementById('totalUsers');
let total_Questions = document.getElementById('totalQuestions');
let live_Questions = document.getElementById('liveQuestions');
let total_Predictions = document.getElementById('totalPredictions');

async function loadUsersCount() {
    const response = await fetch("http://localhost:8000/NoOfUsers", {
        headers: adminHeaders
    });

    const data = await response.json();
    total_Users.innerHTML = data.total_Users;
};

async function loadQuestionsCount() {
    const response = await fetch("http://localhost:8000/NoOfQuestions", {
        headers: adminHeaders
    });

    const data = await response.json();
    total_Questions.innerHTML = data.total_Questions;
};

async function loadLiveQuestionsCount() {
    const response = await fetch("http://localhost:8000/NoOfLiveQuestions", {
        headers: adminHeaders
    });

    const data = await response.json();
    live_Questions.innerHTML = data.Live_Questions;
};

async function loadTotalPredictions() {
    const response = await fetch("http://localhost:8000/NoOfTotalPredictions", {
        headers: adminHeaders
    });

    const data = await response.json();
    total_Predictions.innerHTML = data.Total_Predictions;
};

loadUsersCount();
loadQuestionsCount();
loadLiveQuestionsCount();
loadTotalPredictions();

const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', async () => {
    window.location.href = "index.html";
});
