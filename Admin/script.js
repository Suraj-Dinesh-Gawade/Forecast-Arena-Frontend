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

if (r_Form_Name) {
  r_Form_Name.addEventListener("click", () => {
    l_Div.style.display = "none";
    r_Div.style.display = "block";
  });
}

if (l_Form_Name) {
  l_Form_Name.addEventListener("click", () => {
    r_Div.style.display = "none";
    l_Div.style.display = "block";
  });
}

const L_Username = document.getElementById("Lusername");
const L_Password = document.getElementById("Lpassword");
const loginButton = document.getElementById("l_btn");

if (loginButton) {
  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
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
      window.location.href = "user-dashboard.html";
    } else {
      console.log(loginData);
      alert(loginData.Error);
    }
  });
}
// logout function

const logoutButton = document.getElementById("logout-btn");

  logoutButton.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-btn") {
      window.location.href = "index.html";
      return;
    }

    if (e.target && e.target.closest("#sidebar-toggle")) {
      document.getElementById("sidebar").classList.toggle("active");
      return;
    }
  });

