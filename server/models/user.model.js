const users = [];

export const addUser = (user) => {
  const newUser = {
    ...user,
    userGold: 1000,
    baseHp: 100,
    towerCost: 200,
    numOfInitialTowers: 3,
    monsterLevel: 1,
    monsterSpawnInterval: 5000,
    score: 0,
    highScore: 0,
  };
  users.push(newUser);
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

export const getUserById = (userId) => {
  return users.find((user) => user.uuid === userId);
};
