import Link from "next/link";
import styles from "../styles/components/Footer.module.scss";
import Image from "next/image";

export const Footer = () => {
  return (
    <>
      <section className={styles.footer}>
        <div className={styles.footerContainer}>
          <Link href="/">
            <Image
              src="/DiamondProminenceLogo.png"
              alt="Diamond Prominence Logo"
              width={200}
              height={200}
            />
          </Link>
          <div className={styles.footerLinks}>
            <Link href="/create">Create</Link>
            <Link href="/join">Join</Link>
            <Link href="/view">View</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/about-us">About Us</Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>©</p>
          <p>Diamond Prominence</p>
        </div>
      </section>
    </>
  );
};
