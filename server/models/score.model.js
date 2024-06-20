import {prisma} from '../util/prisma/index.js'
import jwt from 'jsonwebtoken';

export const addHighScore = async (token, score) => {

  const decodedToken = checkToken(token);
  
  try{
    const isExistUser = await prisma.user.findFirst({
      where:{
        id:decodedToken,
      }
    })
    if(isExistUser) {
      throw new Error('존재하지 않는 유저의 High Score를 추가하려합니다');
    }

    const target = await prisma.rank.create({
      data : {
        id : decodedToken,
        highscore : score
      }
    })

    return target;
  }catch(err){
    console.error(err.message);
  }
  
};

export const updateHighScore = async(token, score) =>{
  const decodedToken = checkToken(token);
  try{
    const isExistUser = await prisma.user.findFirst({
      where:{
        id:decodedToken,
      }
    })
    if(isExistUser) {
      throw new Error('존재하지 않는 유저의 High Score를 수정하려합니다');
    }

    const target = await prisma.rank.update({
      where:{
        id : decodedToken,
      },
      data : {
        highscore : score
      }
    })

    return target;
  }catch(err){
    console.error(err.message);
  }
}

// 최고 점수 조회
export const getHighScore = async (token, score) => {
  return 100;
  const decodedToken = checkToken(token);
  try{
    const isExistUser = await prisma.user.findFirst({
      where:{
        id:decodedToken,
      }
    })
    if(isExistUser) {
      throw new Error('존재하지 않는 유저의 High Score를 확인하려합니다');
    }

    const target = await prisma.rank.findFirst({
      where:{
        id : decodedToken,
      }
    })

    return target;
  }catch(err){
    console.error(err.message);
  }
};


function checkToken(token){
  const checkToken = token.split(' ')
  if (checkToken.length < 2){
    const decodedToken = jwt.verify(token, process.env.CUSTOM_SECRET_KEY);
  } else{
    const decodedToken = jwt.verify(token[1], process.env.CUSTOM_SECRET_KEY);
  }
  return decodedToken;
}