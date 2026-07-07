let total_Users = document.getElementById('totalUsers');
let total_Questions = document.getElementById('totalQuestions');
let live_Questions = document.getElementById('liveQuestions');
let total_Predictions = document.getElementById('totalPredictions');

async function loadUsersCount() {
    const response = await fetch("http://localhost:8000/NoOfUsers");

    const data = await response.json();
    total_Users.innerHTML = data.total_Users;
};

async function loadQuestionsCount() {
    const response = await fetch("http://localhost:8000/NoOfQuestions");

    const data = await response.json();
    total_Questions.innerHTML = data.total_Questions;
};

async function loadLiveQuestionsCount() {
    const response = await fetch("http://localhost:8000/NoOfLiveQuestions");

    const data = await response.json();
    live_Questions.innerHTML = data.Live_Questions;
};

async function loadTotalPredictions() {
    const response = await fetch("http://localhost:8000/NoOfTotalPredictions");

    const data = await response.json();
    total_Predictions.innerHTML = data.Total_Predictions;
};

loadUsersCount();
loadQuestionsCount();
loadLiveQuestionsCount();
loadTotalPredictions();
