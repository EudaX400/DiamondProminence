import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import MatchManagement from "../../components/Tournament/MatchManagement";
import styles from "../../styles/pages/tournament.module.scss";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Bracket from "../../components/Tournament/Bracket";

const TournamentPage = ({ tournament }) => {
  const { data: session } = useSession();
  const [matches, setMatches] = useState(tournament.matches);
  const [rounds, setRounds] = useState([]);


  useEffect(() => {
    const calculateRounds = () => {
      // Assuming matches are ordered by round number
      const maxRound = Math.max(...matches.map((match) => match.round));

      const calculatedRounds = [];
      for (let i = 1; i <= maxRound; i++) {
        const roundMatches = matches.filter((match) => match.round === i);
        calculatedRounds.push(roundMatches);
      }

      setRounds(calculatedRounds);
    };

    calculateRounds();
  }, [matches]);

  const handleUpdateScore = async (matchId, player1Score, player2Score) => {
    try {
      const response = await fetch("/api/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matchId, player1Score, player2Score }),
      });

      if (response.ok) {
        const updatedMatch = await response.json();
        setMatches((prevMatches) =>
          prevMatches.map((match) =>
            match.id === matchId ? updatedMatch.match : match
          )
        );
      } else {
        console.error("Error updating score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>{tournament.title}</h1>
        <p>{tournament.description}</p>
        <p>Category: {tournament.category}</p>

        <Bracket rounds={rounds}/>

        <h2>Tournament Matches</h2>
        {matches.map((match) => (
          <div key={match.id}>
            <h3>
              {match.player1.name} vs {match.player2.name}
            </h3>
            <p>
              Score: {match.player1Score} - {match.player2Score}
            </p>
            {session?.user?.id === tournament.ownerId && (
              <MatchManagement
                match={match}
                onUpdateScore={handleUpdateScore}
              />
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: id },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        matches: {
          include: {
            player1: { select: { name: true } },
            player2: { select: { name: true } },
          },
        },
      },
    });

    const serializedTournament = {
      ...tournament,
      createdAt: tournament.createdAt.toISOString(),
      finishedAt: tournament.finishedAt.toISOString(),
    };

    return {
      props: {
        tournament: serializedTournament,
      },
    };
  } catch (error) {
    console.error("Error fetching tournament:", error);

    return {
      notFound: true,
    };
  }
};

export default TournamentPage;
