// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initialize
renderTodos();
updateTaskCount();

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompleted.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTaskCount();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Functions
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    updateTaskCount();
    todoInput.value = '';
    todoInput.focus();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function getFilteredTodos() {
    switch(currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No tasks found. Add a new task to get started!</li>';
        return;
    }
    
    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        </li>
    `).join('');
}

function updateTaskCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for inline event handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
