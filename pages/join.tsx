import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import styles from "../styles/pages/join.module.scss";
import prisma from "../lib/prisma";
import { TournamentProps } from "../components/TournamentPost";
import { Input } from "../components/Forms/Inputs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonClick } from "../components/Buttons/ButtonClick";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const feed = await prisma.tournament.findMany({
    where: {},
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
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 10,
  };
};

type Props = {
  feed: TournamentProps[];
};

const Main: React.FC<Props> = (props) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>(props.feed);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch("/api/search-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, name }),
      });

      if (response.ok) {
        const searchResults = await response.json();
        setResults(searchResults);
      } else {
        console.error("Error searching tournaments");
      }
    } catch (error) {
      console.error("Error searching tournaments:", error);
    }
  };

  const handleJoin = async (tournament) => {
    if (!session) {
      alert(t('join_notLoggedIn'));
      return;
    }

    if (tournament.private) {
      setSelectedTournament(tournament);
    } else {
      joinTournament(tournament.id, null);
    }
  };

  const joinTournament = async (tournamentId, password) => {
    try {
      const response = await fetch("/api/join-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId,
          userId: session.user.id,
          password,
        }),
      });

      if (response.ok) {
        setMessage(t('join_success'));
        setTimeout(() => {
          router.push(`/tournament/${tournamentId}`);
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.error);
      }
    } catch (error) {
      console.error(t('join_error'), error);
    }
  };

  const loadMoreResults = async () => {
    setLoading(true);
    setResults([...results]);
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      loadMoreResults();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [results]);

  return (
    <Layout>
      <div className={styles.customBackground}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('join_title')}</h1>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="code">
              {t('join_tournamentCode')}
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              name="code"
              placeholder={t('join_enterCode')}
            />
          </div>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="name">
              {t('join_tournamentName')}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              placeholder={t('join_enterName')}
            />
          </div>
          <ButtonClick onClick={handleSearch}>{t('join_search')}</ButtonClick>
          <div className={styles.line}></div>
          {message && <p className={styles.message}>{message}</p>}
          <div className={styles.results}>
            {results.map((tournament, index) => (
              <div
                key={tournament.id}
                className={`${styles.tournament} ${
                  index % 2 === 0 ? styles.tournamentEven : styles.tournamentOdd
                }`}
                onClick={() => handleJoin(tournament)}
              >
                <h2>{tournament.title}</h2>
                <p>{tournament.category}</p>
                {tournament.private && (
                  <p className={styles.private}>{t('join_private')}</p>
                )}
              </div>
            ))}
          </div>
          {loading && <p>{t('join_loading')}</p>}
        </div>
        {selectedTournament && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>{t('join_enterPassword')} {selectedTournament.title}</h2>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('join_password')}
                name={"Password"}
              />
              <div className={styles.btn}>
                <ButtonClick
                  onClick={() =>
                    joinTournament(selectedTournament.id, password)
                  }
                >
                  {t('join_join')}
                </ButtonClick>
                <ButtonClick onClick={() => setSelectedTournament(null)}>
                  {t('join_cancel')}
                </ButtonClick>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Main;
