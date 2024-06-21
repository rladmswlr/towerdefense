import { prisma } from '../util/prisma/index.js';

export const addHighScore = async (token, score) => {
  try {
    const isExistUser = await prisma.user.findFirst({
      where: {
        user_Id: token.userId,
      },
    });
    if (!isExistUser) {
      throw new Error('존재하지 않는 유저의 High Score를 추가하려합니다');
    }

    const target = await prisma.rank.create({
      data: {
        user_Id: token.userId,
        highscore: score,
      },
    });

    return target;
  } catch (err) {
    console.error(err.message);
  }
};

export const updateHighScore = async (token, score) => {
  try {
    const isExistUser = await prisma.user.findFirst({
      where: {
        user_Id: token.userId,
      },
    });
    if (!isExistUser) {
      throw new Error('존재하지 않는 유저의 High Score를 수정하려합니다');
    }

    const target = await prisma.rank.update({
      where: {
        user_Id: token.userId,
      },
      data: {
        highscore: score,
      },
    });

    return target;
  } catch (err) {
    console.error(err.message);
  }
};

export const getHighScore = async (token) => {
  console.log('token 확인>>', token);
  try {
    const isExistUser = await prisma.user.findFirst({
      where: {
        user_Id: token.userId,
      },
    });
    if (!isExistUser) {
      throw new Error('존재하지 않는 유저의 High Score를 확인하려합니다');
    }

    const target = await prisma.rank.findFirst({
      where: {
        user_Id: token.userId,
      },
    });

    return target;
  } catch (err) {
    console.error(err.message);
  }
};

// 최고 점수 조회
export const getHightScoreUsers = async () => {
  try {
    const scoreList = await prisma.rank.findMany({
      orderBy: {
        highscore: 'desc',
      },
    });

    return scoreList;
  } catch (err) {
    console.error(err.message);
  }
};
