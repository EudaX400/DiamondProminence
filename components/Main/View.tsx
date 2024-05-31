import React from "react";
import { useTranslation } from "next-i18next";
import { LinkButton } from "../Buttons/LinkButton";

export const View = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <h2>{t("view")}</h2>
      <main>
        <h3>{t("view1")}</h3>
        <ul>
          <li>
            <p>{t("view2")}</p>
            <p>{t("view3")}</p>
            <p>{t("view4")}</p>
          </li>
        </ul>

        <LinkButton href={"/view"}>{t("view_tournament")}</LinkButton>
        <div></div>
 
       
      </main>
    </>
  );
};
