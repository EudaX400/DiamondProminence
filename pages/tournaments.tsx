import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.tournament.findMany({
    where: { private: false },
    include: {
      owner: {
        select: { name: true },
      },
    },
  });

  return {
    props: { feed },
    revalidate: 10,
  };
};

interface TournamentProps {
  feed: {
    id: string;
    title: string;
    description: string | null;
    numPlayers: number;
    owner: {
      name: string | null;
    } | null;
  }[];
}

const Tournaments = ({ feed }: TournamentProps) => {
  return (
    <div>
      <h1>Public Tournaments</h1>
      <ul>
        {feed.map((tournament) => (
          <li key={tournament.id}>
            <h2>{tournament.title}</h2>
            <p>Owner: {tournament.owner?.name || 'Unknown'}</p>
            <p>Description: {tournament.description}</p>
            <p>Number of Players: {tournament.numPlayers}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tournaments;
