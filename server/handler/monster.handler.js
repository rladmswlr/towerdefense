import { getGameAssets } from '../init/assets.js'; // 임의로 작성
import { getTower } from '../models/tower.model.js'; // 임의로 작성
import { getUser } from '../models/user.model.js';
import { setMonster, setDieMonster } from '../models/monster.model.js';

export const removeMonster = (userId, payload, socket) => {
  // game.js 227번째 줄
  if (payload.hp > 0) {
    return { status: 'fail', message: '비정상적인 제거입니다.' };
  }

  setDieMonster(userId, payload.monster);

  // 현재 score에 +100을 추가
  const userGameState = getUser(userId);
  userGameState.score += 100;

  // 업데이트된 게임 상태를 클라이언트에 전송
  socket.emit('updateGameState', {
    score: userGameState.score,
  });

  return { status: 'success', handler: 12 };
};

export const damageMonster = (userId, payload) => {
  const { towerId, attackPower } = payload; // game.js 201번째 줄

  // console.log(towerId);

  // console.log(attackPower);

  const towers = getTower(userId); // 임의로 작성
  console.log(towers);
  const tower = towers.find((tower) => tower.id === towerId);
  if (!tower) {
    return { status: 'fail', message: '존재하지 않는 타워입니다.' };
  }

  if (attackPower !== 40) {
    return { status: 'fail', message: '타워의 공격력이 잘못되었습니다.' };
  }

  return { status: 'success', handler: 13 };
};

export const monsterAttackBase = (userId, payload) => {
  const { monstersData, monsterLevelsData } = getGameAssets(); // 임의로 작성

  const { monsterId, level, attackPower } = payload; // monster.js 46번째 줄

  const monster = monstersData.find((monster) => monster.id === monsterId);
  if (!monster) {
    return { status: 'fail', message: '존재하지 않는 몬스터입니다.' };
  }

  const levelInfo = monsterLevelsData.find((l) => l.id === level);
  if (!levelInfo) {
    return { status: 'fail', message: '존재하지 않는 몬스터 레벨입니다.' };
  }

  if (monster.level !== level) {
    return { status: 'fail', message: '몬스터의 레벨이 잘못되었습니다.' };
  }

  if (levelInfo.power !== attackPower) {
    return { status: 'fail', message: '몬스터의 공격력이 잘못되었습니다.' };
  }

  setMonster(userId, monsterId);

  // 기지의 HP를 감소
  const userGameState = getUser(userId);
  userGameState.baseHp -= attackPower;
  if (userGameState.baseHp < 0) userGameState.baseHp = 0; // 기지 HP가 음수가 되지 않도록 조정

  // 업데이트된 게임 상태를 클라이언트에 전송
  socket.emit('updateGameState', {
    baseHp: userGameState.baseHp,
  });

  return { status: 'success', handler: 14 };
};
