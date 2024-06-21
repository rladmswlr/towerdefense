import { clearMonster } from '../models/monster.model.js';
import { clearTower } from '../models/tower.model.js';
import { getHighScore, getHightScoreUsers, updateHighScore } from '../models/score.model.js';
import { getUserById } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const gameStart = (uuid) => {
  clearTower(uuid);
  clearMonster(uuid);
};

export const gameEnd = async (userId, payload, socket) => {
  try {
    const { score } = payload.payload;
    let serverScore = 0;
    let verification = false;

    const user = getUserById(userId);
    if (user.score == score) verification = true;

    if (!verification) {
      socket.emit('gameEnd', { status: 'fail', message: '게임 검증 실패' });
      return;
    }

    const token = socket.handshake.query.token.split(' ');
    let personalRecord = 0;
    let fullRecord = 0;

    const decodedToken = jwt.verify(token[1], process.env.CUSTOM_SECRET_KEY);
    personalRecord = await getHighScore(decodedToken);
    fullRecord = await getHightScoreUsers();

    if (personalRecord.highscore < score) updateHighScore(decodedToken, score);

    socket.emit('gameEnd', { status: 'success', message: '게임종료', serverScore });
  } catch (err) {
    console.error(err.message);
  }
};
