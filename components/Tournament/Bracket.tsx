import styles from '../../styles/components/Tournament/Bracket.module.scss';

const Bracket = ({ matches, openManagement }) => {
  return (
    <div className={styles.bracket}>
      {matches.map((match, i) => (
        <div key={i} className={styles.match} onClick={() => openManagement(match.id)}>
          <p>{match.player1?.username ?? "Unknown"} vs {match.player2?.username ?? "Unknown"}</p>
          <p>{match.player1Score} - {match.player2Score}</p>
        </div>
      ))}
    </div>
  );
};

export default Bracket;
