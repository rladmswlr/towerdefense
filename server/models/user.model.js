const users = [];

export const addUser = (token, init ,socket) => {
  const newUser = {
    token : token,
    userGold: init.userGold,
    baseHp: init.baseHp,
    towerCost: init.towercost,
    numOfInitialTowers: init.numOfInitialTowers,
    monsterLevel: init.monsterLevel,
    monsterSpawnInterval: init.monsterSpawnInterval,
    score: init.score,
    highScore: 0,
    socketId : socket
  };
  users[token] = newUser;
};

export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = () => {
  return users;
};

export const getUserById = (token) => {
  return users[token];
};
