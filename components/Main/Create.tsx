import React from "react";
import { useTranslation } from "next-i18next";
import { LinkButton } from "../Buttons/LinkButton";

export const Create = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <h2>{t("create")}</h2>
      <section>
        <h3>{t("create1")}</h3>
        <ul>
          <li>
            <p>{t("create2")}</p>
            <p>{t("create3")}</p>
            <p>{t("create4")}</p>
            <p>{t("create5")}</p>
            <p>{t("create6")}</p>
            <p>{t("create7")}</p>
          </li>
        </ul>


        <LinkButton href={"/create"}>{t("create_tournament")}</LinkButton>

        <div>
          <p>{t("create8")}</p>
        </div>
        
      </section>
    </>
  );
};
