const tableBody = document.getElementById("questions-table-body");

async function loadQuestions() {
  try {
    const response = await fetch("http://localhost:8000/ManageQuestions");
    const questionsData = await response.json();

    let question_Rows = "";

      
    for (let data of questionsData) {
      let badgeClass = "";
      let buttonHTML = "";

        const isSettled = (data.status === "Settled" || data.status === "settled");
        const disabledAttr = isSettled ? "disabled" : "";
        
      if (data.status === "Active" || data.status === "active") {
        badgeClass = "active-badge";
        buttonHTML = `<button class="action-btn resolve-btn" data-id="${data.q_id}">Resolve</button>`;
      } else {
        badgeClass = "settled-badge";
        buttonHTML = `<button class="action-btn view-btn" disabled>Resolved</button>`;
      }
      question_Rows += `
                <tr>
                    <td>${data.q_id}</td>
                    <td>${data.question}</td>
                    <td>${data.Category}</td>
                    <td><span class="badge ${badgeClass}" data-status="${data.status}">${data.status}</span></td>
                    <td>
                        ${buttonHTML}
                        <button class="action-btn delete-btn" data-id="${data.q_id}">Delete</button>
                    </td>
                    <td>
                        <button class="winner-btn winop1" data-id="${data.q_id}" data-winner="${data.Odd_One}" ${disabledAttr}>${data.Odd_One}</button>
                        <button class="winner-btn winop2" data-id="${data.q_id}" data-winner="${data.Odd_Two}" ${disabledAttr}>${data.Odd_Two}</button>
                    </td>
                </tr>
            `;
    }
      tableBody.innerHTML = question_Rows;
      
      attachButtonListeners();
  } catch (err) {
    console.log("Error loading questions: ", err);
  }
}

function attachButtonListeners() {
    // Grab every single resolve button using querySelectorAll
    const resolveButtons = document.querySelectorAll(".resolve-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const winnerbuttons = document.querySelectorAll(".winner-btn");
    const badgeStatus = document.querySelectorAll(".badge");

    for (let btn of resolveButtons) {
        btn.addEventListener("click", async () => {
            // Get the ID of the specific question we clicked
            const questionId = btn.getAttribute("data-id");
            
    try {
        const response = await fetch(`http://localhost:8000/ResolveQuestions/${questionId}`, {
            method: "PUT"
        });

        const result = await response.json();

        if (response.ok) {
            // Refresh the table to show the new "Settled" badge!
            loadQuestions(); 
        } else {
            alert("Error: " + result.Error);
        }
    } catch (error) {
        console.log("Error sending resolve request: ", error);
    }            
        });
    }

    for (let delbtn of deleteButtons) {
        delbtn.addEventListener('click', async () => {
            const questionId = delbtn.getAttribute("data-id");

            try {
                const response = await fetch(`http://localhost:8000/DeleteQuestions/${questionId}`, {
                    method: "DELETE"
                });
                const result = await response.json();
                if (response.ok) {
                    loadQuestions();
                    alert(result.message);
                }
                else {
                    alert("Error : "+result.Error);
                };
            } catch (err) {
                console.log("Error while sending Delete request : ", err);
            };
        });
    };

    for (let winopone of winnerbuttons) {
        winopone.addEventListener('click', async () => {
            const questionId = winopone.getAttribute("data-id");
            const winnerVal = winopone.getAttribute("data-winner");


            
            try {
                const response = await fetch('http://localhost:8000/AddWinnerData', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        qId: questionId,
                        winnervalue: winnerVal
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    loadQuestions();
                    alert(result.message || result.message);
                }
            } catch (err) {
                console.error("Error while sending winner data : ", err);
            };
        });
    };        
};

loadQuestions();
