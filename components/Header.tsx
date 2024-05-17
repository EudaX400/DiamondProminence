import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/components/header.module.scss";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let left = (
    <div className={styles.left}>
      <Link className={styles.bold} data-active={isActive("/")} href="/">
        Feed
      </Link>
    </div>
  );

  let right = null;

  return (
    <nav className={styles.nav}>
      {left}
      {right}
    </nav>
  );
};

export default Header;
