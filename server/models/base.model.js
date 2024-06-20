const bases = {};

export const createBase = (uuid, life) => {
  bases[uuid] = 200; //초기 테스트 값 // life 라는 상수 데이터를 넣어줘야한다.
};

export const getBase = (uuid) => {
  return bases[uuid];
};

export const setBase = (uuid, life) => {
  return (bases[uuid] = life);
};

export const clearBase = (uuid) => {
  bases[uuid] = 200; //초기 테스트 값
};
