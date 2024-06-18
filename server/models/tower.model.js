const towerattakcs = {};    //타워의 공격 정보
const towers = {};  //타워의 정보

export const createTowersystem = (uuid) => {
    towerattakcs[uuid] = [];
    towers[uuid] = [];
};

export const getTower = (uuid) => {
    return towers[uuid];
};

export const setTower = (uuid, id, position, timestamp) => {
    return towers[uuid].push({id, position, timestamp})
};

export const setAttackTower = (uuid, id, timestamp) => {
    return towerattakcs[uuid].push({id, timestamp});
};