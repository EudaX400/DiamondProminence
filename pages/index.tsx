  import React from "react"
  import { GetStaticProps } from "next"
  import Layout from "../components/Layout"
  import Post, { PostProps } from "../components/Post"
  import styles from "../styles/pages/index.module.scss"
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
    return (
      <Layout>
        <div className={styles.post}>
          <h1>Public Feed</h1>
          <main>
            {props.feed.map((post) => (
              <div key={post.id} className={styles.post}>
                <Post post={post} />
              </div>
            ))}
          </main>
        </div>
      </Layout>
    )
  }

  export default Main
