$(function () {
    const $input = $("#add__input");
    const $todoListContainer = $("#todo__list");
    const $todoCount = $('.todo-count');
    const $modal = $("#editModal");
    const $editInput = $("#editInput");
    let todoList = [];
    let currentEditId = null;

    function clearInput() {
        $input.val('');
    }

    function focusInput() {
        $input.focus();
    }

    function createElementTodo(text, id, done) {
        return $(`
            <div id="${id}" class="form-check main__chech ps-5">
                <input class="form-check-input" type="checkbox" ${done ? 'checked' : ''}>
                <label class="form-check-label">${text}</label>
                <img class="edit__img" src="svg/edit.svg" alt="редактировать">
                <img class="main__img" src="svg/trash-can.svg" alt="корзина">
            </div>
        `);
    }

    function renderList(list) {
        $todoListContainer.empty();
        list.forEach(item => {
            $todoListContainer.append(createElementTodo(item.text, item.id, item.done));
        });
    }

    function getFilteredList() {
        if ($("#active__button").hasClass("active-button")) {
            return todoList.filter(item => !item.done);
        } else if ($("#completed__button").hasClass("active-button")) {
            return todoList.filter(item => item.done);
        }
        return todoList;
    }

    function updateRender() {
        const filtered = getFilteredList();
        renderList(filtered);
    }

    function updateCount() {
        $todoCount.text(`(${todoList.length})`);
    }

    function setFilterButton(activeId) {
        $("#all__button, #active__button, #completed__button").removeClass("active-button");
        $(activeId).addClass("active-button");
    }

    function addTodo(text) {
        const todoItem = {
            id: Date.now(),
            text,
            done: false
        };
        todoList.push(todoItem);
        updateRender();
        updateCount();
    }

    $input.on("keydown", function (e) {
        if (e.key === "Enter") {
            const text = $input.val().trim();
            if (!text) return;
            addTodo(text);
            clearInput();
            if (!$(".active-button").length) {
                setFilterButton("#all__button");
            }
        }
    });

    $("#add__button").on("click", function () {
        const text = $input.val().trim();
        if (!text) {
            focusInput();
            return;
        }
        addTodo(text);
        clearInput();
        focusInput();
        if (!$(".active-button").length) {
            setFilterButton("#all__button");
        }
    });

    $todoListContainer.on("click", function (e) {
        const $target = $(e.target);
        const $item = $target.closest(".form-check");
        const id = $item.attr("id");

        if ($target.hasClass("main__img")) {
            todoList = todoList.filter(todo => todo.id.toString() !== id);
            updateRender();
            updateCount();
            focusInput();
        }

        if ($target.hasClass("form-check-input")) {
            const todo = todoList.find(todo => todo.id.toString() === id);
            if (todo) {
                todo.done = !todo.done;
                updateRender();
            }
        }

        if ($target.hasClass("edit__img") || $target.hasClass("form-check-label")) {
            const todo = todoList.find(todo => todo.id.toString() === id);
            if (todo) {
                currentEditId = todo.id;
                $editInput.val(todo.text);
                $modal.show();
            }
        }
    });

    $("#saveEdit").on("click", function () {
        const newText = $editInput.val().trim();
        if (newText && currentEditId !== null) {
            const todo = todoList.find(todo => todo.id === currentEditId);
            if (todo) {
                todo.text = newText;
                updateRender();
                $modal.hide();
                currentEditId = null;
            }
        }
    });

    $(window).on("click", function (e) {
        if ($(e.target).is($modal)) {
            $modal.hide();
            currentEditId = null;
        }
    });

    $("#all__button").on("click", function () {
        setFilterButton("#all__button");
        updateRender();
    });

    $("#active__button").on("click", function () {
        setFilterButton("#active__button");
        updateRender();
    });

    $("#completed__button").on("click", function () {
        setFilterButton("#completed__button");
        updateRender();
    });

    $("#delete__button").on("click", function () {
        todoList = todoList.filter(todo => !todo.done);
        updateRender();
        updateCount();
    });

    focusInput();
});
