import { getGameAssets } from '../init/assets.js';
import { clearMonster } from '../models/monster.model.js';
import { clearTower } from '../models/tower.model.js';
import { clearLevel, setLevel } from '../models/level.model.js';
import { Socket } from 'socket.io';

export const gameStart = (uuid, payload) => {
  const { init } = getGameAssets();
  // clear level
  clearLevel(uuid);
  clearTower(uuid);
  clearMonster(uuid);
  serverSocket.emit('event', {
    userId: uuid,
    clientVersion: CLIENT_VERSION,
    handlerId: 1,
    payload: init,
  });
};

export const gameEnd = (uuid, payload) => {
  const { score } = payload;
  const { game, monster } = getGameAssets();

  const user = getUserById(uuid);
  const serverScore = 0;
  //= 몬스터 처리 점수 합산

  let verification = false;

  if (serverScore == score) verification == true;

  if (!verification) {
    socket.emit('gameEnd', { status: 'fail', message: '게임 검증 실패' });
    return;
  }

  const checkHighScore = 0; // 모든 유저 하이 스코어 체크
  if (verification && serverScore > checkHighScore) {
    io.emit('highscore', { highscore: serverScore });
  }

  socket.emit('gameEnd', { status: 'success', message: '게임종료', serverScore });
};
