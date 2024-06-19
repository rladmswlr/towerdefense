import { initializeGameHandler, syncGameStateHandler } from './sync.handler';
import { removeMonster, damageMonster, monsterAttackBase } from './monster.handler';
import { attackTower, buyTower, initTower } from './tower.handler.js';

const handlerMappings = {
  1: initializeGameHandler,
  2: syncGameStateHandler,
  5: initTower,
  6: buyTower,
  7: attackTower,
  12: removeMonster,
  13: damageMonster,
  14: monsterAttackBase,

export default handlerMappings;
