import ModelBase from "./ModelBase";
import { v4 as uuid } from "uuid";

// Model will correspond to Subject
export default class Model extends ModelBase {
  constructor() {
    super();
    this.data = this._getLocalStorage("todo-list");
  }

  renderApp() {
    this.notify("renderApp", this.data);
  }

  handleEditButtonClick(id) {
    const item = this.getItemById(id);
    this.notify("renderEditForm", item);
  }

  addItem(text) {
    const newItem = {
      id: uuid(),
      text,
      time: new Date().toString(),
    };

    this.data.push(newItem);

    this._setLocalStorage("todo-list", this.data);

    this.notify("addItem", newItem);
  }

  editItem(id, text) {
    this.data = this.data.map((item) => {
      if (item.id !== id) {
        return item;
      } else {
        return {
          ...item,
          text,
        };
      }
    });

    this._setLocalStorage("todo-list", this.data);

    this.notify("editItem", { id, text });
  }

  removeItem(id) {
    this.data = this.data.filter((item) => item.id !== id);

    this._setLocalStorage("todo-list", this.data);

    this.notify("removeItem", id);
  }

  getItemById(id) {
    return this.data.find((item) => item.id === id);
  }

  _setLocalStorage(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  }

  _getLocalStorage(key) {
    const localStorageData = localStorage.getItem(key);
    const data = JSON.parse(localStorageData);

    return data ? data : [];
  }
}
