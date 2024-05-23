import { RegisterForm } from "../components/Register/form";
import Header from "../components/Header";
import styles from "../styles/pages/register.module.scss";
import Image from "next/image";
import { ButtonLog } from "../components/Buttons/ButtonLog";

export default function RegisterPage() {
  return (
    <>
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
              <ButtonLog href={'/login'} className={undefined}>Log In</ButtonLog>
              <ButtonLog href={"/register"} className={styles.register}>Sign Up</ButtonLog>
            </div>
            <div className={styles.divider} />
          </div>
          <div className={styles.container}>
            <div className={styles.formWrapper}>
              <RegisterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
