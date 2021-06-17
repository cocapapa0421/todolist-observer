// ModelBase is ObserverList
export default class ModelBase {
  constructor() {
    this._observerList = [];
  }

  addObserver(observer) {
    this._observerList.push(observer);
  }

  getObserver(index) {
    return this._observerList[index];
  }

  removeObserver(observer) {
    this._observerList.filter((item) => item !== observer);
  }

  indexOfObserver(observer) {
    return this._observerList.findIndex((item) => item === observer);
  }

  notify(action, data) {
    this._observerList.forEach((observer) => observer.update(action, data));
  }
}
