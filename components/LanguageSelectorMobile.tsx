import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/components/languageSelectorMobile.module.scss";
import { ArrowUpIcon } from "../public/icons/ArrowUpIcon";
import { ArrowDownIcon } from "../public/icons/ArrowDownIcon";

export const LanguageSelectorMobile = () => {
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);

    return (
        <div className={styles.languageLinkContainer}>
            <div className={styles.language} onClick={() => setShowLanguageOptions(!showLanguageOptions)}>
                <a
                    style={{ color: showLanguageOptions ? "#ff1f1f" : "white" }}
                >
                    Language
                </a>
                {showLanguageOptions ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            {showLanguageOptions && (
                <div className={styles.languageOptions}>
                    <Link href="/" locale="en">English</Link>
                    <Link href="/" locale="es">Español</Link>
                    <Link href="/" locale="ca">Català</Link>
                </div>
            )}
        </div>
    );
};
