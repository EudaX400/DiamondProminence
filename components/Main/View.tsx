import React from "react";
import Link from "next/link";
import styles from "../styles/components/main/view.module.scss";
import { LinkButton } from "../Buttons/LinkButton";

export const View = () => {
    return(
        <>
        <h2>View</h2>
          <main>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At itaque nam ducimus consequatur in, officia dicta non quo praesentium? Quasi repudiandae maiores quos nostrum magni aliquam. Quia, quasi sunt! Quia?</p>
            <LinkButton href={"/view"}>View Tournament</LinkButton>          
          </main>
        </>
    )
}