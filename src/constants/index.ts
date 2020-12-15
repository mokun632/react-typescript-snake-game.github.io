import { initFields } from '../utils';

type initDelta = {[word: string]: initialPosi};
export type gameStatusWord = 'init' |'playing' | 'suspended' | 'gameover';
type gameStatusInit = {
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover',
};
export const GameStatus: Readonly<gameStatusInit> = {
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover',
};
export type directionWord = 'up' | 'right' | 'left' | 'down';
type directionInit = {
  up: 'up' | 'down',
  right: 'right' | 'left',
  left: 'left' | 'right',
  down: 'down' | 'up',
};
export const Direction: Readonly<directionInit> = {
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down',
};
export const OppositeDirection: Readonly<directionInit> = {
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up',
};
export const DirectionKeyCodeMap: Readonly<{[KeyboardEvent: string]: directionWord}> = {
  w: Direction.up,
  a: Direction.left,
  d: Direction.right,
  s: Direction.down
}
export type initialPosi = {x: number, y: number};
export const initialPosition: Required<[initialPosi]> = [{ x: 17, y: 17 }]
export const Delta: initDelta = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
};
const fieldSize: Readonly<number> = 35
export const initialValues: Required<string[][]> = initFields(fieldSize, ...initialPosition);
export const defaultInterval: Readonly<number> = 100;
export const defaultDifficulty: number = 3;

export const Difficulty: Readonly<number[]> = [1000, 500, 100, 50, 10];