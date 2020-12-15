import React, { useState, useEffect, useCallback } from 'react';
import { 
  initFields, 
  getFoodPosition, 
  isCollision, 
  isEatingMysellf 
} from '../utils';
import {
  initialPosi,
  initialValues,
  initialPosition,
  gameStatusWord,
  GameStatus,
  defaultDifficulty,
  directionWord,
  Direction,
  Difficulty,
  defaultInterval,
  OppositeDirection,
  DirectionKeyCodeMap,
  Delta
} from '../constants';

export const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer)
};

let timer: NodeJS.Timer | undefined = undefined;

const useSnakeGame = () => {
  const [ fields, setFields ] = useState<string[][]>(initialValues);
  const [ body, setBody ] = useState<initialPosi[]>(initialPosition);
  const [status, setStatus] = useState<gameStatusWord>(GameStatus.init);
  const [ difficulty, setDifficulty ] = useState(defaultDifficulty);
  const [ tick, setTick ] = useState<number>(0);
  const [ direction, setDirection ] = useState<directionWord>(Direction.up);

  useEffect(() => {
    setBody(initialPosition);
    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      setTick(tick => tick +1);
    }, interval);
    return unsubscribe;
  }, [difficulty]);

  useEffect(() => {
    if (!body.length || status !== GameStatus.playing) {
      return
    }
    const canContinue = handleMoving();
    if(!canContinue) {
      unsubscribe()
      setStatus(GameStatus.gameover)
    }
  }, [tick]);

  const start = (): void => setStatus(GameStatus.playing);
  const stop = (): void => setStatus(GameStatus.suspended);
  const reload = (): void => {
    timer = setInterval(() => {
      setTick(tick => tick + 1);
    }, defaultInterval);
    setDirection(Direction.up);
    setStatus(GameStatus.init);
    setBody(initialPosition);
    setFields(initFields(35, ...initialPosition));
  };

  const updateDirection = useCallback((newDirection: directionWord): directionWord | void => {
    if(status !== GameStatus.playing) {
      return direction;
    };
    if (OppositeDirection[direction] === newDirection) {
      return;
    };
    setDirection(newDirection);
  }, [direction, status]);

  const updateDifficulty = useCallback((difficulty: number): void => {
    if(status !== GameStatus.init) {
      return;
    };
    if (difficulty < 1 || difficulty > Difficulty.length) {
      return;
    };
    setDifficulty(difficulty);
  }, [status, difficulty]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newDirection = DirectionKeyCodeMap[e.key];
      if(!newDirection) {
        return;
      }
      updateDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [updateDirection]);

  const handleMoving = (): boolean => {
    const { x, y } = body[0];
    const delta: initialPosi = Delta[direction];
    const newPosition: initialPosi = {
      x: x + delta.x,
      y: y + delta.y
    }
    if(isCollision(fields.length, newPosition) || isEatingMysellf(fields, newPosition)) {
      return false;
    };
    const newBody: initialPosi[] = [...body];
    if(fields[newPosition.y][newPosition.x] !== 'food') {
      const removingTrack: initialPosi | undefined = newBody.pop()
      removingTrack && (fields[removingTrack.y][removingTrack.x] = '');
    } else {
      const food = getFoodPosition(fields.length, [...newBody, newPosition]);
      fields[food.y][food.x] = 'food';
    };
    fields[newPosition.y][newPosition.x] = 'snake';
    newBody.unshift(newPosition)
    setBody(newBody);
    setFields(fields);
    return true;
  };
  return {
    body,
    difficulty,
    fields,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  };
};

export default useSnakeGame;
