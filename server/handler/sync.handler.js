import { getGameAssets } from '../init/assets.js';
import { gameStart } from './game.handler.js';

const initializeGameHandler = (userId, socket) => {
  // 초기화 요청 처리 로직
  const { init } = getGameAssets();
  gameStart(userId);
  const userGameState = {
    data: init,
    userId: userId,
  };
  if (userGameState) {
    return {
      status: 'success',
      handlerId: 1,
      data: userGameState,
    };
  } else {
    return {
      status: 'fail',
      handlerId: 1,
    };
  }
};

export { initializeGameHandler };
