import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import { TournamentProps } from '../components/TournamentPost';

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

const Tournament: React.FC<Props> = (props) => {
  return (
    <div>
      <h1>Public Tournaments</h1>
      <ul>
        {props.feed.map((tournament) => (
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

export default Tournament;
