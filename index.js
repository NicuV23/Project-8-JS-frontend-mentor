const itemCount = document.querySelector('.count span');
const mobCount = document.querySelector('.mob-count span');
const todo = document.querySelector('.todos ul');
const themeIcon = document.querySelector('.theme');
const addButton = document.querySelector('.todo-input button');
const itemInput = document.getElementById('todo-input');
const itemID = document.querySelector('.filters input[type="radio"]:checked');
const clear = document.querySelector('.clear');
const mobClear = document.querySelector('.mob-clear');

document.addEventListener('DOMContentLoaded', () => {
    restoreFromLocalStorage();
    updateItemCount();
});

themeIcon.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeIcon.src = document.body.classList.contains('light') ? 'images/icon-moon.svg' : 'images/icon-sun.svg';
});

addButton.addEventListener('click', () => {
    if (itemInput.value.trim() !== '') {
        addItems(itemInput.value.trim());
        itemInput.value = '';
    }
});

itemInput.addEventListener('keypress', (event) => {
    if (event.charCode === 13 && itemInput.value.trim() !== '') {
        addItems(itemInput.value.trim());
        itemInput.value = '';
    }
});

function addItems(text) {
    const item = document.createElement('li');
    item.innerHTML = `
        <label class="list">
            <input class="checkbox" type="checkbox"> 
            <span class="text">${text}</span>
        </label>
        <span class="remove"></span>
    `;
    if (itemID.id === 'completed') {
        item.classList.add('hidden');
    }
    todo.append(item);
    updateCount(1);
    saveToLocalStorage();
}

function updateCount(num) {
    itemCount.innerText = +itemCount.innerText + num;
    mobCount.innerText = +mobCount.innerText + num;
    updateItemCount();
}

function removeItems(item) {
    item.remove();
    updateCount(-1);
    saveToLocalStorage();
}

todo.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
        removeItems(event.target.parentElement.closest('li'));
    } else if (event.target.classList.contains('checkbox')) {
        updateCount(event.target.checked ? -1 : 1);
        saveToLocalStorage();
    }
});

document.querySelectorAll('.filters input').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        filterTodo(event.target.id);
    });
});

function filterTodo(id) {
    const allItems = document.querySelectorAll('li');

    switch (id) {
        case 'all':
            allItems.forEach((item) => {
                item.classList.remove('hidden');
            });
            break;
        case 'active':
            allItems.forEach((item) => {
                if (item.querySelector('input').checked) {
                    item.classList.add('hidden');
                } else {
                    item.classList.remove('hidden');
                }
            });
            break;
        default:
            allItems.forEach((item) => {
                if (item.querySelector('input').checked) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            break;
    }
    updateItemCount();
}

clear.addEventListener('click', () => {
    const itemChecked = document.querySelectorAll('.list input[type="checkbox"]:checked');
    itemChecked.forEach((item) => {
        removeItems(item.closest('li'));
    });
});

mobClear.addEventListener('click', () => {
    const itemChecked = document.querySelectorAll('.list input[type="checkbox"]:checked');
    itemChecked.forEach((item) => {
        removeItems(item.closest('li'));
    });
});

function saveToLocalStorage() {
    const todos = [];
    document.querySelectorAll('.list .text').forEach((todo) => {
        todos.push({
            text: todo.innerText,
            checked: todo.parentElement.querySelector('.checkbox').checked,
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function restoreFromLocalStorage() {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
        storedTodos.forEach((todo) => {
            addItems(todo.text);
            const lastAdded = document.querySelector('.todos ul li:last-child');
            if (todo.checked) {
                lastAdded.querySelector('.checkbox').checked = true;
            }
        });
    }
}

function updateItemCount() {
    const visibleItems = document.querySelectorAll('.list:not(.hidden)');
    itemCount.innerText = visibleItems.length;
    mobCount.innerText = visibleItems.length;
}
