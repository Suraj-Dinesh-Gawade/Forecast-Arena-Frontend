const userRole = localStorage.getItem("userRole");

if (userRole !== "admin") {
  // Redirect them to login if they aren't an admin
  window.location.href = "../index.html";
}

const adminHeaders = {
  "Content-Type": "application/json",
  role: "admin",
};

let total_Users = document.getElementById("totalUsers");
let total_Questions = document.getElementById("totalQuestions");
let live_Questions = document.getElementById("liveQuestions");
let total_Predictions = document.getElementById("totalPredictions");

async function loadUsersCount() {
  const response = await fetch("http://localhost:8000/NoOfUsers", {
    headers: adminHeaders,
  });

  const data = await response.json();
  total_Users.innerHTML = data.total_Users;
}

async function loadQuestionsCount() {
  const response = await fetch("http://localhost:8000/NoOfQuestions", {
    headers: adminHeaders,
  });

  const data = await response.json();
  total_Questions.innerHTML = data.total_Questions;
}

async function loadLiveQuestionsCount() {
  const response = await fetch("http://localhost:8000/NoOfLiveQuestions", {
    headers: adminHeaders,
  });

  const data = await response.json();
  live_Questions.innerHTML = data.Live_Questions;
}

async function loadTotalPredictions() {
  const response = await fetch("http://localhost:8000/NoOfTotalPredictions", {
    headers: adminHeaders,
  });

  const data = await response.json();
  total_Predictions.innerHTML = data.Total_Predictions;
}

loadUsersCount();
loadQuestionsCount();
loadLiveQuestionsCount();
loadTotalPredictions();

async function loadPasswordRequests() {
  const container = document.getElementById("requests-container");
  if (!container) return;

  try {
    const response = await fetch(
      "http://localhost:8000/admin/password-requests",
      {
        headers: adminHeaders,
      },
    );

    const requests = await response.json();

    if (requests.length === 0) {
      container.innerHTML = `<p style="color: #a1a1aa;">No pending password reset requests.</p>`;
      return;
    }

    let html = `<table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 0.85rem;">
                <th style="padding: 10px;">Username</th>
                <th style="padding: 10px;">Email</th>
                <th style="padding: 10px;">Submitted Key</th>
                <th style="padding: 10px;">Date</th>
                <th style="padding: 10px;">Action</th>
            </tr>`;

    requests.forEach((req) => {
      html += `
                <tr style="border-bottom: 1px solid #27272a;">
                    <td style="padding: 10px; font-weight: 600;">${req.username}</td>
                    <td style="padding: 10px; color: #60a5fa;">${req.email}</td>
                    <td style="padding: 10px; color: #fbbf24;">${req.submitted_key}</td>
                    <td style="padding: 10px; font-size: 0.8rem; color: #a1a1aa;">${new Date(req.request_date).toLocaleString()}</td>
                    <td style="padding: 10px;">
                        <button onclick="approveReset(${req.id}, '${req.username}')" style="background: #22c55e; color: #white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            Approve & Reset
                        </button>
                    </td>
                </tr>`;
    });

    html += `</table>`;
    container.innerHTML = html;
  } catch (err) {
    console.error("Error loading requests:", err);
    container.innerHTML = `<p style="color: #ef4444;">Failed to load requests.</p>`;
  }
}

async function approveReset(requestId, username) {
  const tempPassword = prompt(
    `Enter a temporary password for user "${username}":`,
  );
  if (!tempPassword) return;

  try {
    const response = await fetch("http://localhost:8000/admin/approve-reset", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ requestId, username, tempPassword }),
    });
    const data = await response.json();
    alert(data.message || data.Error);
    loadPasswordRequests(); // Refresh list
  } catch (err) {
    alert("Failed to process request");
  }
}

// Call this on DOM load in your admin panel
document.addEventListener("DOMContentLoaded", loadPasswordRequests);

const logoutButton = document.getElementById("logout-btn");
logoutButton.addEventListener("click", async () => {
  window.location.href = "index.html";
});
