// DOM Elements
const newTodoInput = document.getElementById('new-todo');
const addTodoBtn = document.getElementById('add-todo-btn');
const updateTodoBtn = document.getElementById('update-todo-btn');
// const deleteTodoBtn = document.getElementById('delete-todo-btn');
const todosList = document.getElementById('todos');

// API endpoint (will be the URL of your EC2 instance)
const API_URL = '/api/todos';

// Fetch all todos when page loads
document.addEventListener('DOMContentLoaded', fetchTodos);

// Add event listener to the add and update buttons
addTodoBtn.addEventListener('click', addTodo);
updateTodoBtn.addEventListener('click', updateTodo);

// Function to fetch all todos from the server
async function fetchTodos() {
  try {
    console.log('Fetching todos from server...');
    const response = await fetch(API_URL);
    console.log('Server Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Error Details:', errorData);
      throw new Error(`Failed to fetch todos: ${errorData.details || 'Unknown error'}`);
      throw new Error(`Failed to fetch todos: ${errorData.details || 'Unknown error'}`);
    }

    const todos = await response.json();
    console.log('Received todos:', todos);

    if (!Array.isArray(todos)) {
      console.error('Invalid response format. Expected array, got:', typeof todos);
      console.error('Invalid response format. Expected array, got:', typeof todos);
      throw new Error('Invalid response format from server');
    }

    displayTodos(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    todosList.innerHTML = `<li class="error">Failed to load todos: ${error.message}</li>`;
  }
}

// Create a new todo
async function addTodo() {
  const todoText = newTodoInput.value.trim();

  if (!todoText) {
    alert('Please enter a task!');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: todoText }),
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    const newTodo = await response.json();

    // Add the new todo to the list
    addTodoToDOM(newTodo);

    // Clear the input field
    newTodoInput.value = '';
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Failed to add todo. Please try again.');
  }
}

// Delete a todo
async function removeTodo(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Failed to delete todo. Please try again.');
  }
}

// Update a todo
async function updateTodo() {
  const text = newTodoInput.value.trim();
  const id = newTodoInput.dataset.editId;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
  } catch (error) {
    console.error(`Error updating todo: ${id}`, error);
    alert('Failed to update todo. Please try again.');
  } finally {
    newTodoInput.value = '';
    newTodoInput.removeAttribute('data-edit-id');
    updateTodoBtn.style.display = 'none';
    addTodoBtn.style.display = 'inline';
    fetchTodos();
  }
}

// Function to display all todos
function displayTodos(todos) {
  // Clear the loading message
  todosList.innerHTML = '';

  if (todos.length === 0) {
    todosList.innerHTML = `<li class="empty">No tasks yet. Add a new task above!</li>`;
    return;
  }

  // Add each todo to the DOM
  todos.forEach((todo) => {
    addTodoToDOM(todo);
  });
}

// Function to add a single todo to the DOM
function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.dataset.id = todo.id; // Store the todo ID in the element

  // Create todo text span
  const textSpan = document.createElement('span');
  textSpan.textContent = todo.text;
  textSpan.classList.add('todo-text');
  li.appendChild(textSpan);

  // Create buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('todo-buttons');

  // Create edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('edit-btn');
  editBtn.onclick = () => {
    newTodoInput.value = todo.text;
    newTodoInput.dataset.editId = todo.id;
    updateTodoBtn.style.display = 'inline';
    addTodoBtn.style.display = 'none';
  };

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = async () => {
    const response = await removeTodo(todo.id);
    if (response.ok) {
      li.remove();
      // If no todos left, show empty message
      if (todosList.children.length === 0) {
        todosList.innerHTML = '<li class="empty">No tasks yet. Add a new task above!</li>';
      }
    } else {
      throw new Error('Failed to delete todo');
    }
  };

  // Add buttons to the buttons container
  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(deleteBtn);
  // buttonsDiv.appendChild(submitBtn);
  li.appendChild(buttonsDiv);

  // If there's an "empty" message, remove it first
  const emptyMessage = todosList.querySelector('.empty');
  if (emptyMessage) {
    todosList.removeChild(emptyMessage);
  }

  todosList.appendChild(li);
}
