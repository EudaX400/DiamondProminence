import React, { useState } from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import styles from "../styles/pages/create.module.scss"
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

type Props = {
  feed: PostProps[]
}

const Main: React.FC<Props> = (props) => {
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [participants, setParticipants] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tournamentData = {
      title,
      category,
      participants,
      startDate,
      endDate,
      description,
      isPrivate,
      password: isPrivate ? password : null,
    };
    console.log(tournamentData);
    // Aquí puedes hacer una solicitud a tu API para crear el torneo
  };
  
  return (
    <Layout>
      <div className={`${styles.customBackground}`}>
      <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label className={styles.label}>Título</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles.label}>Categoría</label>
          <input
            type="text"
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles.label}>Número de Participantes</label>
          <input
            type="number"
            className={styles.input}
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles.label}>Fecha de Inicio</label>
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles.label}>Fecha de Fin</label>
          <input
            type="date"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
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
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
  )
}

export default Main