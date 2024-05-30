import React from "react";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from "../components/Layout";
import styles from "../styles/pages/about-us.module.scss";

const AboutUs = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <section className={`${styles.section} ${styles.customBackground}`}>
        <div className={`${styles.header}`}>

          <h1>{t('aboutUs_title')}</h1>
        </div>
        <div className={styles.container}>
          <p>{t('aboutUs_paragraph1')}</p>
          <p>{t('aboutUs_paragraph2')}</p>
          <p>{t('aboutUs_paragraph3')}</p>

        </div>
      </section>
    </Layout>
  );
};


export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default AboutUs;
