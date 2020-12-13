import React, { FC, useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import MnipulationPanel from './components/ManipulationPanel';
import { initFields, getFoodPosition } from './utils/index';

type initDelta = {[word: string]: initialPosi};
export type gameStatusWord = 'init' |'playing' | 'suspended' | 'gameover';
type gameStatusInit = {
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover',
};
const GameStatus: Readonly<gameStatusInit> = {
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
const Direction: Readonly<directionInit> = {
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down',
};
const OppositeDirection: Readonly<directionInit> = {
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up',
};
const DirectionKeyCodeMap: Readonly<{[KeyboardEvent: string]: directionWord}> = {
  w: Direction.up,
  a: Direction.left,
  d: Direction.right,
  s: Direction.down
}
export type initialPosi = {x: number, y: number};
const initialPosition: Required<[initialPosi]> = [{ x: 17, y: 17 }]
const Delta: initDelta = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
};
const initialValues: Required<string[][]> = initFields(35, ...initialPosition);
const defaultInterval: Readonly<number> = 100;
const defaultDifficuty: number = 3;

const Difficulty: Readonly<number[]> = [1000, 500, 100, 50, 10];

let timer: NodeJS.Timer | undefined = undefined;

const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer)
};

const isCollision = (fieldSize: number, position: initialPosi) => {
  if(position.y < 0 || position.x < 0) {
    return true;
  };
  if(position.y > fieldSize -1 || position.x > fieldSize -1) {
    unsubscribe()
    return true;
  };
  return false;
};

const isEatingMysellf = (fields: string[][], position: initialPosi) => {
  return fields[position.y][position.x] === 'snake';
};

const App: FC = () => {
  const [ fields, setFields ] = useState<string[][]>(initialValues);
  const [ body, setBody ] = useState<initialPosi[]>(initialPosition);
  const [status, setStatus] = useState<gameStatusWord>(GameStatus.init);
  const [ difficulty, setDifficulty ] = useState(defaultDifficuty);
  const [ tick, setTick ] = useState(0);
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

  const onStart = (): void => setStatus(GameStatus.playing);

  const onStop = (): void => setStatus(GameStatus.suspended);

  const onRestart = (): void => {
    timer = setInterval(() => {
      setTick(tick => tick + 1);
    }, defaultInterval);
    setDirection(Direction.up);
    setStatus(GameStatus.init);
    setBody(initialPosition);
    setFields(initFields(35, ...initialPosition));
  };

  const onChangeDirection = useCallback((newDirection: directionWord): directionWord | void => {
    if(status !== GameStatus.playing) {
      return direction;
    };
    if (OppositeDirection[direction] === newDirection) {
      return;
    };
    setDirection(newDirection);
  }, [direction, status]);

  const onChangeDifficulty = useCallback((difficulty: number): void => {
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
      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onChangeDirection])

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

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation 
          length={ body.length }
          difficulty={ difficulty }
          onChangeDifficulty={ onChangeDifficulty }
        />
      </header>
      <main className="main">
        <Field fields={fields}/>
      </main>
      <footer className="footer">
        <Button 
          status={ status }
          onStart={ onStart }
          onRestart={ onRestart }
          onStop={ onStop }
        />
        <MnipulationPanel onChange={ onChangeDirection } />
      </footer>
    </div>
  );
};

export default App;
