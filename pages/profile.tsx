import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import Image from "next/image";
import ChangePassword from "../components/changePassword";
import styles from "../styles/pages/profile.module.scss";
import { useState } from "react";
import { ArrowUpIcon } from "../public/icons/ArrowUpIcon";
import { ArrowDownIcon } from "../public/icons/ArrowDownIcon";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LinkButton } from "../components/Buttons/LinkButton";

export default function Profile({ user }) {
  const { t } = useTranslation("common");

  if (!user) {
    return <p>Loading...</p>;
  }

  const [openPassword, setOpenPassword] = useState(false);
  const [openSections, setOpenSections] = useState({
    profileDetails: false,
    joinedTournament: false,
    createdTournament: false,
  });

  const handleToggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const handleOpenAll = () => {
    const allSectionsClosed = Object.values(openSections).every(
      (section) => !section
    );
    setOpenSections({
      profileDetails: allSectionsClosed,
      joinedTournament: allSectionsClosed,
      createdTournament: allSectionsClosed,
    });
  };

  const isOpenAll = Object.values(openSections).every((section) => section);

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Layout>
      <section className={styles.profileSection}>
        <div className={styles.profileContainer}>
          <div className={styles.profileContent}>
            <div className={styles.profileTop}>
              <Image
                src={user.image || "/user.png"}
                width={200}
                height={200}
                alt={`profile photo of ${user.name}`}
              />
              <p>{user.username}</p>
              {user.prime !== null && user.prime === false && (
                <div className={styles.premium}>
                  <LinkButton href="/prime">Get Prime</LinkButton>
                </div>
              )}
            </div>
            <div className={styles.openAll}>
              <a
                onClick={handleOpenAll}
                style={{ color: isOpenAll ? "#ff1f1f" : "white" }}
              >
                {t(isOpenAll ? "profile_closeAll" : "profile_openAll")}
              </a>
            </div>
            <div className={styles.profileDetails}>
              <div
                className={styles.title}
                onClick={() => handleToggleSection("profileDetails")}
              >
                <h2>{t("profile_details")}</h2>
                {openSections.profileDetails ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}
              </div>
              {openSections.profileDetails && (
                <div className={styles.name}>
                  <p>
                    {t("profile_name")}: {user.name}
                  </p>
                  <p>
                    {t("profile_lastName")}: {user.lastName}
                  </p>
                  <p>
                    {t("profile_email")}: {user.email}
                  </p>
                  <p>
                    {t("profile_country")}: {user.country}
                  </p>
                  <p>
                    {t("profile_position")}: {user.position}
                  </p>
                  <p>
                    {t("profile_createdAt")}: {user.createdAt}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.tournaments}>
            <div className={styles.joinTournament}>
              <div
                className={styles.title}
                onClick={() => handleToggleSection("joinedTournament")}
              >
                <h2>{t("profile_joinedTournaments")}</h2>
                {openSections.joinedTournament ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}
              </div>
              {openSections.joinedTournament && (
                <div className={styles.details}>
                  {user.joinedTournaments.length > 0 ? (
                    <ul>
                      {user.joinedTournaments.map((tournament) => (
                        <div
                          className={styles.definedDetails}
                          key={tournament.id}
                        >
                          <Link href={`/tournament/${tournament.id}`}>
                            {tournament.title}
                          </Link>
                          <p>
                            {t("profile_category")}: {tournament.category}
                          </p>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p>{t("profile_noJoinedTournaments")}</p>
                  )}
                </div>
              )}
            </div>
            <div className={styles.createdTournament}>
              <div
                className={styles.title}
                onClick={() => handleToggleSection("createdTournament")}
              >
                <h2>{t("profile_createdTournaments")}</h2>
                {openSections.createdTournament ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}
              </div>
              {openSections.createdTournament && (
                <div className={styles.details}>
                  {user.createdTournaments.length > 0 ? (
                    <ul>
                      {user.createdTournaments.map((tournament) => (
                        <div
                          className={styles.definedDetails}
                          key={tournament.id}
                        >
                          <Link href={`/tournament/${tournament.id}`}>
                            {tournament.title}
                          </Link>
                          <p>
                            {t("profile_category")}: {tournament.category}
                          </p>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p>{t("profile_noCreatedTournaments")}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.btn} onClick={handleLogOut}>
              {t("profile_logOut")}
            </button>
            <button
              className={styles.btn}
              onClick={() => setOpenPassword(!openPassword)}
            >
              {t("profile_changePassword")}
            </button>
          </div>
        </div>
      </section>
      {openPassword && (
        <div className={styles.changePassword}>
          <ChangePassword
            email={user.email}
            closePassword={() => setOpenPassword(false)}
          />
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tournaments: true,
      participants: {
        include: {
          tournament: true,
        },
      },
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  const userData = {
    ...session.user,
    createdTournaments: user?.tournaments || [],
    joinedTournaments:
      user?.participants.map((p) => ({
        ...p.tournament,
        position: p.position,
      })) || [],
  };

  const cleanedUser = JSON.parse(
    JSON.stringify(userData, (key, value) =>
      value === undefined ? null : value
    )
  );

  const cleanedSession = JSON.parse(
    JSON.stringify(session, (key, value) =>
      value === undefined ? null : value
    )
  );

  return {
    props: {
      user: cleanedUser,
      session: cleanedSession,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
}
