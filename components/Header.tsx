import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/components/header.module.scss";
import Image from "next/image";
import { ArrowUpIcon } from "../public/icons/ArrowUpIcon";
import { ArrowDownIcon } from "../public/icons/ArrowDownIcon";
import { MobileHeader } from "./MobileHeader";
import { MenuMobileIcon } from "../public/icons/MenuMobileIcon";
  // const router = useRouter();
  // const isActive: (pathname: string) => boolean = (pathname) =>
  //   router.pathname === pathname;

  // let left = (
  //   <div className={styles.left}>
  //     <Link className={styles.bold} data-active={isActive("/")} href="/">
  //       Feed
  //     </Link>
  //   </div>
  // );

  //let right = null;

const Header = ({isOpenMobile, setIsOpenMobile}) => {


  const [showOptions, setShowOptions] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);

  return (
    <>
      <section className={styles.header}>
        <div className={styles.topMenu}>
          <p>Diamond Prominence</p>
        </div>

        <div className={styles.menu}>
          <Image
            src="/DiamondProminenceLogo.png"
            alt="DiamondProminenceLog"
            width={80}
            height={80}
          />
          <div className={styles.tournamentLinkContainer}>
            <div className={styles.tournament}>
              <a
                onClick={() => setShowOptions(!showOptions)}
                style={{ color: showOptions ? "#ff1f1f" : "white" }}
              >
                Tournament
              </a>
              {showOptions ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            {showOptions && (
              <div className={styles.tournamentOptions}>
                <Link href={""}>Create</Link>
                <div className={styles.divider} />
                <Link href={""}>Join</Link>
                <div className={styles.divider} />
                <Link href={""}>View</Link>
              </div>
            )}
          </div>
          <Link href={""}>Contact</Link>
          <Link href={""}>About Us</Link>
          <div className={styles.userContainer}>
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
                <Link href={"/login"}>Log In</Link>
                <div className={styles.divider} />
                <Link href={"/register"}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
        <div className={styles.divider} />
      </section>
      <div className={styles.mobile}>
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
