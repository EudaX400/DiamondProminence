import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import styles from "../styles/pages/index.module.scss"
import prisma from '../lib/prisma';
import { Create } from "../components/Main/Create"
import { Join } from "../components/Main/Join"
import { View } from "../components/Main/View"

const Main: React.FC = (props) => {
  return (
    <Layout>
      <div className={`${styles.post}`}>
        <h1>Diamond Prominence</h1>
        <main>
          <div className="textTitle">
          <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita quia magnam dolore sed sint amet molestias, labore quasi quibusdam dolorem aut quis exercitationem, eum eius? Fugiat dolorum quia ex velit.</h3>
          </div>

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
