export class Notify {
  handlers: (() => void)[] = [];
  add(handler: () => void) {
    this.handlers.push(handler);
  }
}
