import styles from '../../styles/components/Tournament/Bracket.module.scss';

const Bracket = ({ matches }) => {
  return (
    <div className={styles.bracket}>
      {matches.map((match, i) => (
        <div key={i} className={styles.match}>
          <p>{match.player1?.name ?? "Unknown"} vs{" "}
              {match.player2?.name ?? "Unknown"}</p>
          <p>Score: {match.player1Score} - {match.player2Score}</p>
        </div>
      ))}
    </div>
  );
};

export default Bracket;
