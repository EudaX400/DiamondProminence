import { LoginForm } from "../components/LogIn/form";
import styles from "../styles/pages/login.module.scss";
import Image from "next/image";
import { ButtonLog } from "../components/Buttons/ButtonLog";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LanguageSelector } from "../components/LanguageSelector";

export default function LoginPage() {
  const { t } = useTranslation("common");
  //<LanguageSelector />
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
                {t("login")}
              </ButtonLog>
              <ButtonLog href={"/register"} className={styles.register}>
                {t("signup")}
              </ButtonLog>
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
