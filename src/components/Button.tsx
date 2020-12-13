import React, { FC } from 'react';
import { gameStatusWord } from '../App'

type Props = {
  status: gameStatusWord
  onStart: () => void;
  onRestart: () => void;
  onStop: () => void;
}

const Button :FC<Props> = ({ status, onStart, onRestart, onStop }) => {
  return (
    <div className="button">
      { status === "gameover" && <button className="btn btn-gameover" onClick={ onRestart }>gameover</button> }
      { status === "init" && <button className="btn btn-init" onClick={ onStart }>start</button> }
      { status === "suspended" && <button className="btn btn-suspended" onClick={ onStart }>start</button> }
      { status === "playing" && <button className="btn btn-playing" onClick={ onStop }>stop</button> }
    </div>
  );
};

export default Button;
