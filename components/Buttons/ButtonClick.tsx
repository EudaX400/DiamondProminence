import styles from "../../styles/components/Buttons/Button.module.scss";

export const ButtonClick = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className={styles.btn}>
      {children}
    </button>
  );
};
