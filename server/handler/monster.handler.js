import { getGameAssets } from '../init/assets.js'; // 임의로 작성
import { getTower } from '../models/tower.model.js'; // 임의로 작성
import { setMonster, setDieMonster } from '../models/monster.model.js';

export const removeMonster = (userId, payload) => { // game.js 227번째 줄
  if (payload.hp > 0) {
    return { status: 'fail', message: '비정상적인 제거입니다.' };
  }

  setDieMonster(userId, payload.id);

  return { status: 'success', handler: 12 };
};

export const damageMonster = (userId, payload) => {
  const { towerId, attackPower } = payload; // game.js 201번째 줄

  const towers = getTower(userId); // 임의로 작성
  const tower = towers.find((tower) => tower.id === towerId);
  if (!tower) {
    return { status: 'fail', message: '존재하지 않는 타워입니다.' };
  }

  if ( attackPower !== 40 ) {
    return { status: 'fail', message: '타워의 공격력이 잘못되었습니다.' };
  }

  return { status: 'success', handler: 13 };
}

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

  setMonster(userId, monsterId)

  return { status: 'success', handler: 14 };
};
