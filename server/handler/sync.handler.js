import { getUserById } from '../models/user.model.js';
import { getGameAssets } from '../init/assets.js';
import { gameStart } from './game.handler.js';

const initializeGameHandler = (userId, payload, io) => {
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

const syncGameStateHandler = (userId, payload, io) => {
  // 동기화 요청 처리 로직
  const userGameState = getUserById(userId);
  if (userGameState) {
    Object.assign(userGameState, payload); // payload 객체의 모든 속성이 userGameState 객체로 복사
    return {
      status: 'success',
      handlerId: 2,
      data: userGameState,
    };
  } else {
    return {
      status: 'fail',
      handlerId: 2,
    };
  }
};

export { initializeGameHandler, syncGameStateHandler };
