import React, { FC, useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import MnipulationPanel from './components/ManipulationPanel';
import useSnakeGame from './hooks/useSnakGame'


const App: FC = () => {

  const {
    body,
    difficulty,
    fields,
    start,
    stop,
    reload,
    status,
    updateDirection,
    updateDifficulty,
  } = useSnakeGame();

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation 
          length={ body.length }
          difficulty={ difficulty }
          onChangeDifficulty={ updateDifficulty }
        />
      </header>
      <main className="main">
        <Field fields={fields}/>
      </main>
      <footer className="footer">
        <Button 
          status={ status }
          onStart={ start }
          onRestart={ reload }
          onStop={ stop }
        />
        <MnipulationPanel onChange={ updateDirection } />
      </footer>
    </div>
  );
};

export default App;
