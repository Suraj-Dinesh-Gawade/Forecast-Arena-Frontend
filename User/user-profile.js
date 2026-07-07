const userId = localStorage.getItem("userId");

fetch(`http://localhost:8000/user/${userId}`)
 .then(response => {
            if (!response.ok) throw new Error("Failed to load profile details.");
            return response.json();
 })
    .then(data => {
          document.getElementById("username").innerText = data.name;
        document.getElementById("usercoins").innerText = data.coins;
 
        const rankEl = document.getElementById("userrank");
        if (rankEl) {
                const rankVal = data.user_rank ?? 1;
                let rankBadge = `#${rankVal}`;

                if (rankVal === 1) {
                    rankBadge = "👑 1";
                } else if (rankVal === 2) {
                    rankBadge = "🥈 2";
                } else if (rankVal === 3) {
                    rankBadge = "🥉 3";
                }
                rankEl.innerText = rankBadge;
            }
        })
        .catch(err => {
            console.error("Error loading profile layout cards:", err);
        });
