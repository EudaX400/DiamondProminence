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

export default function Profile({ user }) {
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
    <>
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
              </div>
              <div className={styles.openAll}>
                <a
                  onClick={handleOpenAll}
                  style={{ color: isOpenAll ? "#ff1f1f" : "white" }}
                >
                  Open all
                </a>
              </div>
              <div className={styles.profileDetails}>
                <div
                  className={styles.title}
                  onClick={() => handleToggleSection("profileDetails")}
                >
                  <h2>Profile Details</h2>
                  {openSections.profileDetails ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                </div>
                {openSections.profileDetails && (
                  <>
                    <div className={styles.name}>
                      <p>Name: {user.name}</p>
                      <p>Last Name: {user.lastName}</p>
                      <p>Email: {user.email}</p>
                      <p>Country: {user.country}</p>
                      <p>Position: {user.position}</p>
                      <p>Created at: {user.createdAt}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.tournaments}>
              <div className={styles.joinTournament}>
                <div
                  className={styles.title}
                  onClick={() => handleToggleSection("joinedTournament")}
                >
                  <h2>Joined Tournament</h2>
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
                          <div className={styles.definedDetails} key={tournament.id}>
                            <Link href={`/tournament/${tournament.id}`}>
                              {tournament.title}
                            </Link>
                            <p>Category: {tournament.category}</p>
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p>No joined tournaments</p>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.createdTournament}>
                <div
                  className={styles.title}
                  onClick={() => handleToggleSection("createdTournament")}
                >
                  <h2>Created Tournament</h2>
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
                          <div className={styles.definedDetails} key={tournament.id}>
                            <Link href={`/tournament/${tournament.id}`}>
                              {tournament.title}
                            </Link>
                            <p>Category: {tournament.category}</p>
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p>No created tournaments</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.btn} onClick={handleLogOut}>
                Log Out
              </button>
              <button
                className={styles.btn}
                onClick={() => setOpenPassword(!openPassword)}
              >
                Change Password
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
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("Session:", session);

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

  // Organize the user data
  const userData = {
    ...session.user,
    createdTournaments: user?.tournaments || [],
    joinedTournaments: user?.participants.map((p) => p.tournament) || [],
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
    },
  };
}
