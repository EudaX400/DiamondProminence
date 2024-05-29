import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import styles from "../styles/pages/join.module.scss";
import prisma from "../lib/prisma";
import { TournamentProps } from "../components/TournamentPost";
import { Input } from "../components/Forms/Inputs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>(props.feed);
  const [message, setMessage] = useState("");
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

  const handleJoin = async (tournamentId) => {
    if (!session) {
      alert("You need to be logged in to join a tournament.");
      return;
    }

    try {
      const response = await fetch("/api/join-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId, userId: session.user.id }),
      });

      if (response.ok) {
        setMessage("Successfully joined the tournament!");
        setTimeout(() => {
          router.push(`/tournament/${tournamentId}`);
        }, 2000);
      } else {
        console.error("Error joining the tournament");
      }
    } catch (error) {
      console.error("Error joining the tournament:", error);
    }
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
          <h1 className={styles.title}>Join Tournament</h1>
          <div className={styles.searchGroup}>
            <label className={styles.label} htmlFor="code">
              Código del Torneo
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              name="code"
              placeholder="Enter tournament code"
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
              name="name"
              placeholder="Enter tournament name"
            />
          </div>
          <button className={styles.button} onClick={handleSearch}>
            Search
          </button>
          <div className={styles.line}></div>
          {message && <p className={styles.message}>{message}</p>}
          <div className={styles.results}>
            {results.map((tournament, index) => (
              <div
                key={tournament.id}
                className={`${styles.tournament} ${
                  index % 2 === 0
                    ? styles.tournamentEven
                    : styles.tournamentOdd
                }`}
              >
                <h2>{tournament.title}</h2>
                <p>{tournament.category}</p>
                <button
                  className={styles.button}
                  onClick={() => handleJoin(tournament.id)}
                >
                  Join
                </button>
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
