import { getGameAssets } from "../init/assets.js"
import { clearMonster } from '../models/monster.model.js'
import { clearTower } from '../models/tower.model.js'
import { clearLevel } from '../models/level.model.js'


export const gameStart = (uuid, payload) =>{

    const { init, level, monster, tower  } = getGameAssets();    
    // clear level
    // clearLevel(uuid);
    clearTower(uuid);
    clearMonster(uuid);
    
    return {status: 'success'};
}

export const gameEnd = (uuid, payload) =>{
    
    // 점수 검증

    // 몬스터 데스 카운트

    
    
    
    
    return {status: 'success', message : "Game ended", score};
}