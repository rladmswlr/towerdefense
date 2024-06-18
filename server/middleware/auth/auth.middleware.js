import jwt from 'jsonwebtoken';
import {prisma} from '../util/prisma/index.js';

export default async function(req, res, next){
 try{
    
    const { authorization } = req.headers;
    if (!authorization) throw new Error('토큰이 존재하지 않습니다.');
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer')
      throw new Error('토큰 타입이 일치하지 않습니다.');
    const decodedToken = jwt.verify(token, process.env.CUSTOM_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await prisma.users.findFirst({
        where : {
            userId : userId
        }
    });
    if(!user){
        throw new Error('토큰 사용자가 존재하지 않습니다.');
    }
    req.user=user;
    next();

 }  catch{
    switch(error.name){
        case 'TokenExpiredError' :
            return res.status(401).json({message:'토큰이 만료되었습니다.'});
        case 'JsonWebTokenError' :
            return res.status(401).json({message:'토큰이 조작되었습니다'});
        default :
            return res.status(401).json({message:error.message ?? '비정상적인 요청입니다'})
    }
 } 
}