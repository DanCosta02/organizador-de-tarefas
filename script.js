let taskToDelete = null;

// Função para carregar tarefas salvas no localStorage
function loadTasks() {
    const todoTasks = JSON.parse(localStorage.getItem('todo')) || [];
    const inProgressTasks = JSON.parse(localStorage.getItem('inProgress')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completed')) || [];

    todoTasks.forEach(task => addTaskToList('todo', task.text, task.status));
    inProgressTasks.forEach(task => addTaskToList('in-progress', task.text, task.status));
    completedTasks.forEach(task => addTaskToList('completed', task.text, task.status));
}

// Função para adicionar tarefa na lista
function addTaskToList(listId, taskText, status = 'todo') {
    const list = document.getElementById(`${listId}-list`);
    const task = document.createElement('li');
    task.classList.add('task');
    task.innerHTML = `${taskText} <button onclick="moveToInProgress(this)" ${status === 'in-progress' || status === 'completed' ? 'style="display:none"' : ''}>Iniciar</button> <button class="delete-btn" onclick="deleteTask(this)">Excluir</button>`;
    if (status === 'in-progress') {
        task.innerHTML = `${taskText} <button onclick="moveToCompleted(this)">Concluir</button> <button class="delete-btn" onclick="deleteTask(this)">Excluir</button>`;
    }
    if (status === 'completed') {
        task.innerHTML = `${taskText} <button class="delete-btn" onclick="deleteTask(this)">Excluir</button>`;
    }
    list.appendChild(task);
}

// Função para adicionar uma tarefa
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        addTaskToList('todo', taskText);
        saveTasks();
        taskInput.value = ''; // Limpa o campo de input
    }
}

// Função para mover a tarefa para "Em Progresso"
function moveToInProgress(button) {
    const task = button.parentElement;
    const taskText = task.textContent.replace('Iniciar', '').replace('Excluir', '').trim();

    // Remove a tarefa da lista "A Fazer"
    task.remove();

    const taskInProgress = document.createElement('li');
    taskInProgress.classList.add('task');
    taskInProgress.innerHTML = `${taskText} <button onclick="moveToCompleted(this)">Concluir</button> <button class="delete-btn" onclick="deleteTask(this)">Excluir</button>`;
    document.getElementById('in-progress-list').appendChild(taskInProgress);
    saveTasks();  // Salva o estado
}

// Função para mover a tarefa para "Concluído"
function moveToCompleted(button) {
    const task = button.parentElement;
    const taskText = task.textContent.replace('Concluir', '').replace('Excluir', '').trim();

    // Remove a tarefa da lista "Em Progresso"
    task.remove();

    const taskCompleted = document.createElement('li');
    taskCompleted.classList.add('task');
    taskCompleted.innerHTML = `${taskText} <button class="delete-btn" onclick="deleteTask(this)">Excluir</button>`;
    document.getElementById('completed-list').appendChild(taskCompleted);
    saveTasks();  // Salva o estado
}

// Função para exibir o pop-up de confirmação de exclusão
function deleteTask(button) {
    taskToDelete = button.parentElement;  // Armazena a tarefa a ser excluída
    document.getElementById('confirmation-popup').style.display = 'flex';  // Exibe o pop-up
}

// Função para confirmar a exclusão
function confirmDelete() {
    if (taskToDelete) {
        taskToDelete.remove();
        saveTasks();  // Salva o estado após a exclusão
    }
    document.getElementById('confirmation-popup').style.display = 'none';  // Esconde o pop-up
    taskToDelete = null;  // Limpa a tarefa a ser excluída
}

// Função para cancelar a exclusão
function cancelDelete() {
    document.getElementById('confirmation-popup').style.display = 'none';  // Esconde o pop-up
    taskToDelete = null;  // Limpa a tarefa a ser excluída
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const todoTasks = Array.from(document.getElementById('todo-list').children).map(task => ({ text: task.textContent.replace('Iniciar', '').replace('Excluir', '').trim(), status: 'todo' }));
    const inProgressTasks = Array.from(document.getElementById('in-progress-list').children).map(task => ({ text: task.textContent.replace('Concluir', '').replace('Excluir', '').trim(), status: 'in-progress' }));
    const completedTasks = Array.from(document.getElementById('completed-list').children).map(task => ({ text: task.textContent.replace('Excluir', '').trim(), status: 'completed' }));

    localStorage.setItem('todo', JSON.stringify(todoTasks));
    localStorage.setItem('inProgress', JSON.stringify(inProgressTasks));
    localStorage.setItem('completed', JSON.stringify(completedTasks));
}

// Carregar tarefas salvas ao inicializar
loadTasks();
