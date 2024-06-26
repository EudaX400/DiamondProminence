import { CloseIcon } from "../public/icons/CloseIcon";
import Image from "next/image";
import styles from "../styles/components/mobileHeader.module.scss";
import Link from "next/link";
import { ArrowUpIcon } from "../public/icons/ArrowUpIcon";
import { ArrowDownIcon } from "../public/icons/ArrowDownIcon";
import { useState } from "react";
import { LanguageSelectorMobile } from "./LanguageSelectorMobile"; // Importar el nuevo selector de idioma

export const MobileHeader = ({ isOpenMobile, setIsOpenMobile, showOptions, setShowOptions }) => {
    return (
        <section className={styles.header}>
            <div className={styles.topSection}>
                <Link href='/profile'>
                    <Image
                        src="/user.png"
                        alt="user Logo"
                        width={40}
                        height={40}
                        style={{ cursor: "pointer" }}
                    />
                </Link>
                <button onClick={() => setIsOpenMobile(!isOpenMobile)}>
                    <CloseIcon />
                </button>
            </div>
            <div className={styles.logSection}>
                <Link href={"/login"}>Log In</Link>
                <div className={styles.divider} />
                <Link href={"/register"}>Sign Up</Link>
            </div>
            <div className={styles.index}>
                <div className={styles.tournamentLinkContainer}>
                    <div className={styles.tournament} onClick={() => setShowOptions(!showOptions)}>
                        <a
                            style={{ color: showOptions ? "#ff1f1f" : "white" }}
                        >
                            Tournament
                        </a>
                        {showOptions ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </div>
                    {showOptions && (
                        <div className={styles.tournamentOptions}>
                            <Link href={"/create"}>Create</Link>
                            <Link href={"/join"}>Join</Link>
                            <Link href={"/view"}>View</Link>
                        </div>
                    )}
                </div>
                <LanguageSelectorMobile />
                <Link href={"/contact"}>Contact</Link>
                <Link href={"/about-us"}>About Us</Link>
            </div>
            <div className={styles.logo}>
                <Image
                    src="/DiamondProminenceLogo.png"
                    alt="DiamondProminenceLog"
                    width={40}
                    height={40}
                />
            </div>
        </section>
    );
};
