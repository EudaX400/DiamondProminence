import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from "../components/Layout";
import styles from "../styles/pages/create.module.scss";
import prisma from "../lib/prisma";
import { TournamentProps } from "../components/TournamentPost";
import { Input } from "../components/Forms/Inputs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const feed = await prisma.tournament.findMany({
    where: { private: false },
    include: {
      owner: {
        select: { name: true },
      },
    },
  });

  const serializedFeed: TournamentProps[] = feed.map((tournament) => ({
    ...tournament,
    createdAt: tournament.createdAt.toISOString(),
    finishedAt: tournament.finishedAt.toISOString(),
  }));

  return {
    props: {
      feed: serializedFeed,
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 10,
  };
};

type Props = {
  feed: TournamentProps[];
};

const Main: React.FC<Props> = (props) => {
  const { t } = useTranslation('common');
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [participants, setParticipants] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPrime, setIsPrime] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const checkPrimeStatus = async () => {
        try {
          const response = await fetch("/api/check-prime");
          const data = await response.json();
          if (!data.isPrime) {
            router.push("/prime");
          } else {
            setIsPrime(true);
          }
        } catch (error) {
          console.error("Error checking prime status:", error);
        }
      };

      checkPrimeStatus();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tournamentData = {
      title,
      category,
      participants,
      startDate,
      endDate,
      description,
      private: isPrivate,
      privatePassword: isPrivate ? password : null,
    };

    try {
      const response = await fetch("/api/create-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/tournament/${result.id}`);
      } else {
        console.error(t('create_error'));
      }
    } catch (error) {
      console.error(t('create_error'));
    }
  };

  if (status === "loading" || !isPrime) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className={styles.customBackground}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <label className={styles.label}>{t('create_title')}</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                placeholder={t('create_title_placeholder')}
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>{t('create_category')}</label>
              <Input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                name="category"
                placeholder={t('create_category_placeholder')}
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>{t('create_participants')}</label>
              <Input
                type="number"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                name="participants"
                placeholder={t('create_participants_placeholder')}
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>{t('create_startDate')}</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                name="startDate"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>{t('create_endDate')}</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                name="endDate"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>{t('create_description')}</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
                {t('create_private')}
              </label>
            </div>
            {isPrivate && (
              <div className={styles["form-group"]}>
                <label className={styles.label}>{t('create_password')}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  placeholder={t('create_password_placeholder')}
                />
              </div>
            )}
            <button type="submit" className={styles.button}>
              {t('create_button')}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Main;
