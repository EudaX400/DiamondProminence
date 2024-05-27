import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import styles from "../styles/pages/view.module.scss";
import prisma from "../lib/prisma";
import { TournamentProps } from "../components/TournamentPost";

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

  const handleSearch = async () => {
    // Aquí realizarías la búsqueda de torneos utilizando code y name
    const searchResults = [
      { id: 1, title: "Tournament 1", category: "Category 1" },
      { id: 2, title: "Tournament 2", category: "Category 2" },
      { id: 3, title: "Tournament 3", category: "Category 3" },
      { id: 4, title: "Tournament 4", category: "Category 4" },
      { id: 5, title: "Tournament 5", category: "Category 5" },
      { id: 6, title: "Tournament 6", category: "Category 6" },
    ];
    setResults(searchResults);
  };

  const loadMoreResults = async () => {
    setLoading(true);
    // Simulación de carga adicional de resultados
    const moreResults = [
      {
        id: results.length + 1,
        title: `Tournament ${results.length + 1}`,
        category: "Category 1",
      },
      {
        id: results.length + 2,
        title: `Tournament ${results.length + 2}`,
        category: "Category 2",
      },
      {
        id: results.length + 3,
        title: `Tournament ${results.length + 3}`,
        category: "Category 3",
      },
      {
        id: results.length + 4,
        title: `Tournament ${results.length + 4}`,
        category: "Category 4",
      },
      {
        id: results.length + 5,
        title: `Tournament ${results.length + 5}`,
        category: "Category 5",
      },
      {
        id: results.length + 6,
        title: `Tournament ${results.length + 6}`,
        category: "Category 6",
      },
    ];
    setResults([...results, ...moreResults]);
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
          <h1 className={styles.title}>View Tournament</h1>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="code">
              Código del Torneo
            </label>
            <input
              id="code"
              type="text"
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="name">
              Nombre del Torneo
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
