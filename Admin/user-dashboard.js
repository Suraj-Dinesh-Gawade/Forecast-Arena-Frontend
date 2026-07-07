const userId = localStorage.getItem("userId");

fetch(`http://localhost:8000/user/${userId}`)
.then(response => response.json())
.then(data => {
    document.getElementById("welcome-name").innerText =
        `Welcome Back, ${data.name} 👋`;
    
    document.getElementById("proName").innerText = data.name;
    
    let coins = document.getElementsByClassName('curr_coins');
    for (let coin of coins){
        coin.innerText = data.coins;
    }; 
})
.catch(err => {
    console.log(err);
});

fetch("http://localhost:8000/Total_Bets/1")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("t_Bets").innerText = data.total_bets;
    }).catch(err => {
        console.log(err);
    });