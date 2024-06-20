const users = [];

export const addUser = (token, init, socket) => {
  console.log('Received init object:', init);
  const newUser = {
    token: token,
    userGold: init.data.userGold,
    baseHp: init.data.baseHp,
    towerCost: init.data.towerCost,
    numOfInitialTowers: init.data.numOfInitialTowers,
    monsterLevel: init.data.monsterLevel,
    monsterSpawnInterval: init.data.monsterSpawnInterval,
    score: init.data.score,
    highScore: 0,
    socketId: socket,
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
