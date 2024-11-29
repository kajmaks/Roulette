import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoomCreation } from './components/RoomCreation';
import { GameRoom } from './components/GameRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomCreation />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
    </Router>
  );
}

export default App;