import { initializeGameHandler, syncGameStateHandler } from './sync.handler.js';
import { removeMonster, damageMonster, monsterAttackBase } from './monster.handler.js';
import { attackTower, buyTower, initTower, refundTower } from './tower.handler.js';
import { checkForBreak } from './base.handler.js';

const handlerMappings = {
  1: initializeGameHandler,
  2: syncGameStateHandler,
  5: initTower,
  6: buyTower,
  7: attackTower,
  8: refundTower,
  12: removeMonster,
  13: damageMonster,
  14: monsterAttackBase,
  15: checkForBreak,
};

export default handlerMappings;
