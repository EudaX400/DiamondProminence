import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import styles from "../styles/pages/index.module.scss"
import prisma from '../lib/prisma';
import { Create } from "../components/Main/Create"
import { Join } from "../components/Main/Join"
import { View } from "../components/Main/View"

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
  return (
    <Layout>
      <div className={`${styles.post}`}>
        <h1>Diamond Prominence</h1>
        <main>
          <div className="textTitle">
          <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita quia magnam dolore sed sint amet molestias, labore quasi quibusdam dolorem aut quis exercitationem, eum eius? Fugiat dolorum quia ex velit.</h3>
          </div>

          {props.feed.map((post) => (
            <div key={post.id} className={styles.post}>
              <Post post={post} />
            </div>
          ))}
        </main>
        
        <div className={styles.create}>
          <Create />
        </div>
        
        <div className={styles.join}>
          <Join />
        </div>

        <div className={styles.view}>
          <View />
        </div>

      </div>
    </Layout>
  )
}

export default Main
