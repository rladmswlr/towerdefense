import { getGameAssets } from '../init/assets.js'; // 임의로 작성
import { getTower } from '../models/tower.model.js'; // 임의로 작성
import { getUserById } from '../models/user.model.js';
import { getMonster, setMonster, setDieMonster } from '../models/monster.model.js';

export const removeMonster = (userId, payload, socket) => {
  // game.js 227번째 줄
  if (payload.hp > 0) {
    return { status: 'fail', message: '비정상적인 제거입니다.' };
  }

  setDieMonster(userId, payload.monster);

  // 현재 score에 +100을 추가
  const userGameState = getUserById(userId);
  console.log(userGameState);
  userGameState.score += 100;

  if (userGameState.score % 2000 === 0) {
    userGameState.userGold += 1000;
    userGameState.monsterLevel += 1;
  }

  // 업데이트된 게임 상태를 클라이언트에 전송
  socket.emit('updateGameState', {
    score: userGameState.score,
    userGold: userGameState.userGold,
    monsterLevel: userGameState.monsterLevel
  });

  return { status: 'success', message: '몬스터를 제거했습니다.' };
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
    console.log('어택파워:', attackPower);
    return { status: 'fail', message: '타워의 공격력이 잘못되었습니다.' };
  }

  return { status: 'success', message: '몬스터를 공격했습니다.' };
};

export const monsterAttackBase = (userId, payload, socket) => {
  const { levelsData } = getGameAssets(); // 임의로 작성

  const { level, attackPower } = payload; // monster.js 46번째 줄

  setMonster(userId, level, attackPower);

  let currentLevels = getMonster(userId);
  currentLevels.sort((a, b) => a.level - b.level);
  const currentLevel = currentLevels[currentLevels.length - 1];

  const powerData = levelsData.data.find((level) => level.power === attackPower);
  if (!powerData) {
    return { status: 'fail', message: '존재하지 않는 파워입니다.' };
  }

  if (currentLevel.attackPower !== powerData.power) {
    return { status: 'fail', message: '현재 레벨의 파워가 아닙니다.' };
  }

  // 기지의 HP를 감소
  const userGameState = getUserById(userId);
  userGameState.baseHp -= attackPower;
  if (userGameState.baseHp < 0) userGameState.baseHp = 0; // 기지 HP가 음수가 되지 않도록 조정

  // 업데이트된 게임 상태를 클라이언트에 전송
  socket.emit('updateGameState', {
    baseHp: userGameState.baseHp,
  });

  return { status: 'success', message: '기지가 공격 당했습니다.' };
};
