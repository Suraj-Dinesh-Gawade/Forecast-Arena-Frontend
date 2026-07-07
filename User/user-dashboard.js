const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "index.html";
};

fetch(`http://localhost:8000/user/${userId}`)
.then(response => response.json())
.then(data => {
    document.getElementById("welcome-name").innerText =
        `Welcome Back, ${data.name} 👋`;
    
    document.getElementById("proName").innerText = data.name;
    
    let rankData = document.querySelectorAll('.u_Rank')
        rankData.forEach(element => {
            element.innerText = data.user_rank;
        });

    document.getElementById("u_Accuracy").innerText = `${data.accuracy ?? 0}%`;
  
    let coins = document.getElementsByClassName('curr_coins');
    for (let coin of coins) {
        if (coin.querySelector('#coins')) {
            coin.innerHTML = `${data.coins} <b id="coins">Coins</b>`;
        }
        else {
            coin.innerText = data.coins;
        }
    }; 
})
.catch(err => {
    console.log("Error loading user profile : ", err);
});

fetch(`http://localhost:8000/TotalBets/${userId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("t_Bets").innerText = data.total_bets ?? 0;
    }).catch(err => {
        console.log("Error loading user prediction statistics : ", err);
    });

// Logout Button 
fetch("http://localhost:8000/LatestQuestion")
    .then(response => {
        if (!response.ok) throw new Error("Network error loading featured market.");
        return response.json();
    })
    .then(data => {
        const questionTextEl = document.getElementById("latestQue");
        const timerElement = document.getElementById("countdown-timer");

        if (data.noQuestions) {
            if (questionTextEl) questionTextEl.innerText = "No featured matches running right now. Check back soon!";
            if (timerElement) {
                timerElement.innerText = "Closed";
                timerElement.style.color = "#888";
            }
            return;
        }
        
        if (questionTextEl) questionTextEl.innerText = data.question;
        
        // Start the dynamic timer countdown!
        startCountdown(data.End_Time || data.end_time);
    })
    .catch(err => {
        console.warn(err.message);
        const questionTextEl = document.getElementById("latestQue"); // FIXED: Unified ID target to prevent undefined updates
        const timerElement = document.getElementById("countdown-timer");
        if (questionTextEl) questionTextEl.innerText = "No featured matches running right now. Check back soon!";
        if (timerElement) timerElement.innerText = "Closed";
    });

// Dynamic Countdown Engine
function startCountdown(endTimeString) {
    const timerElement = document.getElementById("countdown-timer");
    if (!timerElement || !endTimeString) return;

    const targetTime = new Date(endTimeString).getTime();

    const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const difference = targetTime - currentTime;

        // If the countdown is finished, stop the timer
        if (difference <= 0) {
            clearInterval(interval);
            timerElement.innerText = "Prediction Closed!";
            timerElement.style.color = "#dc3545"; // Red color indicator
            return;
        }

        // Calculate Days, Hours, Minutes, and Seconds left
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Build a readable time-remaining string
        if (days > 0) {
            timerElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
        } else {
            timerElement.innerText = `${hours}h ${minutes}m ${seconds}s left`;
        }
    }, 1000);
}

// 4. SAFE LOGOUT BUTTON
// FIXED: Wrapped inside an absolute null safety check so it doesn't block the fetches below it

const logoutButton = document.getElementById('logout-btn');

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        window.location.href = "index.html"; 
    });
}