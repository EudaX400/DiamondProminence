import { LoginForm } from "../components/LogIn/form";
import Header from "../components/Header";
import styles from "../styles/pages/login.module.scss";


export default function LoginPage() {
  return (
    <>
      <Header />
      <section className={styles.section}>
        <div className={styles.component}>
          <div className={styles.from_wrapper}>
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}