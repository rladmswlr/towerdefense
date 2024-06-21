import { Base } from './base.js';
import { Monster } from './monster.js';
import { GoldenMonster } from './goldenMonster.js';
import { Tower } from './tower.js';
import { CLIENT_VERSION } from './Constants.js';

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/
let userId;

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 6; // 몬스터 개수

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력

let towerCost = 500; // 타워 구입 비용
let monsterLevel = 0; // 몬스터 레벨
let monsterSpawnInterval = 1800; // 몬스터 생성 주기
let goldenMonsterSpanwInterval = 1800;
let numOfInitialTowers = 0;
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;
let isDeath = false;

let towerId = 0;
let isrefund = false;
let isupgrade = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImage = new Image();
towerImage.src = 'images/tower.png';

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
let goldenMonsterImages = null;
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  if(i==6){
    console.log("골든이미지 할당됨");
    goldenMonsterImages=img;
  }
  else monsterImages.push(img);
}

let monsterPath;
let lastX;

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width-120) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width-110) {
      currentX = canvas.width-110;
    }
    
    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 220) {
      currentY = 220;
    }
    if (currentY > canvas.height-80) {
      currentY = canvas.height-80;
    }

    path.push({ x: currentX, y: currentY });
  }
  const len = path.length;

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width-10, canvas.height-20); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;
    

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
  lastX = x + width + 60;   // 대략적인 길 끝지점
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);
  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: ((posX+offsetX)<=40) ? 40 : ((posX+offsetX)>=canvas.width-80) ? canvas.width-80 : posX+offsetX,
    y: ((posY+offsetY)<=60) ? 60 : ((posY+offsetY)>=canvas.height-150) ? canvas.height-150 : posY+offsetY,
  };
}

function placeInitialTowers() {
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(towerId, x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);
    //타워의 생성 정보를 보냄 towerId, position , tower의 갯수
    sendEvent(5, { towerId: towerId, position: { x: x, y: y }, towersnum: towers.length });
    towerId++; //타워를 다 만들었다면 타워 Id를 더해준다.
  }
}

function placeNewTower() {
  /* 
    타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치하면 됩니다.
    빠진 코드들을 채워넣어주세요! 
  */
  if (userGold >= towerCost) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(towerId, x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);
    //타워의 생성 정보를 보냄 towerId, position , user의 현재골드, tower의 비용
    sendEvent(6, {
      towerId: towerId,
      position: { x: x, y: y },
      userGold: userGold,
      towerCost: towerCost,
    });
    towerId++; //타워를 다 만들었다면 타워 Id를 더해준다.
    userGold -= towerCost;
  }
}

function refundTower() {
  if(isrefund){
    isrefund = false;
  }
  else{
    isrefund = true;
    isupgrade = false;
  }
}

function updateTower() {
  if(isupgrade){
    isupgrade = false;
  }
  else{
    isupgrade = true;
    isrefund = false;
  }
}

//타워 클릭 이벤트
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const towerRangeX = 30;
  const towerRangeY = 30;

  for (let i = 0; i < towers.length; i++) {
    const tower = towers[i];

    const towerCenterX = tower.x + tower.width / 2;
    const towerCenterY = tower.y + tower.height / 2;

    const deltaX = Math.abs(towerCenterX - clickX);
    const deltaY = Math.abs(towerCenterY - clickY);

    if (deltaX <= towerRangeX && deltaY <= towerRangeY && isrefund) {
      sendEvent(8, {towerId : tower.towerId, towerpos: {x : tower.x , y : tower.y}});
      towers.splice(i, 1);
    }

    else if(deltaX <= towerRangeX && deltaY <= towerRangeY && isupgrade) {
      sendEvent(9, {towerId : tower.towerId, towerpos: {x : tower.x , y : tower.y}, level:tower.level});
    }
  }
});

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  if(lastX>=1920) lastX=1920;
  base = new Base(lastX, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  const nowRate = Math.floor(Math.random() * 100 + 1);
  if(nowRate<=10){
    monsters.push(new GoldenMonster(monsterPath, goldenMonsterImages, monsterLevel));
  } else{
    monsters.push(new Monster(monsterPath, monsterImages, monsterLevel));  
  }
}


function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시


  if(isrefund){
    ctx.fillStyle = 'black';
    ctx.fillText(`타워 환불 모드 ON`, 800, 150);
  }

  if(isupgrade){
    ctx.fillStyle = 'black';
    ctx.fillText(`타워 강화 모드 ON`, 800, 150);
  }

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDeath) {
        /* 게임 오버 */
        sendEvent(20,{ payload: {userId, score} });
        isDeath = false;
        alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
        location.reload();
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monsters.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (isInitGame) {
    return;
  }

  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치
  
  
  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

const initializeGameState = (initialGameData) => {
  userGold = initialGameData.userGold;
  baseHp = initialGameData.baseHp;
  towerCost = initialGameData.towerCost;
  numOfInitialTowers = initialGameData.numOfInitialTowers;
  monsterLevel = initialGameData.monsterLevel;
  monsterSpawnInterval = initialGameData.monsterSpawnInterval;
  score = initialGameData.score;
};

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  const token = localStorage.getItem('accessToken');
  serverSocket = io('http://localhost:8080', {
    query: {
      token: token,
      clientVersion: CLIENT_VERSION,
    },
    auth: {
      token: token,
    },
  });

  /* 
    서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다! 
    e.g. serverSocket.on("...", () => {...});
    이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다! 
    if (!isInitGame) {
      initGame();
    }
  */

  const handlerMappings = {
    // 서버에서부터 받은 이벤트 코드
    1: (data) => {
      if (data.status === 'success') {
        initializeGameState(data.data.data.data);
      } else {
        console.error(`초기화에 실패하였습니다. ${data.message}`);
      }
    },
    2: (data) => {
      if (data.status === 'success') {
        updateGameState(data.data);
      } else {
        console.error(`동기화에 실패하였습니다. ${data.message}`);
      }
    },
    9: (data) => {
      if (data.status === 'success') {
        updateTowerState(data.data)
      } else {
        console.error(`동기화에 실패하였습니다. ${data.message}`);
      }
    },
    // 계속 추가
  };

  serverSocket.on('response', async (data) => {
    // helper.js의 socket.emit('response', response);

    const handler = handlerMappings[data.handlerId];
    if (handler) {
      handler(data);
    } else {
      console.log(data);
    }
  });

  serverSocket.on('connection', async (data) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      console.log(`클라이언트 정보가 확인됐습니다. ${token}`);
      userId = token;
    } else {
      userId = data.uuid;
      window.localStorage.setItem('accessToken', userId);
      console.log(`클라이언트 정보가 확인되지 않았습니다. ${userId}`);
    }
    // 초기 게임 데이터 요청

    highScore = data.highScore;

    sendEvent(1, { payload: userId });

    sleep(100).then(() => {
      if (!isInitGame) {
        initGame();
      }
    });
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  serverSocket.on('updateGameState', (syncData) => {
    console.log('Received updateGameState:', syncData);
    updateGameState(syncData);
  });


  serverSocket.on('updateTowerState', (syncData) => {
    console.log('Received updateTowerState:', syncData);
    updateTowerState(syncData);
  });

  serverSocket.on('')
});

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', placeNewTower);

document.body.appendChild(buyTowerButton);


const refundTowerButton = document.createElement('button');
refundTowerButton.textContent = '타워 환불';
refundTowerButton.style.position = 'absolute';
refundTowerButton.style.top = '10px';
refundTowerButton.style.right = '150px';
refundTowerButton.style.padding = '10px 20px';
refundTowerButton.style.fontSize = '16px';
refundTowerButton.style.cursor = 'pointer';

refundTowerButton.addEventListener('click', refundTower);

document.body.appendChild(refundTowerButton);

const upgradeTowerButton = document.createElement('button');
upgradeTowerButton.textContent = '타워 강화';
upgradeTowerButton.style.position = 'absolute';
upgradeTowerButton.style.top = '170px';
upgradeTowerButton.style.right = '10px';
upgradeTowerButton.style.padding = '10px 20px';
upgradeTowerButton.style.fontSize = '16px';
upgradeTowerButton.style.cursor = 'pointer';

upgradeTowerButton.addEventListener('click', updateTower);

document.body.appendChild(upgradeTowerButton);

const sendEvent = (handlerId, payload) => {
  serverSocket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const updateGameState = (syncData) => {
  userGold = syncData.userGold !== undefined ? syncData.userGold : userGold;
  baseHp = syncData.baseHp !== undefined ? syncData.baseHp : baseHp;
  score = syncData.score !== undefined ? syncData.score : score;
  isDeath = syncData.isDeath !== undefined ? syncData.isDeath : isDeath;
  monsterLevel = syncData.monsterLevel !== undefined ? syncData.monsterLevel : monsterLevel;
};

const updateTowerState = (syncData) => {
  const towerdata = towers.find((data) => data.towerId === syncData.towerId)
  if(towerdata){
      towerdata.level = syncData.towerLevel!== undefined ? syncData.towerLevel + 1 : 1;
    }
};  

export { sendEvent };
