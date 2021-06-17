// View is Observer
export default class View {
  constructor(controller) {
    this.controller = controller;
    this._rootEl = document.querySelector("#root");
    this.controller.model.addObserver(this);
  }

  handleAddFormSubmit(e) {
    e.preventDefault();
    const inputEl = e.currentTarget.querySelector(".jsInputField");
    const { value } = inputEl;
    const noRecordEl = this._todoEl.querySelector(".jsNoRecord");
    if (noRecordEl) noRecordEl.remove();

    this.controller.addItem(value);
    this._clearField(inputEl);
    this._focusField(inputEl);
  }

  handleEditFormSubmit(e) {
    e.preventDefault();

    const editForm = e.currentTarget;
    const inputEl = editForm.querySelector(".jsInputField");

    if (!inputEl) return;

    const id = editForm.getAttribute("data-id");
    const { value: text } = inputEl;

    this.controller.editItem(id, text);
  }

  handleEditButtonClick(e) {
    const id = e.currentTarget.getAttribute("data-id");

    this.controller.handleEditButtonClick(id);
  }

  handleRemoveButtonClick(e) {
    const id = e.currentTarget.getAttribute("data-id");

    this.controller.removeItem(id);
  }

  handleCompleteItem(e) {
    const item = e.currentTarget.closest(".item");

    item.classList.toggle("is-active");
  }

  renderAddForm() {
    const addForm = document.createElement("form");
    const childEls = `
      <input
        class="form__input jsInputField"
        type="text"
        name=""
        placeholder="Add a task..."
      />
      <button class="form__button">Add</button>
    `;

    addForm.classList.add("form", "jsAddForm");
    addForm.insertAdjacentHTML("beforeend", childEls);

    addForm.addEventListener("submit", this.handleAddFormSubmit.bind(this));

    return addForm;
  }

  renderEditForm({ id, text }) {
    const editForm = document.createElement("form");
    const childEls = `
      <input
        class="form__input jsInputField"
        type="text"
        name=""
        value="${text}"
        placeholder="Add new content..."
      />
      <button class="form__button">Add</button>
    `;

    this._editForm = editForm;
    editForm.setAttribute("data-id", id);
    editForm.classList.add("form", "form--edit", "jsEditForm");
    editForm.addEventListener("submit", this.handleEditFormSubmit.bind(this));

    editForm.insertAdjacentHTML("beforeend", childEls);
    this._focusField(editForm.querySelector(".jsInputField"));

    this._overlay.classList.add("is-active");
    this._rootEl.insertAdjacentElement("beforeend", editForm);
  }

  renderTodoListContainer() {
    const todoList = document.createElement("div");
    const html = `
      <div class="todo__head grid jsTodoHead">
        <div class="todo__head-item">Status</div>
        <div class="todo__head-item">Name of task</div>
        <div class="todo__head-item">Actions</div>
      <div/>
      <div class="overlay jsOverlay"></div>
    `;

    todoList.insertAdjacentHTML("beforeend", html);
    todoList.classList.add("todo", "jsTodo");

    this._todoEl = todoList;
    this._todoHeadEl = this._todoEl.querySelector(".jsTodoHead");
    this._overlay = this._todoEl.querySelector(".jsOverlay");

    return todoList;
  }

  addItem({ id, text }) {
    const newItem = this.renderItem(id, text);
    this._todoHeadEl.insertAdjacentElement("afterend", newItem);
  }

  renderItem(id, text) {
    // Create elements
    const itemEl = document.createElement("div");
    const inputEl = document.createElement("input");
    const editButtonEl = document.createElement("button");
    const removeButtonEl = document.createElement("button");
    const itemChildEls = `
      <div class="item__status">
        <label class="item__complete-label" for="${id}"></label>
      </div>
      <div class="item__content">${text}</div>
      <div class="item__actions"></div>
    `;

    // Add classes
    itemEl.classList.add("item", "grid");
    inputEl.classList.add("item__complete");
    editButtonEl.classList.add("button", "button--edit");
    removeButtonEl.classList.add("button", "button--remove");

    // Add attributes
    inputEl.setAttribute("type", "checkbox");
    inputEl.setAttribute("name", "status");
    inputEl.setAttribute("data-id", id);
    inputEl.setAttribute("id", id);
    itemEl.setAttribute("data-id", id);
    editButtonEl.setAttribute("data-id", id);
    removeButtonEl.setAttribute("data-id", id);

    // Attach event handle
    inputEl.addEventListener("change", this.handleCompleteItem.bind(this));
    editButtonEl.addEventListener(
      "click",
      this.handleEditButtonClick.bind(this)
    );
    removeButtonEl.addEventListener(
      "click",
      this.handleRemoveButtonClick.bind(this)
    );

    // Add content
    editButtonEl.textContent = "Edit";
    removeButtonEl.textContent = "Remove";

    // Insert child element
    itemEl.insertAdjacentHTML("beforeend", itemChildEls);
    itemEl
      .querySelector(".item__status")
      .insertAdjacentElement("afterbegin", inputEl);
    itemEl
      .querySelector(".item__actions")
      .insertAdjacentElement("beforeend", editButtonEl);
    itemEl
      .querySelector(".item__actions")
      .insertAdjacentElement("beforeend", removeButtonEl);

    return itemEl;
  }

  editItem({ id, text }) {
    const itemEdit = this._todoEl.querySelector(`.item[data-id="${id}"]`);
    if (!itemEdit) return;

    this._editForm.remove();
    this._editForm = null;
    this._overlay.classList.remove("is-active");
    itemEdit.querySelector(".item__content").textContent = text;
  }

  renderApp(data) {
    this._rootEl.insertAdjacentElement("beforeend", this.renderAddForm());
    this._rootEl.insertAdjacentElement(
      "beforeend",
      this.renderTodoListContainer()
    );

    if (!data.length) {
      const html = `<p class="jsNoRecord">No record, please add a new record!</p>`;
      this._todoHeadEl.insertAdjacentHTML("afterend", html);
    } else {
      data.forEach(({ id, text }) => {
        const newItem = this.renderItem(id, text);
        this._todoHeadEl.insertAdjacentElement("afterend", newItem);
      }, this);
    }
  }

  removeItem(id) {
    this._todoEl.querySelector(`[data-id="${id}"]`).remove();
  }

  _clearField(field) {
    field.value = "";
  }

  _focusField(field) {
    field.focus();
  }

  update(action, data) {
    this[action](data);
  }
}
