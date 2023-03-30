let todoItems = [];
const todoInput = document.querySelector(".todo-input");
const completedTodos = document.querySelector(".completed-todos");
const uncompletedTodos = document.querySelector(".uncompleted-todos");
const todoBtn = document.querySelector('#todo-btn')



window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    if(storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems);
    }

    render()
}


todoInput.onkeyup = ((e) => {
    todoBtn.addEventListener('click', function() {
        let value = e.target.value.replace(/^\s+/, "");
        if(value) {
            addTodo(value)

            todoInput.value = '';
            todoInput.focus()
        }
    })
})

function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

function markAsCompleted(id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }

        return todo
    })

    saveAndRender()
}

function markAsUncompleted(id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }

        return todo
    })
    saveAndRender()
}

function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

function render() {
    let uncompletedTodoses = todoItems.filter(item => !item.completed)
    let completedTodoses = todoItems.filter(item => item.completed)

    completedTodos.innerHTML = ''
    uncompletedTodos.innerHTML = ''

    if(uncompletedTodoses.length > 0) {
        uncompletedTodoses.forEach(todo => {
            uncompletedTodos.append(createTodoElement(todo))
        })
    } else {
        uncompletedTodos.innerHTML = `<div class='empty'>No uncompleted mission</div>`
    }

    if(completedTodoses.length > 0) {
        completedTodos.innerHTML = `<div class="completed-title">Completed (${completedTodoses.length} / ${todoItems.length})</div>`
        
        completedTodoses.forEach(todo => {
            completedTodos.append(createTodoElement(todo))
        })
    }

}

function saveAndRender() {
    save()
    render()
}

function createTodoElement(todo) {
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M10 10l4 4m0 -4l-4 4"></path>
        </svg>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}