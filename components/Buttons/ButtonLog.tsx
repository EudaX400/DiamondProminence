import Link from "next/link";
import styles from "../../styles/components/Buttons/ButtonLog.module.scss";
import { useRouter } from "next/router";

export const ButtonLog = ({ href, className, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href}>
      <button className={`${styles.btn} ${className} ${isActive ? styles.active : ''}`}>
        {children}
      </button>
    </Link>
  );
};
