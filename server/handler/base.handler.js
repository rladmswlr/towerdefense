import { getBase, setBase } from '../models/base.model.js';
import { getUserById } from '../models/user.model.js';

export const checkForBreak = (userId, payload, socket, io) => {
  const userGameState = getUserById(userId);

  if (userGameState.baseHp <= 0) {
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
