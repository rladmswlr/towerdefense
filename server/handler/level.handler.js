import "./handlerMapping.js";
import { gainScore, getScore, increaseLevel } from "../models/level.model.js";

export const updateScore = (payload) => {
  // 수정전 점수, 킬 타입, 현재 레벨
  const { score, level } = payload;

  // 변경점 점수 검증
  if(score !== getScore()) { return {status: 'fail', message: '서버의 점수와 불일치' } }

  // 서버측 점수 적용
  gainScore(score+100);
  // 서버측 점수 로드
  const serverScore = getScore();

  // 서버측 점수반영 확인
  if(serverScore !== score+100) {
    console.log("점수 불일치 에러!");
    return { status: 'fail', message: '점수가 서버에 반영되지 않았습니다.' }
  }
  
  // 레벨업 조건부 수행
  increaseLevel();

  return { status: 'success' };
}
