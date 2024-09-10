const A = document.getElementById('task');
const B = document.getElementById('todo');
const C = document.getElementById('tasks');
const D = document.getElementById('Date');
const E = document.getElementById('Time');
const sortBtn = document.getElementById('sortbtn');

A.addEventListener('submit', addTask);
sortBtn.addEventListener('change', sortTasks);
window.onload = loadTasksFromLocalStorage;


function addTask(event) {
    event.preventDefault();

    if (!validateInput()) return; 

    const task = createTask(B.value, D.value, E.value); 
    C.appendChild(task); 
    saveTasksToLocalStorage(); 

    clearInputFields(); 
}

function createTask(taskName, dueDate, dueTime) {
    const task = document.createElement('li');
    task.classList.add('tasks');

    const dueDateTime = `${dueDate} ${dueTime}`; 
    task.innerHTML = `
        <input type="checkbox"> <!-- Task completion checkbox -->
        <label>${taskName}</label> <!-- Task name -->
        <span class="due-date">${dueDateTime}</span> <!-- Due date and time -->
        <span class="delete">&times;</span> <!-- Delete button -->
    `;

    updateExpiredStatus(task, dueDateTime); 
    task.addEventListener("click", handleTaskClick); 
    task.querySelector('.delete').addEventListener('click', deleteTask); 

    return task;
}


function validateInput() {
    if (B.value === '') {
        alert("Please enter a task");
        return false;
    } else if (D.value === '') {
        alert("Please select a due date");
        return false;
    } else if (E.value === '') {
        alert("Please select a due time");
        return false;
    }
    return true;
}


function clearInputFields() {
    B.value = '';
    D.value = '';
    E.value = '';
}

function handleTaskClick(event) {
    if (event.target.tagName !== 'INPUT') {
        const checkbox = event.target.closest('li').querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        toggleTaskCompletion(event.target.closest('li'));
    }
    saveTasksToLocalStorage();
}

function updateExpiredStatus(task, dueDateTime) {
    const currentDateTime = new Date();
    const dueDateTimeObj = new Date(`${dueDateTime.replace(" ", "T")}:00`);
    const dueDateElement = task.querySelector('.due-date');

    if (currentDateTime > dueDateTimeObj) {
        task.classList.add('expired');
        if (!dueDateElement.textContent.includes("Expired")) {
            dueDateElement.textContent = `${dueDateTime} (Expired)`;
        }
    } else {
        task.classList.remove('expired');
        dueDateElement.textContent = dueDateTime;
    }
}

function toggleTaskCompletion(task) {
    task.style.textDecoration = task.querySelector('input[type="checkbox"]').checked ? "line-through" : "none";
}


function deleteTask(event) {
    event.target.parentElement.remove();
    saveTasksToLocalStorage();
}


function saveTasksToLocalStorage() {
    const tasks = [];
    C.querySelectorAll('li').forEach(taskItem => {
        const dueDateTime = taskItem.querySelector('.due-date').textContent.replace(" (Expired)", "");
        tasks.push({
            name: taskItem.querySelector('label').textContent,
            dueDateTime: dueDateTime,
            completed: taskItem.querySelector('input[type="checkbox"]').checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(taskData => {
        const task = createTask(taskData.name, taskData.dueDateTime.split(' ')[0], taskData.dueDateTime.split(' ')[1]);
        if (taskData.completed) {
            task.querySelector('input[type="checkbox"]').checked = true;
            toggleTaskCompletion(task);
        }
        C.appendChild(task);
    });
}


function sortTasks() {
    const tasksArray = Array.from(C.children);
    
    tasksArray.sort((a, b) => {
        const dateTimeA = new Date(a.querySelector('.due-date').textContent.split(" (Expired)")[0]);
        const dateTimeB = new Date(b.querySelector('.due-date').textContent.split(" (Expired)")[0]);

        return (sortBtn.value === 'latest') ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
    });

    tasksArray.forEach(task => C.appendChild(task)); 
}
