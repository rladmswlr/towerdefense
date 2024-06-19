const monsters = {};

export const createMonster = (uuid) => {
  // 생성
  monsters[uuid] = [];
};

export const getMonster = (uuid) => {
  // 조회
  return monsters[uuid];
};

export const setMonster = (uuid, monster) => {
  // 삽입
  return monsters[uuid].push({ monster });
};

export const getDieMonster = (uuid) => {
  return monsters[uuid];
};

export const setDieMonster = (uuid, monster) => {
  return monsters[uuid].push({ monster });
}

export const clearMonster = (uuid) => {
  monsters[uuid] = [];
}
