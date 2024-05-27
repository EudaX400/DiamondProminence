import React from "react";
import Router from "next/router";

export type TournamentProps = {
  id: string;
  title: string;
  numPlayers: number;
  description?: string;
  private: boolean;
  privatePassword?: string;
  ownerId?: string;
  category?: string;
  participants?: string;
  createdAt: string;
  finishedAt: string;
  owner?: { name: string };
}

const TournamentPost: React.FC<{ tournament: TournamentProps }> = ({ tournament }) => {
  return (
    <div onClick={() => Router.push("/tournament/[id]", `/tournament/${tournament.id}`)}>
      <h2>{tournament.title}</h2>
      <small>By {tournament.owner ? tournament.owner.name : "Unknown owner"}</small>
      <p>{tournament.description}</p>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default TournamentPost;
