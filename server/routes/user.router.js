import express from 'express';
import {prisma} from '../util/prisma/index.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const IDRULES = /^[a-z|A-Z|0-9]+$/;
const router = express.Router();

router.post('/sign-up', async(req,res,next)=>{
    const {id, password, paswrodconfirm } = req.body;
    const isExistUser = await prisma.user.findFirst({
        where:{
            userId,
        },
    });
    if(isExistUser){
        return res.status(409).json({message:'이미 존재하는 아이디 입니다'}); // status code 409 conflict
    }else if(!IDRULES.test(userId)){
        return res.status(400).json({message:'아이디는 영어 소문자와 숫자 조합으로 구성되어야 합니다'});
    }else if(password.length<6){
        return res.status(400).json({message:`비밀번호는 최소 6자 이상이여야 합니다`});
    }else if(password !== paswrodconfirm){
        return res.status(400).json({message:'비밀번호는 비밀번호 확인과 일치해야 합니다'});
    }
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    // Create new user
    await prisma.users.create({
        data:{userId,password:hashedPassword},
    });

    return res.status(201).json({message:'회원가입이 완료되었습니다'});
})

router.post('/sign-in', async(req, res, next)=>{
    const { userId, password } = req.body;
    const user = await prisma.users.findFirst({where : {userId}});
    if(!user){
        return res.status(401).json({message: '존재하지 않는 아이디입니다'});
    }
    else if(!(await bcrypt.compare(password, user.password))){
        return res.status(401).json({message : '비밀번호가 일치하지 않습니다.'});
    }
    const token = jwt.sign({
        userId : user.userId,
    },
    process.env.CUSTOM_SECRET_KEY,
    );

    res.setHeader('Authorization',`Bearer ${token}`)
    return res.status(200).json({message:'로그인 성공'});
})

export default router;