'use strict';

// Workshop - TODO list

// оголошуємо змінні з якими будемо працювати
const form = document.querySelector('.create-task-form');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');
const filter = document.querySelector('.filter-input');
const taskList = document.querySelector('.collection');

// слухачі подій
// запускаємо функцію showPosts коли весь HTML загружений
document.addEventListener('DOMContentLoaded', showTasks);
// запускаємо функцію addTask коли відправляємо форму (клікаємо на кнопку "Додати завдання")
form.addEventListener('submit', addTask);
// запускаємо функцію deleteTask коли клік попадає на список <ul>
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', editTask);
// запускаємо функцію після кліку на кнопку "Видалити всі елементи"
clearBtn.addEventListener('click', removeAllTasks);
// запускаємо функцію filterTasks після того як ввідпускаємо клавішу (тоді, коли фокус в інпуті "Пошук завдань")
filter.addEventListener('keyup', filterTasks);

function showTasks() {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // для кожної задачі яка є
    tasks.forEach((task) => {
        // створюємо елемент списку
        const li = document.createElement('li');
        // додаємо йому класс
        li.classList.add('task');
        // всередині цього елементу списку додаємо опис завдання
        li.innerHTML = task.text;
        li.dataset.id = task.id;

        const edit = document.createElement('button')
        edit.classList.add('edit-task')
        edit.innerHTML = '<i class="fa fa-edit"></i>'

        // сторюємо кнопку для видалення
        const button = document.createElement('button');
        // додаємо їй клас
        button.classList.add('remove-task');
        // всередину кнопку додаємо значення х
        button.innerHTML = 'x';
        // записуємо кнопку після всього, що є всередині елементу списку
        li.append(edit, button);

        // записуємо цей елемент в кінець списку
        taskList.append(li);

    })
}

// створюємо таску
function addTask(event) {
    // зупиняємо поведінку браузера за замовчуванням
    event.preventDefault();
    // отримуємо значення з інпута taskInput
    const value = taskInput.value.trim();

    // якщо значення в інпуті порожнє  - то не додаємо нове завдання
    if (value.trim() === '') {
        return null;
    }
    const task = { id: generateID(), text: value };

    // створюємо елемент списку
    const li = document.createElement('li');
    // додаємо йому класс
    li.classList.add('task');
    // всередині цього елементу списку додаємо опис завдання
    li.innerText = value;
    li.dataset.id = task.id;

    const edit = document.createElement('button')
    edit.classList.add('edit-task')
    edit.innerHTML = '<i class="fa fa-edit"></i>'

    // сторюємо кнопку для видалення
    const button = document.createElement('button');
    // додаємо їй клас
    button.classList.add('remove-task');
    // всередину кнопку додаємо значення х
    button.innerHTML = 'x';
    // записуємо кнопку після всього, що є всередині елементу списку
    li.append(edit, button);

    // записуємо цей елемент в кінець списку
    taskList.append(li);

    // викликаємо функцію яка буде додавати завдання до Local Storage
    storeTasksInLocalStorage(task);
    // очищуємо вміст інпуту для створення завдання
    taskInput.value = '';
}


function generateID() {
    return Date.now();
}


function storeTasksInLocalStorage(task) {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // додаємо до списку нове завдання
    tasks.push(task);

    // зберігаємо список завданнь в Local Storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// видалити якусь конкретну таску
function deleteTask(event) {
    // якщо ми клікнули по хрестику  - тоді
    if (event.target.classList.contains('remove-task')) {
        // пересвідчуємось чи юзер справді хоче видалити цей елемент
        if (confirm('Ви впевнені що хочете видалити цей елемент?')) {
            const li = event.target.closest('li');
            const id = li.dataset.id;
            // видаляємо цей елемент списку, в якому знаходиться хрестик
            li.remove();
            // викликаємо функцію яка буде видаляти завдання з Local Storage
            removeTaskFromLocalStorage(id);
        }
    }
}

function editTask(event) {
    if (event.target.closest('.edit-task')) {
        const li = event.target.closest('li');
        const id = li.dataset.id;
        const tasks = JSON.parse(localStorage.tasks);
        const task = tasks.find(task => task.id == id);
        task.text = prompt('Відредагуйте задачу:)', task.text);
        localStorage.tasks = JSON.stringify(tasks);
        li.replaceChildren(task.text, ...li.querySelectorAll('button'))
    }
}

function removeTaskFromLocalStorage(id) {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // фільтруємо таски і повертаємо ті, які проходять умову
    const filteredTasks = tasks.filter((task) => {
        return task.id != id;
    })

    // запусиємо нові задачі в Local Storage
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

// видалити всі таски
function removeAllTasks() {
    if (confirm('Ви впевнені що хочете видалити всі елементи?')) {
        // видаляємо весь контент всередині списку
        taskList.innerHTML = '';
        // видалити всі елементи з Local Storage
        removeAllTaskFromLocalStorage();
    }
}

function removeAllTaskFromLocalStorage() {
    // чистимо Local Storage
    localStorage.clear()
}

function filterTasks(event) {
    // отримуємо всі елементи списку
    const itemList = document.querySelectorAll('.task');
    // отримуємо значення інпуту "Пошук завдань" і робимо його в нижньому регістрі
    const searchQuery = event.target.value.toLowerCase();

    // проходимось по кожному елементу завдань
    itemList.forEach((item) => {
        // отримуємо текст завдання
        const itemValue = item.firstChild.textContent.toLowerCase();

        // перевіряємо чи текст завдання має в собі значення інпута "Пошук завдань"
        if (itemValue.includes(searchQuery)) {
            // якщо має, то display = list-item
            item.style.display = 'list-item';
        } else {
            // якщо ні - ховаємо це елемент списку
            item.style.display = 'none';
        }
    })
}