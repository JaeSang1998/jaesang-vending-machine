class EventEmitter {
  private listeners: { [event: string]: (() => void)[] } = {};

  on(event: string, listener: () => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  off(event: string, listener: () => void) {
    if (!this.listeners[event]) return;
    const index = this.listeners[event].indexOf(listener);
    if (index > -1) this.listeners[event].splice(index, 1);
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((listener) => listener());
  }
}

export { EventEmitter };
