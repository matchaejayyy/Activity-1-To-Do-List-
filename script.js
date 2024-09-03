const A = document.getElementById('task');
const B = document.getElementById('todo');
const C = document.getElementById('tasks');


function addTask(event) {
    event.preventDefault();
    if (B.value === '') {
        alert("Please enter a task")
        return;
    }
    else {
        const task = createTask(B.value);
        C.appendChild(task);
        B.value = '';
    }
}


function createTask(taskName) {
    const task = document.createElement('li');
    task.classList.add('tasks');
    task.innerHTML = `
         <input type="checkbox"> <!-- checkbox for task completion -->
         <label>${taskName}</label> <!-- task name -->
         <span class="delete">&times;</span> <!-- delete button -->
    `;

    check = false

    task.addEventListener("click", () => {
        check = !check

        if (check) {
            task.style.textDecoration = "line-through";
        } if (!check) {
            task.style.textDecoration = "none";
        }

    });

    const deleteButton = task.querySelector('.delete');
    deleteButton.addEventListener('click', deleteTask);
    return task;
}
A.addEventListener("click", () => {
    A.classlist.toggle("checked")
})

function deleteTask(event) {
    event.target.parentElement.remove();
}

A.addEventListener('submit', addTask); 
