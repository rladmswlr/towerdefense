import {Monster} from './monster.js'

export class GoldenMonster extends Monster {
  constructor(path, monsterImages, level) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    super(path, monsterImages, level);
    this.image = monsterImages;
    this.isGolden = true;
  }

  init(level) {
    this.maxHp = 200 + 20 * level; // 몬스터의 현재 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.attackPower = 10 + 1 * level; // 몬스터의 공격력 (기지에 가해지는 데미지)
  }

  move(base) {
    super.move(base);
  }

  draw(ctx) {
    super.draw(ctx);    
  }
}

