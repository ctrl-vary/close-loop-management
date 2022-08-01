class storageSession {
  constructor() {
    this.store = window.sessionStorage;
  }
  getItem(key) {
    return JSON.parse(this.store.getItem(key));
  }
  setItem(key, value) {
    this.store.setItem(key, JSON.stringify(value));
  }
  removeItem(key) {
    this.store.removeItem(key);
  }
  clear() {
    this.store.clear();
  }
}
export default new storageSession();
