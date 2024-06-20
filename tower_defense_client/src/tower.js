import { sendEvent } from './game.js';

export class Tower {
  constructor(towerId, x, y, cost) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.towerId = towerId; //타워의 Id값 관리
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = 40; // 타워 공격력
    this.range = 300; // 타워 사거리
    this.cost = cost; // 타워 구입 비용
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.level = 1;
  }

  draw(ctx, towerImage) {
    ctx.drawImage(towerImage, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      if(this.level == 1){
      ctx.strokeStyle = 'skyblue';
      }else if(this.level == 2){
        ctx.strokeStyle = 'yellow';
      }else if(this.level == 3){
        ctx.strokeStyle = 'red';
      }else if(this.level == 4){
        ctx.strokeStyle = 'green';
      }else{
        ctx.strokeStyle = 'black';
      }
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(레벨 ${this.level})`, this.x + 5, this.y - 25);
    ctx.fillText(`(공격력 ${this.attackPower + 10 * (this.level - 1)})`, this.x - 7, this.y + 0);
  }

  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower + 10 * (this.level - 1);
      sendEvent(13, {
        towerId: this.towerId,
        attackPower: this.attackPower,
      });
      if (monster.hp <= 0) {
        sendEvent(12, {
          monster,
        });
      }
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
