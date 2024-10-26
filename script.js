const users = {}; // This will hold registered users
let currentUser = null; // Track the currently logged-in user

function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');

    if (formType === 'signup') {
        loginForm.classList.add('hidden'); // Hide login form
        signupForm.classList.remove('hidden'); // Show signup form
        signupMessage.classList.remove('hidden'); // Show signup message
        loginMessage.classList.add('hidden'); // Hide login message
    } else {
        signupForm.classList.add('hidden'); // Hide signup form
        loginForm.classList.remove('hidden'); // Show login form
        loginMessage.classList.remove('hidden'); // Show login message
        signupMessage.classList.add('hidden'); // Hide signup message
    }
}

function signup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (email in users) {
        alert("User already exists! Please login.");
    } else {
        users[email] = password; // Save user credentials
        alert("Sign up successful! You can now log in.");
        toggleForm('login'); // Switch to login form
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (users[email] === password) {
        currentUser = email; // Set the current user
        document.getElementById('auth-section').classList.add('hidden'); // Hide auth section
        document.getElementById('todo-section').classList.remove('hidden'); // Show todo section
        document.getElementById('login-message').classList.add('hidden'); // Hide login message
        loadTasks(); // Load existing tasks
    } else {
        document.getElementById('login-message').textContent = "Invalid email or password.";
        document.getElementById('login-message').classList.remove('hidden');
    }
}

function addTask() {
    const task = document.getElementById("todo-input").value; // Changed from "task" to "todo-input"
    const deadline = new Date(document.getElementById("deadline").value);
    const now = new Date();

    // Ensure task input is not empty and deadline is valid
    if (!task || isNaN(deadline.getTime())) {
        alert("Please enter a valid task and deadline.");
        return;
    }

    const timeRemaining = Math.floor((deadline - now) / 1000); // Time in seconds

    const taskItem = document.createElement("li");
    taskItem.innerHTML = `${task} - <span id="timer">${timeRemaining} seconds remaining</span>`;
    document.getElementById("todo-list").appendChild(taskItem);

    // Set the interval for the countdown timer
    const interval = setInterval(() => {
        const now = new Date();
        const timeRemaining = Math.floor((deadline - now) / 1000);
        if (timeRemaining <= 0) {
            taskItem.querySelector("#timer").innerHTML = "Time's up!";
            clearInterval(interval); // Stop the timer when it reaches 0
        } else {
            taskItem.querySelector("#timer").innerHTML = `${timeRemaining} seconds remaining`;
        }
    }, 1000);

    // Show success alert
    alert("Task added successfully!");

    // Clear the input fields after successful task addition
    document.getElementById("todo-input").value = '';
    document.getElementById("deadline").value = '';
}

function logout() {
    currentUser = null; // Clear current user
    document.getElementById('auth-section').classList.remove('hidden'); // Show auth section
    document.getElementById('todo-section').classList.add('hidden'); // Hide todo section
}

// Function to load existing tasks (for demonstration, just a placeholder)
function loadTasks() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing tasks (if any)
    // Here you can load tasks from a database or an array
    // This is a placeholder and doesn't save tasks across sessions
}
