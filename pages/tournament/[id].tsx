import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import MatchManagement from "../../components/Tournament/MatchManagement";
import styles from "../../styles/pages/tournament.module.scss";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Bracket from "../../components/Tournament/Bracket";
import { useRouter } from "next/router";

const TournamentPage = ({ tournament }) => {
  const { data: session } = useSession();
  const [matches, setMatches] = useState(tournament.matches);
  const [phase, setPhase] = useState(0); // Inicializa en 0 y se actualizará en useEffect
  const [winner, setWinner] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setPhase(getCurrentPhase(tournament.matches)); // Actualiza la fase cuando cambian los partidos
  }, [tournament.matches]);

  // Función para calcular la fase actual
  const getCurrentPhase = (matches) => {
    if (matches.length === 1) return 1; // Solo un partido significa que es la fase final
    const phase1Matches = matches.filter((match) => !match.winnerId); // Los partidos sin ganador aún están en la fase 1
    if (phase1Matches.length === matches.length) return 1; // Todos los partidos están todavía en la fase 1
    return 2; // De lo contrario, estamos en la fase 2
  };

  const createMatches = async () => {
    try {
      const response = await fetch("/api/create-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId: tournament.id }),
      });

      if (response.ok) {
        router.reload();
      } else {
        console.error("Error creating matches");
      }
    } catch (error) {
      console.error("Error creating matches:", error);
    }
  };

  const advancePhase = async () => {
    if (!canAdvancePhase()) {
      console.error("All matches must have scores to advance phase");
      return;
    }

    try {
      const response = await fetch("/api/advance-phase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId: tournament.id }),
      });

      if (response.ok) {
        router.reload();
      } else {
        console.error("Error advancing phase");
      }
    } catch (error) {
      console.error("Error advancing phase:", error);
    }
  };

  const finalizeTournament = async () => {
    try {
      const response = await fetch("/api/finish-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId: tournament.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setWinner(data.winner.name);
        router.reload();
      } else {
        console.error("Error finalizing tournament");
      }
    } catch (error) {
      console.error("Error finalizing tournament:", error);
    }
  };

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
        router.reload();
      } else {
        console.error("Error updating score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const canAdvancePhase = () => {
    const currentPhaseMatches = matches.filter(
      (match) => match.phase === phase
    );
    return currentPhaseMatches.every(
      (match) => match.player1Score !== null && match.player2Score !== null
    );
  };

  const isFinalMatch = matches.length === 1;

  return (
    <Layout>
      <div className={styles.container}>
        <h1>{tournament.title}</h1>
        <p>{tournament.description}</p>
        <p>Category: {tournament.category}</p>

        <Bracket matches={matches} />

        {session?.user?.id === tournament.ownerId && (
          <div className={styles.buttons}>
            {phase === 0 || !tournament.matches.length ? (
              <button onClick={createMatches}>Start Tournament</button>
            ) : (
              <>
                {!isFinalMatch ? (
                  <button onClick={advancePhase} disabled={!canAdvancePhase()}>
                    Next Phase
                  </button>
                ) : (
                  <button onClick={finalizeTournament}>
                    Finalize Tournament
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <h2>Tournament Matches</h2>
        {matches.map((match) => (
          <div key={match.id}>
            <div className={styles.userMathces}>
              <h3>
                {match.player1?.name ?? "Unknown"} vs{" "}
                {match.player2?.name ?? "Unknown"}
              </h3>
              <p>
                Score: {match.player1Score} - {match.player2Score}
              </p>
            </div>
            {session?.user?.id === tournament.ownerId && (
              <MatchManagement
                match={match}
                onUpdateScore={handleUpdateScore}
              />
            )}
          </div>
        ))}

        {winner && (
          <div className={styles.winnerMessage}>
            <h2>
              {winner} ha ganado el torneo {tournament.title}!
            </h2>
          </div>
        )}
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
            winner: { select: { name: true } },
          },
        },
      },
    });

    if (!tournament) {
      return {
        notFound: true,
      };
    }

    const serializedTournament = {
      ...tournament,
      createdAt: tournament.createdAt.toISOString(),
      finishedAt: tournament.finishedAt
        ? tournament.finishedAt.toISOString()
        : null,
      participants: tournament.participants.map((participant) => ({
        ...participant,
        joinedAt: participant.joinedAt.toISOString(),
        user: {
          ...participant.user,
          createdAt: participant.user.createdAt.toISOString(),
        },
      })),
      matches: tournament.matches.map((match) => ({
        ...match,
        player1: match.player1 ? { ...match.player1 } : null,
        player2: match.player2 ? { ...match.player2 } : null,
        winner: match.winner ? { ...match.winner } : null,
        createdAt: match.createdAt.toISOString(),
      })),
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
