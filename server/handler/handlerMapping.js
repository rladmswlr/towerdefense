import { attackTower, buyTower, initTower } from "./tower.handler.js";
import { updateScore } from "./level.handler.js";

const handlerMappings ={
    // Event Handler Mapping
    5:initTower,
    6:buyTower,
    7:attackTower,
    12:updateScore
};

export default handlerMappings