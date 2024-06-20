import { getBase, setBase } from '../models/base.model.js';

export const checkForBreak = (userId, payload, socket, io) => {
  if (getBase(userId) <= 0) {
    console.log('사망하였습니다.');
    socket.emit('updateGameState', {
      isDeath: true,
    });
    return { status: 'success', message: ' Break base ! ' };
  } else {
    console.log('사망하지 않았습니다.');
    socket.emit('updateGameState', {
      isDeath: false,
    });
    return { status: 'success', message: ' No break base ! ' };
  }
};
