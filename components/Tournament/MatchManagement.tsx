import React, { useState } from "react";
import { Input } from "../Forms/Inputs";
import { Button } from "../Buttons/Button";
import styles from "../../styles/components/Tournament/MatchManagement.module.scss";

const MatchManagement = ({ match, onUpdateScore }) => {
  const [player1Score, setPlayer1Score] = useState(match.player1Score);
  const [player2Score, setPlayer2Score] = useState(match.player2Score);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateScore(match.id, player1Score, player2Score);
  };

  return (
    <div className={styles.match}>
      <h3>
        {match.player1?.username ?? "Unknown"} vs {match.player2?.username ?? "Unknown"}
      </h3>
      <div className={styles.matchForm}>
        <form onSubmit={handleSubmit}>
          <label>
            {match.player1?.username ?? "Unknown"} Score:
            <div className={styles.matchInput}>
              <Input
                type="number"
                value={player1Score}
                onChange={(e) => setPlayer1Score(parseInt(e.target.value))}
                name={undefined}
                placeholder={undefined}
              />
            </div>
          </label>
          <label>
            {match.player2?.username ?? "Unknown"} Score:
            <div className={styles.matchInput}>
              <Input
                type="number"
                value={player2Score}
                onChange={(e) => setPlayer2Score(parseInt(e.target.value))}
                name={undefined}
                placeholder={undefined}
              />
            </div>
          </label>
          <Button type="submit" style={undefined} disabled={undefined}>
            Update Score
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MatchManagement;
