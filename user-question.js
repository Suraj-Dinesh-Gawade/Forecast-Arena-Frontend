const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "index.html";
}

function formatToReadableDate(endTimeString) {
  if (!endTimeString) return "No deadline";

  const date = new Date(endTimeString);

  // Safety check: if the date is invalid, return placeholder
  if (isNaN(date.getTime())) {
    return "No deadline";
  }

  // Month names array to get the short name (e.g., "Jun")
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Format hours, minutes, and AM/PM
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  // Combine into a beautiful clean string: "Jun 13, 2026 - 07:51 AM"
  return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
}

let allQuestions = [];

async function loadQuestionData() {
  const questionsContainer = document.getElementById("questions-container");
  if (!questionsContainer) return;

  try {
    const response = await fetch("http://localhost:8000/QuestionData");
    if (!response.ok) throw new Error("HTTP Status Error : " + response.status);

   const data = await response.json();
    
    // 1. SAFETY CHECK: If the server returned an error payload wrapped inside a 200 OK status
    if (data && data.Error) {
        throw new Error(data.Error);
    }
    
    // 2. DOUBLE-GUARD ARRAY CHECK: Instantly wrap a single object into an array [data] safely
    allQuestions = Array.isArray(data) ? data : (data ? [data] : []);
         renderQuestions(allQuestions);
      
    // const questionsList = await response.json();
    // if (questionsList.length === 0) {
    //   questionsContainer.innerHTML =
    //     '<p class="no-questions">No active questions available right now.</p>';
    //   return;
    // }
    // let containerHTML = "";

    // for (let data of questionsList) {
    //   // Format the unique end time for this specific question
    //   const formattedDate = formatToReadableDate(data.End_Time || data.endTime);

    //   // Append cards dynamically using template literals
    //   containerHTML += `
    //             <div class="question-card" data-id="${data.q_id}">
    //                 <span class="category">${data.Category || data.category || "General"}</span>
    //                 <h2 class="question-text">${data.question}</h2>
    //                 <p class="deadline">⏳ ${formattedDate}</p>
                    
    //                 <div class="odds-container">
    //                     <button class="bet-btn yes-btn" data-id="${data.q_id}">
    //                         <span>YES</span>
    //                         <strong>${data.yesOdds || "1.8"}x</strong>
    //                     </button>
    //                     <button class="bet-btn no-btn" data-id="${data.q_id}">
    //                         <span>NO</span>
    //                         <strong>${data.noOdds || "1.8"}x</strong>
    //                     </button>
    //                 </div>

    //                 <div class="bet-input-box">
    //                     <input type="number" class="coin-input" placeholder="Enter Coins..." id="coins-input-${data.q_id}" min="1">
    //                     <button class="place-bet-btn" data-id="${data.q_id}">Place Prediction</button>
    //                 </div>
    //             </div>
    //         `;
    // }
    // questionsContainer.innerHTML = containerHTML;
    // attachPredictionListeners();
  } catch (err) {
    console.error("Error loading live question data : ", err);
    questionsContainer.innerHTML = `
            <p class="error-message" style="color: #ff3b30; text-align: center;">
                Unable to connect to predictive arena markets. Please try again later.
            </p>
        `;
  }
}

function renderQuestions(questionList) {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) return;

  
  if (!Array.isArray(questionList)) {
    questionsContainer.innerHTML =
      '<p class="no-questions" style="text-align:center; color: #888; padding:40px; background:rgba(255,255,255,0.05); border-radius:8px;">No active questions available right now.</p>';
    return;
  }
    // if (questionList.length === 0) {
    //   questionsContainer.innerHTML =
    //     '<p class="no-questions">No active questions available right now.</p>';
    //   return;
  // }
  
  const activeQuestions = questionList.filter(q => {
    if (!q.q_id || !q.question) return false;

    const text = q.question.trim().toLowerCase();
    return text !== "no active questions available right now " && text !== "no active questions available";
  });

      if (activeQuestions.length === 0) {
        questionsContainer.innerHTML =
          '<p class="no-questions" style="text-align:center; color: #888; padding:40px; background:rgba(255,255,255,0.05); border-radius:8px;">No active questions available right now.</p>';
        return;
  }
  
    let containerHTML = "";

    for (let data of activeQuestions) {
      // Format the unique end time for this specific question
      const formattedDate = formatToReadableDate(data.End_Time || data.endTime);

      const rawOptionOne = data.Odd_One || data.odd_one;
      const optionOne = (rawOptionOne && String(rawOptionOne).toLowerCase() !== "undefined" && String(rawOptionOne).toLowerCase() !== "null") 
          ? rawOptionOne 
          : "YES";

      const rawOptionTwo = data.Odd_Two || data.odd_two;
      const optionTwo = (rawOptionTwo && String(rawOptionTwo).toLowerCase() !== "undefined" && String(rawOptionTwo).toLowerCase() !== "null") 
          ? rawOptionTwo 
          : "NO";

      const yesOdds = data.yes_odds || data.Yes_Odds || data.yesOdds || "1.8";
      const noOdds = data.no_odds || data.No_Odds || data.noOdds || "1.8";

      // Append cards dynamically using template literals
      containerHTML += `
                <div class="question-card" data-id="${data.q_id}">
                    <span class="category">${data.Category || data.category || "General"}</span>
                    <h2 class="question-info">${data.question}</h2>
                    <p class="deadline">⏳ ${formattedDate}</p>
                    
                    <div class="odds-container">
                        <button class="bet-btn yes-box" data-id="${data.q_id}" data-option="${optionOne}">
                            <span>${optionOne}</span>
                            <strong>${yesOdds}x</strong>
                        </button>
                        <button class="bet-btn no-box" data-id="${data.q_id}" data-option="${optionTwo}">
                            <span>${optionTwo}</span>
                            <strong>${noOdds}x</strong>
                        </button>
                    </div>

                    <div class="bet-input-box">
                        <input type="number" class="coin-input" placeholder="Enter Coins..." id="coins-input-${data.q_id}" min="1">
                        <button class="place-bet-btn" data-id="${data.q_id}">Place Prediction</button>
                    </div>
                </div>
            `;
    }
    questionsContainer.innerHTML = containerHTML;
    attachPredictionListeners();
}

function attachPredictionListeners() {
  // 1. Highlight YES/NO buttons on click
  const betButtons = document.querySelectorAll(".bet-btn");
  betButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".question-card");
      // Deselect other button in the same card
      card
        .querySelectorAll(".bet-btn")
        .forEach((b) => b.classList.remove("selected-odds"));
      // Select current button
      btn.classList.add("selected-odds");
    });
  });

  // 2. Handle Place Prediction button click
  const placeBetButtons = document.querySelectorAll(".place-bet-btn");
  placeBetButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const qId = btn.getAttribute("data-id");
      const card = btn.closest(".question-card");

      const selectedBtn = card.querySelector(".bet-btn.selected-odds");
      const coinsInput = card.querySelector(".coin-input");
      const coins = coinsInput ? parseInt(coinsInput.value) : 0;

      if (!selectedBtn) {
        alert("Please select either YES or NO first!");
        return;
      }
      if (isNaN(coins) || coins <= 0) {
        alert("Please enter a valid amount of coins!");
        return;
      }

      // Detect outcome based on button class
      const chosenOutcome = selectedBtn.getAttribute("data-option");
      const userId = localStorage.getItem("userId") || 1;

      try {
        const response = await fetch("http://localhost:8000/AddBetsData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            qId: qId,
            prediction: chosenOutcome,
            coins: coins,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message || "Prediction successfully recorded!");
          coinsInput.value = "";
          selectedBtn.classList.remove("selected-odds");
          loadQuestionData();
        } else {
          alert(result.Error || "Failed to submit prediction.");
        }
      } catch (err) {
        console.error("Error submitting prediction:", err);
        alert("Connection failed. Could not process prediction.");
      }
    });
  });
}

const searchInput = document.querySelector('#search-container input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const filtered = allQuestions.filter(q => {
      const questionMatch = q.question && q.question.toLowerCase().includes(searchTerm);
      const categoryMatch = (q.Category || q.category) && (q.Category || q.category).toLowerCase().includes(searchTerm);
      return questionMatch || categoryMatch;
    });
    renderQuestions(filtered);
  });
}

loadQuestionData(); 

// Logout Button 
let logoutButton = document.getElementById('logout-btn');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});