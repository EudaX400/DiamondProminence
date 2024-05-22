import { RegisterForm } from "../components/Register/form";
import Header from "../components/Header";
import styles from "../styles/pages/register.module.scss";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <section className={styles.section}>
        <Image
          src="/DiamondProminenceLogo.png"
          alt="DiamondProminenceLog"
          width={500}
          height={500}
        />
        <div className={styles.container}>
          <div className={styles.from_wrapper}>
            <RegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}
