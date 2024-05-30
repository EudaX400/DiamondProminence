import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import styles from "../styles/components/header.module.scss";
import { ArrowUpIcon } from "../public/icons/ArrowUpIcon";
import { ArrowDownIcon } from "../public/icons/ArrowDownIcon";
import { MobileHeader } from "./MobileHeader";
import { MenuMobileIcon } from "../public/icons/MenuMobileIcon";
import { LanguageSelector } from "./LanguageSelector";

const Header = ({ isOpenMobile, setIsOpenMobile }) => {
  const { data: session, status } = useSession();
  const [showOptions, setShowOptions] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowTopMenu(false);
      } else {
        setShowTopMenu(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section className={styles.header}>
        {showTopMenu && (
          <div className={styles.topMenu}>
            <div className={styles.language}>
              <LanguageSelector />
            </div>
            <p>Diamond Prominence</p>
          </div>
        )}
        <div className={styles.menu}>
          <Link href="/">
            <Image
              src="/DiamondProminenceLogo.png"
              alt="Diamond Prominence Logo"
              width={80}
              height={80}
            />
          </Link>
          <div className={styles.tournamentLinkContainer}>
            <div
              className={styles.tournament}
              onClick={() => setShowOptions(!showOptions)}
            >
              <a style={{ color: showOptions ? "#ff1f1f" : "white" }}>
                Tournament
              </a>
              {showOptions ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            {showOptions && (
              <div className={styles.tournamentOptions}>
                <Link href="/create">Create</Link>
                <div className={styles.divider} />
                <Link href="/join">Join</Link>
                <div className={styles.divider} />
                <Link href="/view">View</Link>
              </div>
            )}
          </div>
          <Link href="/contact">Contact</Link>
          <Link href="/about-us">About Us</Link>
          <div className={styles.userContainer}>
            {status === "authenticated" ? (
              <Link href="/profile">
                <Image
                  src={session.user.image || "/user.png"}
                  alt="user Logo"
                  width={40}
                  height={40}
                  style={{ cursor: "pointer" }}
                />
              </Link>
            ) : (
              <>
                <Image
                  src="/user.png"
                  alt="user Logo"
                  width={40}
                  height={40}
                  onClick={() => setShowUserOptions(!showUserOptions)}
                  style={{ cursor: "pointer" }}
                />
                {showUserOptions && (
                  <div className={styles.userOptions}>
                    <Link href="/login">Log In</Link>
                    <div className={styles.divider} />
                    <Link href="/register">Sign Up</Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.divider} />
      </section>
      <div className={styles.mobile}>
        <div className={styles.logo}>
          <Image
            src="/DiamondProminenceLogo.png"
            alt="DiamondProminenceLogo"
            width={60}
            height={60}
            style={{ opacity: isOpenMobile ? "0.3" : "" }}
          />
        </div>
        <button
          className={styles.mobileBtn}
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          style={{ display: isOpenMobile ? "none" : "inline" }}
        >
          <MenuMobileIcon />
        </button>
        {isOpenMobile && (
          <MobileHeader
            isOpenMobile={isOpenMobile}
            setIsOpenMobile={setIsOpenMobile}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
          />
        )}
      </div>
    </>
  );
};

export default Header;
