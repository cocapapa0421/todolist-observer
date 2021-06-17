export default class Controller {
  constructor(model) {
    this.model = model;
  }

  addItem(value) {
    if (!value) return;

    this.model.addItem(value);
  }

  editItem(id, text) {
    if (!id) return;
    this.model.editItem(id, text);
  }

  removeItem(id) {
    if (!id) return;
    this.model.removeItem(id);
  }

  handleEditButtonClick(id) {
    if (!id) return;
    this.model.handleEditButtonClick(id);
  }

  renderApp() {
    this.model.renderApp();
  }
}
