// =======================
// 1. Select DOM elements
// =======================
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const showAllBtn = document.getElementById("showAll");
const showCompletedBtn = document.getElementById("showCompleted");
const showPendingBtn = document.getElementById("showPending");
const clearAllBtn = document.getElementById("clearAll");

// =======================
// 2. State
// =======================
let tasks = [];
let currentFilter = "all";

// =======================
// 3. Load tasks on start
// =======================
window.onload = () => {
  loadTasks();
  renderTasks();
};

// =======================
// 4. Event Listeners
// =======================

// Form submit (Add task)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

// Filter buttons
showAllBtn.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});

showCompletedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});

showPendingBtn.addEventListener("click", () => {
  currentFilter = "pending";
  renderTasks();
});

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

// =======================
// 5. Add Task
// =======================
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();
  input.value = "";
}

// =======================
// 6. Render Tasks
// =======================
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      li.classList.add("completed");
    }

    // Toggle complete
    span.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const newText = prompt("Edit task:", task.text);
      if (newText && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// =======================
// 7. Save Tasks
// =======================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =======================
// 8. Load Tasks
// =======================
function loadTasks() {
  const data = localStorage.getItem("tasks");
  tasks = data ? JSON.parse(data) : [];
}