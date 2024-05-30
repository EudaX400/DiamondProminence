import React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from "../components/Layout";
import styles from "../styles/pages/index.module.scss";
import { Create } from "../components/Main/Create";
import { Join } from "../components/Main/Join";
import { View } from "../components/Main/View";
import { GetStaticProps } from "next";

const Main: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className={styles.post}>
        <h1>{t('diamond_prominence')}</h1>
        <main>
          <div className="textTitle">
            <h3>{t('welcome_message')}</h3>
          </div>
        </main>
        <div className={styles.create}>
          <Create />
        </div>
        <div className={styles.join}>
          <Join />
        </div>
        <div className={styles.view}>
          <View />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default Main;
