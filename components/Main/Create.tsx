import React from "react";
import Link from "next/link";
import styles from "../styles/components/main/create.module.scss";
import { LinkButton } from "../Buttons/LinkButton";

export const Create = () => {
    return(
        <>
        <h2>Create</h2>
          <section>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, iure ut quae obcaecati debitis eveniet quis repellendus error architecto quo doloribus molestiae tenetur fugiat incidunt numquam neque nam. Reprehenderit, neque!</p>
            <LinkButton href={"undefined"}>Create Tournament</LinkButton>
          </section>
        </>
    )
}