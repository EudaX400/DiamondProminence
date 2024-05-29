import { RegisterForm } from "../components/Register/form";
import Header from "../components/Header";
import styles from "../styles/pages/register.module.scss";
import Image from "next/image";
import { ButtonLog } from "../components/Buttons/ButtonLog";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <section className={styles.section}>
        <Link href="/" className={styles.arrow}>
          <Image
            src="/arrow.png"
            alt="arrow"
            width={40}
            height={40}
          />
        </Link>
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
              <ButtonLog href={"/login"} className={undefined}>
                Log In
              </ButtonLog>
              <ButtonLog href={"/register"} className={styles.register}>
                Sign Up
              </ButtonLog>
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
