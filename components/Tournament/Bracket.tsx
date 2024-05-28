import styles from '../../styles/components/Tournament/Bracket.module.scss';

const Bracket = ({ rounds }) => {
  return (
    <div className={styles.bracket}>
      {rounds.map((round, i) => (
        <div key={i} className={styles.round}>
          {round.map((match, j) => (
            <div key={j} className={styles.match}>
              <p>{match.user.name}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Bracket;
