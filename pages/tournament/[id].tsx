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
  const [phase, setPhase] = useState(1);
  const [winner, setWinner] = useState(null);
  const [openManagement, setOpenManagement] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setPhase(getCurrentPhase(tournament.matches));
  }, [tournament.matches]);

  const getCurrentPhase = (matches) => {
    if (matches.length === 0) return 1;
    const maxPhase = matches.reduce(
      (max, match) => Math.max(max, match.phase),
      1
    );
    const currentPhaseMatches = matches.filter(
      (match) => match.phase === maxPhase
    );
    const allCurrentPhaseMatchesCompleted = currentPhaseMatches.every(
      (match) => match.winnerId
    );
    return allCurrentPhaseMatchesCompleted ? maxPhase + 1 : maxPhase;
  };

  const calculateTotalPhases = (numParticipants) => {
    return Math.ceil(Math.log2(numParticipants));
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

  const finalizeTournament = async (tournamentId) => {
    try {
      const response = await fetch("/api/finish-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to finalize tournament");
      }

      const data = await response.json();
      setWinner(data.winner);
      console.log("Tournament finalized successfully:", data);
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

  const totalPhases = calculateTotalPhases(tournament.numPlayers);
  const isFinalPhase = phase > totalPhases;

  const handleOpenManagement = (matchId) => {
    setOpenManagement(openManagement === matchId ? null : matchId);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>{tournament.title}</h1>
        <p>{tournament.description}</p>
        <p>Category: {tournament.category}</p>
        <p>Start date: {tournament.createdAt}</p>
        <p>Finish date: {tournament.finishedAt ?? "Not finished"}</p>

        <h2>Bracket</h2>

        <Bracket matches={matches} openManagement={handleOpenManagement} />

        {session?.user?.id === tournament.ownerId && (
          <div className={styles.buttons}>
            {!matches.length ? (
              <button onClick={createMatches}>Start Tournament</button>
            ) : (
              <>
                {!isFinalPhase ? (
                  <button onClick={advancePhase} disabled={!canAdvancePhase()}>
                    Next Phase
                  </button>
                ) : (
                  <button onClick={() => finalizeTournament(tournament.id)}>
                    Finalize Tournament
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {matches.map((match) => (
          <div key={match.id}>
            {session?.user?.id === tournament.ownerId &&
              openManagement === match.id && (
                <>
                  <h2>Tournament Matches</h2>
                  <MatchManagement
                    match={match}
                    onUpdateScore={handleUpdateScore}
                  />
                </>
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

export default TournamentPage;

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
            player1: { select: { id: true, username: true } },
            player2: { select: { id: true, username: true } },
            winner: { select: { id: true, username: true } },
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
        phase: match.phase,
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
