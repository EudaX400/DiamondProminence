import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import styles from '../../styles/pages/p/[id].module.scss'
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.tournament.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      owner: {
        select: { name: true },
      },
    },
  });
  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = (props) => {
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
      </div>
    </Layout>
  )
}

export default Post
