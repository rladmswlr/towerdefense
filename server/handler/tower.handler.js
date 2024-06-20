import { getTower, setAttackTower, setTower } from '../models/tower.model.js';

// 타워 초기 세팅 값
// 후에 asset의 저장되어있는 값으로 바뀔 수 있음
const numOfInitialTowers = 3;

//초기 타워 세팅 이벤트
export const initTower = (userId, payload) => {
  //타워의 갯수가 기존 Initial tower의 갯수보다 많은지 체크
  if (numOfInitialTowers < payload.towersnum) {
    return { status: 'fail', message: 'The initial number of towers was exceeded.' };
  }

  const serverTime = Date.now(); // 현재 타임스탬프

  //타워의 데이터 저장
  setTower(userId, payload.towerId, payload.position, serverTime);
  return { status: 'success' };
};

export const buyTower = (userId, payload) => {
  //타워의 가격 비교
  if (payload.userGold < payload.towerCost) {
    return { status: 'fail', message: 'There is little gold.' };
  }

  const serverTime = Date.now(); // 현재 타임스탬프

  //타워의 데이터 저장
  setTower(userId, payload.towerId, payload.position, serverTime);
  return { status: 'success' };
};

export const attackTower = (userId, payload) => {
  //payload로 입력받는 정보
  //타워 position , 몬스터 position, 타워의 사거리정보

  const towers = getTower(userId);

  //타워의 데이터 찾기 현재 때린 타워의 ID를 기반으로 저장된 타워를 찾는다.
  const tower = towers.find((data) => data.id === payload.towerId);

  //해당 Id의 타워가 존재하는지 체크
  if (!tower) {
    return { status: 'fail', message: 'There is No Tower' };
  }

  // 해당 위치의 타워가 존재하는지 체크
  if (tower.towerpos.x != payload.towerpos.x && tower.towerpos.y != payload.towerpos.y) {
    return { status: 'fail', message: 'Position is Not Matching' };
  }

  const towerdistance = Math.sqrt(
    Math.pow(tower.towerpos.x - monster.x, 2) + Math.pow(tower.towerpos.y - monster.y, 2),
  );

  //타워의 사거리 체크
  if (payload.towerRange <= towerdistance) {
    return { status: 'fail', message: 'Tower range is not right' };
  }

  const serverTime = Date.now(); // 현재 타임스탬프

  setAttackTower(userId, payload.towerId, serverTime);

  return { status: 'success', message: 'towerattack' };
};
