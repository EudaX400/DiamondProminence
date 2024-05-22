import React from "react";
import Link from "next/link";
import styles from "../styles/components/main/join.module.scss";
import { LinkButton } from "../Buttons/LinkButton";

export const Join = () => {
    return(
        <>
        <h2>Join</h2>
          <main>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit necessitatibus ipsa, voluptas est aut pariatur. Perferendis quod hic commodi temporibus praesentium, fugit rem. Ipsum, illo consectetur eius ad dignissimos deserunt.</p>
            <LinkButton href={"undefined"}>Join Tournament</LinkButton>          
          </main>
        </>
    )
}