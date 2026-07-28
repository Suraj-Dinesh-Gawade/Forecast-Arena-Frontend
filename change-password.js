const changePassBtn = document.getElementById("submit-change-pass");
if (changePassBtn) {
    changePassBtn.addEventListener("click", async () => {
        const oldPassword = document.getElementById("old-pass").value;
        const newPassword = document.getElementById("new-pass").value;
        const userId = localStorage.getItem("userId");

        if (!oldPassword || !newPassword) {
            alert("Please fill in both fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, oldPassword, newPassword })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.Error || "Failed to update password");

            alert(data.message);
            window.location.href = "user-dashboard.html";
        } catch (err) {
            alert(err.message);
        }
    });
}