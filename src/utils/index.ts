import { initialPosi } from '../constants';
import { unsubscribe } from '../hooks/useSnakGame';

export const getFoodPosition = (fieldSize: number, excludes: initialPosi[]) => {
  while(true) {
    const x = Math.floor(Math.random() * (fieldSize -5)) +1;
    const y = Math.floor(Math.random() * (fieldSize -5)) +1;
    const conflict = excludes.some(item => item.x === x && item.y === y)
    if(!conflict) {
      return {x, y}
    }
  }
};

export const initFields = (fieldSize: number, snake: initialPosi) => {
  const fields: string[][] = [];
  for(let i = 0; i < fieldSize; i++){
    const cols: string[] = new Array(fieldSize).fill('');
    fields.push(cols);
  };
  fields[snake.x][snake.y] = 'snake';

  const food = getFoodPosition(fieldSize, [snake]);
  fields[food.y][food.x] = 'food';

  return fields;
};

export const isCollision = (fieldSize: number, position: initialPosi) => {
  if(position.y < 0 || position.x < 0) {
    return true;
  };
  if(position.y > fieldSize -1 || position.x > fieldSize -1) {
    unsubscribe()
    return true;
  };
  return false;
};

export const isEatingMysellf = (fields: string[][], position: initialPosi) => {
  return fields[position.y][position.x] === 'snake';
};
