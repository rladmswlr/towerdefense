import { attackTower, buyTower, initTower } from "./tower.handler.js";

const handlerMappings ={
    // Event Handler Mapping
    5:initTower,
    6:buyTower,
    7:attackTower
};

export default handlerMappings