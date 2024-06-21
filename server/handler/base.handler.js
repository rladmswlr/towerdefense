import { getUserById } from '../models/user.model.js';

export const checkForBreak = (userId, payload, socket) => {
  const userGameState = getUserById(userId);

  if (userGameState.baseHp <= 0) {
    socket.emit('updateGameState', {
      isDeath: true,
    });
    return { status: 'success', message: '기지가 파괴됐습니다....' };
  } else {
    socket.emit('updateGameState', {
      isDeath: false,
    });
    return { status: 'success', message: '그래도 파괴되진 않았습니다. 휴~~' };
  }
};
