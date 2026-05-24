// Check if user is already logged in when the page loads
window.onload = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        showDashboard(savedToken);
    }
};

async function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', data.username); // Save current user name
        showDashboard(data.token);
    } else {
        alert("Login Failed");
    }
}

async function loadEvents() {
    const res = await fetch('/events');
    const events = await res.json();
    const currentUser = localStorage.getItem('currentUser');
    
    document.getElementById('eventList').innerHTML = events.map(e => {
        // Only show the Delete button if the event belongs to the current user
        const deleteBtn = (e.createdBy === currentUser) 
            ? `<button onclick="deleteEvent('${e._id}')" style="background:red; color:white; margin-left:10px">Delete</button>` 
            : "";

        return `
            <div style="border:1px solid #ddd; padding:10px; margin-top:5px">
                <b>${e.title}</b> | By: ${e.createdBy}
                <button onclick="joinEvent('${e._id}')" style="margin-left:10px">Join</button>
                ${deleteBtn}
            </div>
        `;
    }).join('');
}

async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete your event?")) return;

    const res = await fetch(`/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': localStorage.getItem('token') }
    });

    if (res.ok) {
        alert("Event Deleted");
        loadEvents();
    } else {
        const err = await res.text();
        alert("Error: " + err);
    }
}

// Ensure loadEvents is called in showDashboard
function showDashboard(t) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadEvents();
    loadRegistrations();
}



// Change the name from createEvent to addNewEvent
async function addNewEvent() {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const venue = document.getElementById('venue').value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert("You are not logged in!");
        return;
    }

    const res = await fetch('/events', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': token 
        },
        body: JSON.stringify({ title, date, venue })
    });

    if (res.ok) {
        alert("Event Created Successfully!");
        document.getElementById('title').value = "";
        document.getElementById('date').value = "";
        document.getElementById('venue').value = "";
        loadEvents();
    } else {
        const errorText = await res.text();
        alert("Error: " + errorText);
    }
}

async function register() {
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;
    const res = await fetch('/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if(res.ok) alert("User Created! You can now login.");
}

async function joinEvent(id) {
    const name = prompt("Student Name:");
    if(!name) return;
    await fetch('/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: name, eventId: id}) // Include eventTitle in the request body
    });
    loadRegistrations();
}

async function loadRegistrations() {
    const res = await fetch('/registrations');
    const data = await res.json();
    
    document.getElementById('regList').innerHTML = data.map(r => `<li>${r.studentName} registered for Event: ${r.eventTitle}</li>`).join('');
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}