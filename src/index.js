import React, { useState } from 'react';
import { render } from 'react-dom';
import ScoreBoard from './ScoreBoard';
import './style.css';

// Simulateshowing and hiding graphics
const App = () => {
  const [animation, setAnimation] = useState([]);

  // simulate a change in state, start the animation
  const toggleMainBoard = () => {
    if (animation.length >= 1) {
      setAnimation([]);
    }
    if (animation.length === 0) {
      let tmpObj = [{ animation: 'main', delay: 0 }];
      setAnimation(tmpObj);
    }
  };

  // simulate a change in state
  const toggleTeamStat = () => {
    if (animation.length === 0) {
      return;
    }
    if (animation.find(({ animation }) => animation === 'teamStat') === undefined) {
      setAnimation([...animation, { animation: 'teamStat', delay: 0.6 }]);
    } else {
      let tmpArr = animation[0];
      setAnimation([tmpArr]);
    }
  };

  return (
    <div className="app">
      <ScoreBoard animation={animation} awayTeamColor="white" homeTeamColor="#db251e" />
      <div className="toggle-buttons">
        <button className="mr-2 btn" onClick={toggleMainBoard}>
          toggle scoreboard component
        </button>
        <button className="btn mr-2" onClick={toggleTeamStat}>
          toggle teamStat component
        </button>
        Photo by Serkan Turk on Unsplash
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
