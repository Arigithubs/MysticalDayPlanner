document.addEventListener('DOMContentLoaded', () => {
    const circle = document.getElementById('circle');
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDurationInput = document.getElementById('taskDuration');
    const taskColorInput = document.getElementById('taskColor');
    const colorPalette = document.getElementById('colorPalette');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasksToLocalStorage = () =>
        localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        circle.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskElement.addEventListener('click', () => editTask(task));
            taskElement.addEventListener('contextmenu', event => deleteTask(event, task));
            circle.appendChild(taskElement);
        });

        saveTasksToLocalStorage();
    };

    const createTaskElement = task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.style.backgroundColor = task.color;
        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');
        taskContent.innerHTML = `<span>${task.name}</span><br><span>${task.duration} hours</span>`;
        taskElement.appendChild(taskContent);
        return taskElement;
    };

    const openTaskForm = () => {
        clearForm();
        taskForm.style.display = 'block';
    };

    const closeTaskForm = () => {
        taskForm.style.display = 'none';
    };

    const saveTask = () => {
        const { name, duration, color } = getInputValues();

        if (isValidTask(name, duration, color)) {
            const newTask = { name, duration, color };
            tasks.push(newTask);
            animateTask(newTask, 'add');
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    };

    const editTask = task => {
        setInputValues(task);
        openTaskForm();

        saveButton.removeEventListener('click', saveTask);
        saveButton.addEventListener('click', () => saveEditedTask(task));
    };

    const saveEditedTask = task => {
        const { name, duration, color } = getInputValues();

        if (isValidTask(name, duration, color)) {
            task.name = name;
            task.duration = duration;
            task.color = color;
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    };

    const deleteTask = (event, task) => {
        event.preventDefault();
        const confirmDelete = confirm(`Are you sure you want to delete the task "${task.name}"?`);
        if (confirmDelete) {
            animateTask(task, 'remove');
            tasks = tasks.filter(t => t !== task);
            renderTasks();
        }
    };

    const animateTask = (task, action) => {
        const taskElement = createTaskElement(task);
        taskElement.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        if (action === 'add') {
            taskElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                taskElement.style.transform = 'scale(1)';
            }, 10);
        } else if (action === 'remove') {
            taskElement.style.opacity = '0';
            setTimeout(() => {
                taskElement.remove();
            }, 300);
        }
        circle.appendChild(taskElement);
    };

    colorPalette.addEventListener('click', event => {
        const colorOption = event.target.closest('.color-option');
        if (colorOption) {
            taskColorInput.value = colorOption.dataset.color;
            selectColorOption(colorOption.dataset.color);
        }
    });

    if (saveButton) {
        saveButton.addEventListener('click', saveTask);
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', closeTaskForm);
    }

    renderTasks();

    const getInputValues = () => ({
        name: taskNameInput.value,
        duration: parseFloat(taskDurationInput.value),
        color: taskColorInput.value,
    });

    const setInputValues = task => {
        taskNameInput.value = task.name;
        taskDurationInput.value = task.duration;
        taskColorInput.value = task.color;
        selectColorOption(task.color);
    };

    const isValidTask = (name, duration, color) =>
        name && !isNaN(duration) && duration > 0 && color;

    const clearForm = () => {
        taskNameInput.value = '';
        taskDurationInput.value = '';
        taskColorInput.value = '#e74c3c'; // Default color
        selectColorOption('#e74c3c');
    };

    const selectColorOption = color => {
        const selectedColor = colorPalette.querySelector('.selected');
        if (selectedColor) {
            selectedColor.classList.remove('selected');
        }

        const colorOption = Array.from(colorPalette.children).find(option =>
            option.dataset.color === color
        );

        if (colorOption) {
            colorOption.classList.add('selected');
        }
    };
});
