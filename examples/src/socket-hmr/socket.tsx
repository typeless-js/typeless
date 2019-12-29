import EventEmitter from 'eventemitter3';

export const socket = new EventEmitter();

let nextId = 1;

console.log('initialize socket');

setInterval(() => {
  socket.emit('message', `Event ${nextId++}`);
}, 2000);
