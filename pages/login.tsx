import { LoginForm } from "../components/LogIn/form";
import Header from "../components/Header";
import styles from "../styles/pages/login.module.scss";
import Image from "next/image";

export default function LoginPage() {
  return (
    <>
      <Header />
      <section className={styles.section}>
        <div className={styles.component}>
          <Image
            src="/DiamondProminenceLogo.png"
            alt="DiamondProminenceLog"
            width={500}
            height={500}
          />
          <div className={styles.dividerContainer}>
            <div className={styles.divider} />
            <div className={styles.buttons}>
              <button className={styles.rotatedButton} onClick={() => {/* Handle login click */ }}>
                Login
              </button>
              <button className={styles.rotatedButton} onClick={() => {/* Handle register click */ }}>
                Register
              </button>
            </div>
            <div className={styles.divider} />
          </div>
          <div className={styles.container}>
            <div className={styles.formWrapper}>
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}