let Name = document.getElementById("name");
let Username = document.getElementById("username");
let Password = document.getElementById("password");
let registerButton = document.getElementById("r_btn");

if (registerButton) {
  registerButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: Name.value,
        username: Username.value,
        password: Password.value,
      }),
    });
    const resData = await response.json();
    alert(resData.message || resData.Error);
  });
}

// register / login form switching

const r_Div = document.getElementById("register_Div");
const l_Div = document.getElementById("login_Div");

const r_Form_Name = document.getElementById("register_Form_Name");
const l_Form_Name = document.getElementById("login_Form_Name");

r_Form_Name.addEventListener("click", () => {
  l_Div.style.display = "none";
  r_Div.style.display = "block";
});

l_Form_Name.addEventListener("click", () => {
  r_Div.style.display = "none";
  l_Div.style.display = "block";
});

// Login functionality
const L_Username = document.getElementById("Lusername");
const L_Password = document.getElementById("Lpassword");
const loginButton = document.getElementById("l_btn");

const errorBanner = document.getElementById("login-error-msg");

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (errorBanner) {
    errorBanner.style.display = "none"; // Hide the error banner before making the request
    errorBanner.innerHTML = ""; // Clear any previous error messages
  }
  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: L_Username.value,
        password: L_Password.value,
      }),
    });
    const loginData = await response.json();
    if (response.ok) {
      localStorage.setItem("userId", loginData.id);
      localStorage.setItem("userRole", loginData.role);

      const userRole = (loginData.role || "user").toLowerCase();
      console.log(`User Id : ${loginData.id} <br /> User role : ${userRole}`);
      if (userRole === "admin" || userRole === "Admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    } else {
      const isSuspended = response.status === 403; // Check if the status code indicates suspension
      if (errorBanner) {
        errorBanner.style.display = "block";
        errorBanner.innerHTML = `
                    <div style="
                        background: ${isSuspended ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)"};
                        border: 1px solid ${isSuspended ? "#ef4444" : "#f59e0b"};
                        color: ${isSuspended ? "#f87171" : "#f59e0b"};
                        padding: 12px 15px;
                        border-radius: 8px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        text-align: left;
                        line-height: 1.4;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    ">
                        ${loginData.Error || "An error occurred during verification."}
                    </div>
                `;
      } else {
        alert(loginData.Error);
      }
    }
  } catch (err) {
    console.error("Login connection error:", err);
    alert("⚠️ Connection failed. Ensure your server is active on port 8000.");
  }
});
