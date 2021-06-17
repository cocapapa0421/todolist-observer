import Controller from "./Controller/Controller";
import Model from "./Model/Model";
import View from "./View/View";

export default class App {
  constructor() {
    this.model = new Model();
    this.controller = new Controller(this.model);
    this.view = new View(this.controller);
    this.controller.renderApp();
  }
}
