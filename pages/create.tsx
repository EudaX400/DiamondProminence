import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import styles from "../styles/pages/create.module.scss";
import prisma from "../lib/prisma";
import { TournamentProps } from "../components/TournamentPost";
import { Input } from "../components/Forms/Inputs";
import router, { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.tournament.findMany({
    where: { private: false },
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
    props: { feed: serializedFeed },
    revalidate: 10,
  };
};

type Props = {
  feed: TournamentProps[];
};

const Main: React.FC<Props> = (props) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [participants, setParticipants] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPrime, setIsPrime] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const checkPrimeStatus = async () => {
        try {
          const response = await fetch("/api/check-prime");
          const data = await response.json();
          if (!data.isPrime) {
            router.push("/prime");
          } else {
            setIsPrime(true);
          }
        } catch (error) {
          console.error("Error checking prime status:", error);
        }
      };

      checkPrimeStatus();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tournamentData = {
      title,
      category,
      participants,
      startDate,
      endDate,
      description,
      private: isPrivate,
      privatePassword: isPrivate ? password : null,
    };

    try {
      const response = await fetch("/api/create-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/tournament/${result.id}`);
      } else {
        console.error("Error creating tournament");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  if (status === "loading" || !isPrime) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className={styles.customBackground}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <label className={styles.label}>Título</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                placeholder="Title"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>Categoría</label>
              <Input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                name="category"
                placeholder="Category"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>Número de Participantes</label>
              <Input
                type="number"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                name="participants"
                placeholder="Number of participants"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>Fecha de Inicio</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                name="startDate"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>Fecha de Fin</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                name="endDate"
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>Descripción</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
                Torneo Privado
              </label>
            </div>
            {isPrivate && (
              <div className={styles["form-group"]}>
                <label className={styles.label}>Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  placeholder="Password"
                />
              </div>
            )}
            <button type="submit" className={styles.button}>
              Crear Torneo
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Main;
