# 2GETHER - Tower Defense Game

## ✨ AWS 배포 링크

- [타워 디펜스](http://naver.com)

## 👋 소개

- **2GETHER**는 2팀의 2와 화합의 TOGETHER를 조합하여 서로의 힘을 모아 하나로 통합된 팀워크와 협력을 상징하는 팀 이름입니다.
- 우리 팀은 타워들을 게임 맵 상에 배치를 한 후에 몰려오는 적들을 끊임없이 격퇴해 나가는 Plants VS Zombies 게임을 오마주한 **타워 디펜스 게임**를 제작합니다.

## 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/rladmswlr"><img src="https://avatars.githubusercontent.com/u/37393922?v=4" width="100px;" alt=""/><br /><sub><b> 팀장 : 김은직 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/Kdkplaton"><img src="https://avatars.githubusercontent.com/u/160683826?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 김동규 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/KEastWiseman"><img src="https://avatars.githubusercontent.com/u/167056939?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 김동현 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/wjdrbsgkrry"><img src="https://avatars.githubusercontent.com/u/67831170?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 박정균 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/mimihimesama"><img src="https://avatars.githubusercontent.com/u/106059492?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 황정민 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## ⚙️ Backend 기술 스택

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">

<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">

<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

<img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white">

<img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101">

## 📄 프로젝트 도큐먼트

### [API명세서](https://chiseled-approval-5a0.notion.site/Node-js-Team-2Gether-3e7cd61c55844e3dbf4d3cbace30a2b8?pvs=4)

### [이벤트 구조](https://chiseled-approval-5a0.notion.site/Node-js-Team-2Gether-5192af4f30ef457fbaae7fce1ae67ad8?pvs=4)

### ERD Diagram

![erd4](https://github.com/rladmswlr/towerdefense/assets/106059492/8f5ef8ec-9f88-4216-b8cb-28ae44aaa720)

## ⚽ 프로젝트 주요 기능

1. **회원가입 / 로그인 기능 (REST API로 통신)**

   - 회원가입 시 DB에 유저 정보를 저장합니다.

   - JWT Token을 생성하여 로그인 시 유저의 헤더의 Bearer Token을 저장합니다.

2. **유저 별 게임 데이터 관리**

   - 클라이언트 코드에 있는 게임 데이터는 서버에서 관리하고 있는 init 파일을 이용하여 token을 가진 새로운 유저가 등록될 때마다 서버로부터 초기 데이터값을 받습니다.

   - 클라이언트에서 발생한 이벤트를 받은 서버는 계산 로직과 payload 검증을 실행한 후 결과값과 검증 결과를 반환합니다.

3. **클라이언트가 서버로부터 수신하는 이벤트 종류 정의 및 코드 구현 (WebSocket으로 통신)**

   - **커넥션 성공 이벤트**

     - 최초 접속 시 유저에게 token을 부여하고, 이후 같은 아이디로 접속하면 웹 브라우저의 localstorage에서 토큰을 가져옵니다.

   - **커넥션 실패 이벤트**

     - 토큰 검증 실패 시 `socket.disconnect`로 연결을 종료합니다.

   - **상태 동기화 이벤트**
     - **초기화**
       - `initializeGameHandler` 핸들러를 통해 `userGameState`로 초기 데이터 값을 수신 받습니다.
     - **기지**
       - `checkForBreak` 핸들러를 통해 기지의 hp를 검증하고 파괴 여부를 수신 받습니다.
     - **몬스터**
       - `damageMonster` 핸들러를 통해 타워 ID와 공격력을 검증하고 결과를 반환받습니다.
       - `removeMonster` 핸들러를 통해 몬스터의 hp를 검증하고 몬스터가 제거된 경우 해당 유저의 스코어를 +100점 한 후 현재 스코어를 `updateGameState`로 클라이언트에게 전달합니다. 스코어가 2000의 배수가 될 경우 유저 골드에 +1000, 레벨을 +1한 후 `updateGameState`로 클라이언트에게 전달합니다.
       - `monsterAttackBase` 핸들러를 통해 몬스터의 레벨과 공격력을 검증하고 기지의 HP를 몬스터의 공격력만큼 감소시켜 현재 baseHp를 `updateGameState`로 클라이언트에게 전달합니다.
     - **타워**
       - `initTower` 핸들러를 통해 설치된 타워의 개수와 초기 값을 비교하여 검증 결과를 반환 받습니다.
       - `buyTower` 핸들러를 통해 서버는 해당 유저의 골드를 towerCost만큼 차감하고 현재 골드를 클라이언트에게 전달합니다.
       - `refundTower` 핸들러를 통해 서버는 해당 유저의 골드를 towerCost의 절반만큼 돌려주고 현재 골드를 클라이언트에게 전달합니다.
       - `attackTower` 핸들러를 통해 타워의 존재, 위치, 몬스터와의 사거리를 검증하여 결과를 클라이언트에게 반환합니다.

4. **클라이언트가 서버로 송신하는 이벤트 종류 정의 및 코드 구현 (WebSocket으로 통신)**

   - **게임 시작 이벤트**

     - 커넥션에 성공하면 서버로 초기화 요청 이벤트를 보냅니다.

   - **최초 타워 추가 이벤트**

     - 최초로 타워가 추가되면 해당 타워의 ID, { x, y } 좌표, 타워의 개수를 서버로 송신합니다.

   - **타워 구입 이벤트**

     - 타워를 구매하고 해당 타워의 ID, { x, y } 좌표, 유저 골드, 타워 비용을 서버로 송신합니다.

   - **몬스터 죽이는 이벤트**

     - 몬스터가 타워에 공격을 받아서 hp가 0이 된 경우 몬스터의 정보를 서버로 송신합니다.

   - **게임 종료 이벤트**
     - 기지가 파괴되면 해당 유저의 점수를 서버로 송신합니다.

5. **유저 별 최고 기록 스코어 저장**
   - 인증된 유저의 userId를 가지고 각 유저의 최고 점수를 DB에 저장하고 모든 유저 중 최고 점수를 인게임에 표시합니다.

## 🚀 추가 구현 기능

#### **🔄 타워 환불 기능**

- 타워 구매 아래에 `타워 환불` 버튼을 생성하여 버튼 클릭시 타워 환불 모드가 실행되고 클릭한 타워 회수와 towerCost의 절반을 userGold에 반환합니다. 버튼을 한 번 더 클릭하여 환불 모드를 해제할 수 있습니다.

#### **🆙 특정 타워 업그레이드 기능**

- 타워 환불 아래에 `타워 강화` 버튼을 생성하여 버튼 클릭시 타워 강화 모드가 실행되고 클릭한 타워 강화와 해당 타워 레벨의 강화 비용이 userGold에서 차감됩니다. 타워 레벨마다 공격력이 증가하고 강화 성공 확률이 내려갑니다. 버튼을 한 번 더 클릭하여 강화 모드를 해제할 수 있습니다.

#### **💰 보물 고블린 몬스터 출연 기능**

- 몬스터 스폰 시점에 특정 확률을 부여하여 25%의 확률로 보물 고블린이 출현합니다. 보물 고블린은 일반 몬스터보다 2배의 HP를 갖고 있으며 타워 공격으로 제거에 성공할 시 +500 골드를 현재 userGold에 반환받습니다.

#### **🔊 게임 효과음 추가**

- 몬스터 제거, 보물 고블린 제거, 기지 피격 시마다 해당하는 효과음이 발생합니다.

#### **🪄 인게임 UI 개선**

- 각각의 타워 위에 해당 타워의 레벨과 공격력이 표시됩니다.
- 타워의 레벨에 따라 레이저의 색깔이 변화됩니다.
