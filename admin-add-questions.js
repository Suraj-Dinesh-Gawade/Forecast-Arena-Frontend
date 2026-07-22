const userRole = localStorage.getItem("userRole");

if (userRole !== 'admin') {
    // Redirect them to login if they aren't an admin
    window.location.href = "../index.html"; 
}

let question = document.getElementById("q-text");
let category = document.getElementById("q-category");
let endTime = document.getElementById("q-endtime");
let optionOne = document.getElementById("option1");
let optionTwo = document.getElementById("option2");
let button = document.querySelector(".submit-btn");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:8000/QuestionData", {
    method: "POST",
    headers: { "Content-Type": "application/json", "role" : "admin" },
    body: JSON.stringify({
      question: question.value,
      category: category.value,
      endtime: endTime.value,
      odd1: optionOne.value,
      odd2: optionTwo.value
    }),
  });
  const res_msg = await response.json();
  alert(res_msg.message || res_msg.Error);
});

const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', async () => {
    window.location.href = "index.html";
});