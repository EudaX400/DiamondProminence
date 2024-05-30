import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { useRouter } from 'next/router';
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import styles from "../styles/pages/view.module.scss";
import prisma from "../lib/prisma";
import { TournamentProps } from "../components/TournamentPost";
import { Input } from "../components/Forms/Inputs";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.tournament.findMany({
    where: { private: false },
    include: {
      owner: {
        select: { name: true },
      },
    },
  });

  // Convertir las fechas a strings
  const serializedFeed: TournamentProps[] = feed.map((tournament) => ({
    ...tournament,
    createdAt: tournament.createdAt.toISOString(),
    finishedAt: tournament.finishedAt.toISOString(),
  }));

  return {
    props: { feed: serializedFeed },
    revalidate: 10,
  };
};

type Props = {
  feed: TournamentProps[];
};

const Main: React.FC<Props> = (props) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>(props.feed);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleTournamentClick = (id: number) => {
    router.push(`/tournament/${id}`);
  };

  return (
    <Layout>
      <div className={styles.customBackground}>
        <div className={styles.container}>
          <h1 className={styles.title}>View Tournament</h1>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="code">
              Código del Torneo
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              name={"code"}
            />
          </div>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="name">
              Nombre del Torneo
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name={"name"}
            />
          </div>
          <button className={styles.button} onClick={handleSearch}>
            Search
          </button>
          <div className={styles.line}></div>
          <div className={styles.results}>
            {results.map((tournament, index) => (
              <div
                key={tournament.id}
                className={`${styles.tournament} ${
                  index % 2 === 0 ? styles.tournamentEven : styles.tournamentOdd
                }`}
                onClick={() => handleTournamentClick(tournament.id)}
              >
                <h2>{tournament.title}</h2>
                <p>{tournament.category}</p>
              </div>
            ))}
          </div>
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </Layout>
  );
};

export default Main;
