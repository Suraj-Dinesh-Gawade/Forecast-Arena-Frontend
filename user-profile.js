const userId = localStorage.getItem("userId")

if (!userId) {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadPredictionStatistics();
    initMobileBadgeHints();
});

// 1. FETCH USER PROFILE DETAILS (Includes Name, Coins, Rank, and Accuracy)
async function loadUserProfile() {
    try {
        const response = await fetch(`http://localhost:8000/user/${userId}`);
        if (!response.ok) throw new Error("Profile API retrieval failed");

        const data = await response.json();

        // Welcome name card
        const userEl = document.getElementById("username");
        if (userEl) userEl.innerText = data.name;

        // Set matching first letter in avatar circle
        const avatarCharEl = document.getElementById("avatar-char");
        if (avatarCharEl && data.name) {
            avatarCharEl.innerText = data.name.charAt(0).toUpperCase();
        }

        // Coins balance card
        const coinEl = document.getElementById("usercoins");
        if (coinEl) {
            coinEl.innerHTML = `${data.coins} <b id="coins">Coins</b>`;
        }

        // Leaderboard Rank text
        const rankEl = document.getElementById("userrank");
        if (rankEl) {
            const rankVal = data.user_rank ?? 1;
            let rankBadge = `#${rankVal}`;

            if (rankVal === 1) {
                rankBadge = "👑 1";
            } else if (rankVal === 2) {
                rankBadge = "⚔️ 2";
            } else if (rankVal === 3) {
                rankBadge = "🛡️ 3";
            }
            rankEl.innerText = rankBadge;
        }

        // Win Accuracy Calculations
        const accuracyVal = data.accuracy ?? 0;
        const accuracyTextEl = document.getElementById("u_Accuracy");
        if (accuracyTextEl) accuracyTextEl.innerText = `${accuracyVal}%`;

        // Animate the visual progress ring circumference dynamically
        setProgressRing(accuracyVal);

        // Dynamic Badge Lock Handler based on accuracy, balance, and rank
        handleProfileAchievementUnlocks(data.coins, data.user_rank, accuracyVal);

    } catch (err) {
        console.error("Error loading user profile dashboard details:", err);
    }
}

// 2. FETCH PERFORMANCE AND PREDICTION STATISTICS
async function loadPredictionStatistics() {
    try {
        const response = await fetch(`http://localhost:8000/TotalBets/${userId}`);
        if (!response.ok) throw new Error("Prediction API retrieval failed");

        const data = await response.json();
        const totalBets = data.total_bets ?? 0;
        
        // Populate prediction counter widget
        const totalBetsEl = document.getElementById("perf-total-bets");
        if (totalBetsEl) totalBetsEl.innerText = totalBets;

        // Formulate dynamic assessment titles based on total counts
        const statusEl = document.getElementById("perf-status");
        if (statusEl) {
            if (totalBets === 0) {
                statusEl.innerText = "Beginner";
                statusEl.style.color = "#71717a";
            } else if (totalBets > 0 && totalBets <= 5) {
                statusEl.innerText = "Active Predictor";
                statusEl.style.color = "#60a5fa";
            } else if (totalBets > 5 && totalBets <= 15) {
                statusEl.innerText = "Veteran Forecaster";
                statusEl.style.color = "#8b5cf6";
            } else {
                statusEl.innerText = "Predictive Legend";
                statusEl.style.color = "#ffb703";
            }
        }

        // 🌟 ADDED: Logic to update persistent badges from backend data
        if (data.badges) {
            const badgeMap = {
                sharpshooter: "badge-sharpshooter",
                tycoon: "badge-tycoon",
                ranked: "badge-ranked",
                loyal: "badge-loyal"
            };

            for (const [key, isUnlocked] of Object.entries(data.badges)) {
                const badgeEl = document.getElementById(badgeMap[key]);
                if (badgeEl) {
                    if (isUnlocked) {
                        badgeEl.classList.remove("locked");
                        badgeEl.classList.add("unlocked");
                    } else {
                        badgeEl.classList.add("locked");
                        badgeEl.classList.remove("unlocked");
                    }
                }
            }
        }

    } catch (err) {
        console.error("Error pulling betting count statistics:", err);
    }
}

// 3. SET ACCURACY CIRCLE DASH-OFFSET (Circumference = 314.15)
function setProgressRing(percent) {
    const ringBar = document.getElementById("accuracy-ring");
    if (!ringBar) return;

    const radius = 50;
    const circumference = 2 * Math.PI * radius; // 314.159

    const offset = circumference - (percent / 100) * circumference;
    ringBar.style.strokeDasharray = `${circumference} ${circumference}`;
    ringBar.style.strokeDashoffset = offset;
}
function initMobileBadgeHints() {
    const badgeItems = document.querySelectorAll(".badge-item");
    if (badgeItems.length === 0) return;

    // Create a sleek floating toast notification element dynamically
    let hintToast = document.getElementById("badge-hint-toast");
    if (!hintToast) {
        hintToast = document.createElement("div");
        hintToast.id = "badge-hint-toast";
        hintToast.style.cssText = `
            position: fixed;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(18, 18, 22, 0.95);
            color: #ffb703;
            padding: 12px 20px;
            border-radius: 14px;
            border: 1px solid rgba(255, 183, 3, 0.3);
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 1000;
            display: none;
            text-align: center;
            max-width: 85%;
            backdrop-filter: blur(10px);
            animation: toastFadeIn 0.3s ease;
        `;
        document.body.appendChild(hintToast);
    }

    badgeItems.forEach(badge => {
        badge.addEventListener("click", () => {
            const hintText = badge.getAttribute("title");
            if (hintText) {
                hintToast.innerText = hintText;
                hintToast.style.display = "block";
                
                // Automatically hide the hint toast after 3.5 seconds
                clearTimeout(badge._hintTimer);
                badge._hintTimer = setTimeout(() => {
                    hintToast.style.display = "none";
                }, 3500);
            }
        });
    });
}

function handleProfileAchievementUnlocks(coins, rank, accuracy) {
    // 1. Sharpshooter Badge (Unlocked at 70% accuracy)
    const sharpshooter = document.getElementById("badge-sharpshooter");
    if (sharpshooter) {
        if (accuracy >= 70) {
            sharpshooter.classList.remove("locked");
            sharpshooter.classList.add("unlocked");
        } else {
            sharpshooter.classList.add("locked");
            sharpshooter.classList.remove("unlocked");
        }
    }

    // 2. Arena Tycoon Badge (Unlocked at 10,000 Coins)
    const tycoon = document.getElementById("badge-tycoon");
    if (tycoon) {
        if (coins >= 10000) {
            tycoon.classList.remove("locked");
            tycoon.classList.add("unlocked");
        } else {
            tycoon.classList.add("locked");
            tycoon.classList.remove("unlocked");
        }
    }

    // 3. Legend Status Badge (Unlocked at Top 3 Rank)
    const ranked = document.getElementById("badge-ranked");
    if (ranked) {
        if (rank <= 3) {
            ranked.classList.remove("locked");
            ranked.classList.add("unlocked");
        } else {
            ranked.classList.add("locked");
            ranked.classList.remove("unlocked");
        }
    }
}

// Safe Logout Button
let logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem("userId");
        window.location.href = "index.html";
    });
}