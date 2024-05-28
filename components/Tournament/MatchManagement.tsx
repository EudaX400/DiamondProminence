import React, { useState } from "react";
import { Input } from "../Forms/Inputs";

const MatchManagement = ({ match, onUpdateScore }) => {
  const [player1Score, setPlayer1Score] = useState(match.player1Score);
  const [player2Score, setPlayer2Score] = useState(match.player2Score);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateScore(match.id, player1Score, player2Score);
  };

  return (
    <div>
      <h3>
        {match.player1.name} vs {match.player2.name}
      </h3>
      <form onSubmit={handleSubmit}>
        <label>
          {match.player1.name} Score:
          <Input
            type="number"
            value={player1Score}
            onChange={(e) => setPlayer1Score(parseInt(e.target.value))}
            name={undefined}
            placeholder={undefined}
          />
        </label>
        <label>
          {match.player2.name} Score:
          <Input
            type="number"
            value={player2Score}
            onChange={(e) => setPlayer2Score(parseInt(e.target.value))}
            name={undefined}
            placeholder={undefined}
          />
        </label>
        <button type="submit">Update Score</button>
      </form>
    </div>
  );
};

export default MatchManagement;
