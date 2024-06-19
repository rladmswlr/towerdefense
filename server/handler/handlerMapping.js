import { initializeGameHandler, syncGameStateHandler } from './sync.handler';
import { removeMonster, damageMonster, monsterAttackBase } from './monster.handler';

const handlerMappings = {
  1: initializeGameHandler,
  2: syncGameStateHandler,
  12: removeMonster,
  13: damageMonster,
  14: monsterAttackBase,
};

export default handlerMappings;
