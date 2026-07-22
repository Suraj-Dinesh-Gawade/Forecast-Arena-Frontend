const betsContainer = document.getElementById("bets-container");
const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "index.html";
}

async function loadUserBets() {
    if (!betsContainer) return;

    try {
        // 1. FIXED: Call the correct detailed array endpoint instead of the count-only endpoint
        const response = await fetch(`http://localhost:8000/UserBets/${userId}`);
        if (!response.ok) throw new Error("Failed to load user prediction history");

        const betsData = await response.json();
        let cardsHtml = "";

        // Ensure we always have an array
        const betsList = Array.isArray(betsData) ? betsData : [];

        if (betsList.length === 0) {
            betsContainer.innerHTML = `
                <div class="no-bets-message" style="text-align: center; color: #888; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <p style="margin: 0; font-size: 1.1em;">You haven't placed any predictions yet!</p>
                </div>
            `;
            return;
        }

        // 2. Loop through each prediction and render cards matching your user-mybets.css design
        for (let bet of betsList) {
            let statusBadge = "";
            
            // Standardize column values case-insensitively
            const status = (bet.Win_Lose || bet.win_lose || "Pending").toLowerCase(); 

            // 3. Apply standard status classes matching your stylesheet badges
            if (status === "win") {
                statusBadge = `<span class="status win" style="background-color: #198754; color: white;">🏆 Won</span>`;
            } else if (status === "lose") {
                statusBadge = `<span class="status lose" style="background-color: #dc3545; color: white;">❌ Lost</span>`;
            } else {
                statusBadge = `<span class="status pending" style="background-color: #6c757d; color: white;">⏳ Pending</span>`;
            }

            // Convert SQL datetime stamp cleanly to a reader-friendly format
            const datePlaced = bet.created_at 
                ? new Date(bet.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
                : "Today";

            // 4. FIXED: Generates standard card elements to match your HTML grid layout instead of table rows
            cardsHtml += `
                <div class="bet-card">
                    <h3>${bet.question || "Prediction Market"}</h3>
                    <p><strong>Prediction:</strong> <span style="color: #0d6efd; font-weight: bold;">${bet.selected_option}</span></p>
                    <p><strong>Coins Used:</strong> <b>${bet.bet_amount}</b> Coins</p>
                    ${statusBadge}
                </div>
            `;
        }

        // 5. FIXED: Correctly referenced the matching variable name (avoiding casing ReferenceError)
        betsContainer.innerHTML = cardsHtml;

    } catch (err) {
        console.error("Error loading user prediction history: ", err);
        betsContainer.innerHTML = `
            <div class="error-container" style="text-align: center; color: #ff3b30; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <p>Failed to sync prediction history. Please refresh to try again.</p>
            </div>
        `;
    }
}

let logoutButton = document.getElementById('logout-btn');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});

// Automatically load the cards as soon as DOM content is ready
document.addEventListener("DOMContentLoaded", loadUserBets);