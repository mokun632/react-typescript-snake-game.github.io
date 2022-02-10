import React, { FC } from "react";
import { gameStatusWord, GameStatus } from "../constants";

type Props = {
  status: gameStatusWord;
  onStart: () => void;
  onRestart: () => void;
  onStop: () => void;
};

const Button: FC<Props> = ({ status, onStart, onRestart, onStop }) => {
  return (
    <div className="button">
      {status === GameStatus.gameover && (
        <button className="btn btn-gameover" onClick={onRestart}>
          ゲームオーバー
        </button>
      )}
      {status === GameStatus.init && (
        <button className="btn btn-init" onClick={onStart}>
          スタート
        </button>
      )}
      {status === GameStatus.suspended && (
        <button className="btn btn-suspended" onClick={onStart}>
          start
        </button>
      )}
      {status === GameStatus.playing && (
        <button className="btn btn-playing" onClick={onStop}>
          stop
        </button>
      )}
    </div>
  );
};

export default Button;
