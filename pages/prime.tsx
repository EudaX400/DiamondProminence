import React from "react";
import Layout from "../components/Layout";
import styles from "../styles/pages/prime.module.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonClick } from "../components/Buttons/ButtonClick";
import { useTranslation } from 'next-i18next';

const Prime = () => {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleBecomePrime = async () => {
    try {
      const response = await fetch("/api/become-prime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        router.push("/create");
      } else {
        console.error(t('prime_error'));
      }
    } catch (error) {
      console.error(t('prime_error'), error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <section className={styles.primeSection}>
      <div className={styles.top}>
        <h1>{t('prime_title')}</h1>
        <p>{t('prime_description')}</p>
      </div>
      <div className={styles.plan}>
        <div className={styles.free}>
          <div className={styles.title}>
            <h2>{t('prime_free_title')}</h2>
            <h2>0€</h2>
          </div>
          <p>{t('prime_free_features')}</p>
        </div>
        <div className={styles.prime}>
          <div className={styles.title}>
            <h2>{t('prime_prime_title')}</h2>
            <h2>5€/month</h2>
          </div>
          <p>{t('prime_prime_features')}</p>
          <ButtonClick onClick={handleBecomePrime}>{t('prime_button')}</ButtonClick>
        </div>
      </div>
      <div className={styles.details}>
        <h3>{t('prime_why_title')}</h3>
        <p>{t('prime_why_description')}</p>
        <h3>{t('prime_support_title')}</h3>
        <p>{t('prime_support_description')}</p>
        <h3>{t('prime_advanced_title')}</h3>
        <p>{t('prime_advanced_description')}</p>
      </div>
    </section>
    </Layout>
  );
};

export default Prime;
