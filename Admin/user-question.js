let Question = document.getElementById('live_Question');

fetch('http://localhost:8000/AddQuestions', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        question: Question.textContent
    })
})
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.Error);
    });
