const searchInput = document.getElementById('user-search');
const tableBody = document.getElementById('user-table-body');

let allUsers = [];

async function loadUser() {
    try {
        const response = await fetch('http://localhost:8000/UserData');
        const userData = await response.json();

        allUsers = userData; // Store the original list in our global cache
        renderTable(allUsers); // Build the initial table with all users

    } catch (err) {
        console.log("Error while loading users details: ", err)
    };
}

function renderTable(userData) {

        let user_Rows = "";

        for (let data of userData) {

            let badgeClass = "";
            let buttonHTML = "";

            if (data.status === "Active" || data.status === "active") {
                badgeClass = "active-badge";
                buttonHTML = `
                    <button class="action-btn warn-btn" data-id="${data.id}">Warn</button>
                    <button class="action-btn suspend-btn" data-id="${data.id}">Suspend</button>
                `
            }
            else if (data.status === "Suspended" || data.status === "suspended") {
                badgeClass = "suspended-badge";
                buttonHTML = `
                    <button class="action-btn activate-btn" data-id="${data.id}">Activate</button>
                `
            }
            else {
                badgeClass = "warned-badge";
                buttonHTML = `
                    <button class="action-btn warn-btn" data-id="${data.id}">Warn</button>
                    <button class="action-btn suspend-btn" data-id="${data.id}">Suspend</button>
                `
            }

            user_Rows += `
                <tr>
                    <td>${data.id}</td>
                    <td>${data.name}</td>
                    <td>${data.username}</td>
                    <td>${data.coins}</td>
                    <td>${data.status}</td>
                    <td>
                        ${buttonHTML}
                    </td>
                </tr>
            `
        }
        tableBody.innerHTML = user_Rows;

        attachButtonListeners();
};


if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        const filteredUsers = allUsers.filter(user => {
            const nameMatch = user.name && user.name.toLowerCase().includes(searchTerm);
            const usernameMatch = user.username && user.username.toLowerCase().includes(searchTerm);
            return nameMatch || usernameMatch;
        });
        renderTable(filteredUsers);
    });
}

function attachButtonListeners() {
    const warnButton = document.querySelectorAll('.warn-btn')
    const suspendButton = document.querySelectorAll('.suspend-btn');
    const activateButton = document.querySelectorAll('.activate-btn');

    for (let btn of warnButton) {
        btn.addEventListener('click', async () => {
            const userId = btn.getAttribute("data-id");

            try {
                const response = await fetch(`http://localhost:8000/WarnUser/${userId}`, {
                    method: "PUT"
                });

                const result = await response.json();

                if (response.ok) {
                    loadUser();
                    alert(result.message);
                }
                else {
                    alert("Error : " + result.Error);
                };
            } catch (err) {
                console.log("Error while warning user : ", err);
            };
        });
    }

    for (let susbtn of suspendButton) {
        susbtn.addEventListener('click', async () => {
            const userId = susbtn.getAttribute("data-id");

            try {
                const response = await fetch(`http://localhost:8000/SuspendUser/${userId}`, {
                    method: "PUT"
                });
                const result = await response.json();

                if (response.ok) {
                    loadUser();
                    alert(result.message);
                }
                else {
                    alert("Error : " + result.Error);
                };
            } catch (err) {
                console.log("Error while suspending user : ".err);
            };
        });
    };

    for (let activatebtn of activateButton) {
        activatebtn.addEventListener('click', async () => {
            const userId = activatebtn.getAttribute("data-id");

            try {
                const response = await fetch(`http://localhost:8000/ActivateUser/${userId}`, {
                    method: "PUT"
                });

                const result = await response.json();

                if (response.ok) {
                    loadUser();
                    alert(result.message);
                }
                else {
                    alert(result.Error);
                };
            } catch (err) {
                console.log("Error : ", err);
            };
        });
    };
};

loadUser();