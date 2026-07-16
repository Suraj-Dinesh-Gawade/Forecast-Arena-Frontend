document.addEventListener("DOMContentLoaded", () => {
    // Styling is now handled exclusively by "frontend/user-leaderboard.css"
    loadLeaderboard();
});

async function loadLeaderboard() {
    const container = document.getElementById("leaderboard-container");
    if (!container) return;

    try {
        // 1. Fetch ranking records from your backend
        const response = await fetch("http://localhost:8000/LeaderboardData");
        if (!response.ok) throw new Error("HTTP Status Error : " + response.status);

        const data = await response.json();

        // 2. Double-Guard: Ensure the received data is formatted as an array
        const players = Array.isArray(data) ? data : (data ? [data] : []);

        if (players.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: #888; padding: 40px; font-style: italic;">
                    No rankings recorded yet! Be the first to place predictions.
                </p>
            `;
            return;
        }

        // Split database records into Podium (Top 3) and standard List Rows
        const podiumPlayers = players.slice(0, 3);
        const listedPlayers = players.slice(3);

        let wrapperHTML = `<div class="leaderboard-wrapper">`;

        // 3. BUILD PODIUM MARKUP (Top 3)
        if (podiumPlayers.length > 0) {
            wrapperHTML += `<div class="podium-container">`;
            
            podiumPlayers.forEach((player, index) => {
                let badgeSymbol = "";
                let stepClass = "";
                let labelText = "";

                if (index === 0) {
                    badgeSymbol = "👑";
                    stepClass = "first";
                    labelText = "1st Place";
                } else if (index === 1) {
                    badgeSymbol = "🥈";
                    stepClass = "second";
                    labelText = "2nd Place";
                } else if (index === 2) {
                    badgeSymbol = "🥉";
                    stepClass = "third";
                    labelText = "3rd Place";
                }

                wrapperHTML += `
                    <div class="podium-card ${stepClass}">
                        <div class="podium-crown">${badgeSymbol}</div>
                        <div class="podium-name">${player.name}</div>
                        <div class="podium-coins">🪙 ${player.coins}</div>
                        <div class="podium-step-label">${labelText}</div>
                    </div>
                `;
            });
            
            wrapperHTML += `</div>`;
        }

        // 4. BUILD LIST MARKUP (Ranks 4+)
        if (listedPlayers.length > 0) {
            wrapperHTML += `<div class="ranked-list">`;
            
            listedPlayers.forEach((player, index) => {
                const actualRank = index + 4; // Since listed array indices start after the first 3
                
                wrapperHTML += `
                    <div class="list-row">
                        <div class="list-left">
                            <!-- Circular high-tech rank badge -->
                            <div class="list-rank-badge">${actualRank}</div>
                            <span class="list-name">${player.name}</span>
                        </div>
                        <div class="list-right">
                            <span>${player.coins}</span>
                            <span class="coin-icon">🪙</span>
                        </div>
                    </div>
                `;
            });

            wrapperHTML += `</div>`;
        }

        wrapperHTML += `</div>`;
        container.innerHTML = wrapperHTML;

    } catch (err) {
        console.error("Error loading Leaderboard details: ", err);
        container.innerHTML = `
            <p class="error-message" style="color: #ff3b30; text-align: center; padding: 40px;">
                Unable to sync leaderboard ratings at this time.<br>
                <small style="color: #888;">Ensure your backend server is active on port 8000.</small>
            </p>
        `;
    }
}

let logoutButton = document.getElementById('logout-btn');

logoutButton.addEventListener('click', () => {
    window.location.href = "index.html";
});