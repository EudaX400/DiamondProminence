import React from "react";
import { useTranslation } from "next-i18next";
import { LinkButton } from "../Buttons/LinkButton";

export const Join = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <h2>{t("join")}</h2>
      <main>
        <h3>{t("join1")}</h3>
        <ul>
          <li>
            <p>{t("join2")}</p>
            <p>{t("join3")}</p>
            <p>{t("join4")}</p>
            <p>{t("join5")}</p>
          </li>
        </ul>
        <div>
        <p>{t("join6")}</p>
        </div>
        <LinkButton href={"/join"}>{t("join_tournament")}</LinkButton>
      </main>
    </>
  );
};
