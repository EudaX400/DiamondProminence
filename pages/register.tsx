import { RegisterForm } from "../components/Register/form";
import Header from "../components/Header";
import styles from "../styles/pages/register.module.scss"

export default function RegisterPage() {
  return (
    <>
      <Header />
      <section className={styles.section}>
        <div className={styles.component}>
          <div className={styles.from_wrapper}>
            <RegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}