import React from "react";
import { LinkButton } from "../Buttons/LinkButton";

export const Create = () => {
    return(
        <>
        <h2>Create</h2>
          <section>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, iure ut quae obcaecati debitis eveniet quis repellendus error architecto quo doloribus molestiae tenetur fugiat incidunt numquam neque nam. Reprehenderit, neque!</p>
            <LinkButton href={"/create"}>Create Tournament</LinkButton>
          </section>
        </>
    )
}