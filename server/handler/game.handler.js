import { getGameAssets } from "../init/assets.js"
import { clearMonster } from '../models/monster.model.js'
import { clearTower } from '../models/tower.model.js'
import { clearLevel, setLevel } from '../models/level.model.js'


export const gameStart = (uuid, payload) =>{

    const { init } = getGameAssets();    
    // clear level
    clearLevel(uuid);
    clearTower(uuid);
    clearMonster(uuid);
    setLevel(uuid);
    const data = {init};
    return {status: 'success', payload : data};
}

export const gameEnd = (uuid, payload) =>{
    
    // 점수 검증

    // 몬스터 데스 카운트

    
    
    
    
    return {status: 'success', message : "Game ended", score};
}