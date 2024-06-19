import { getBase, setBase } from '../models/base.model.js';

export const checkForBreak = (userId, socket, payload, io) => {
  if (getBase(userId) <= 0) {
    socket.emit('updateGameState', {
      isDeath: true,
    });
    return { status: 'success', message: ' Break base ! ' };
  } else {
    socket.emit('updateGameState', {
      isDeath: false,
    });
    return { status: 'success', message: ' No break base ! ' };
  }
};
