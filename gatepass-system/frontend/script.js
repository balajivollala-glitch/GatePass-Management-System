document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        parentPhone: document.getElementById('parentPhone').value,
        informedParent: document.getElementById('informedParent').value
    };

    try {
        const response = await fetch('http://localhost:5000/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        document.getElementById('message').innerText = result.message;
        document.getElementById('studentForm').reset();
    } catch (error) {
        document.getElementById('message').innerText = "Error submitting request.";
    }
});
