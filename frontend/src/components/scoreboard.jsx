import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('scoreUpdated', (updatedScores) => {
      setScores(updatedScores);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Scores</h1>
      <ul>
        {scores.map((user) => (
          <li key={user.id}>
            {user.username}: {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
