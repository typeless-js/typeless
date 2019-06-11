export class Notify {
  handlers: Array<() => void> = [];
  add(handler: () => void) {
    this.handlers.push(handler);
  }
}
