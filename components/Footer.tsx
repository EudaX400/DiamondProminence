import Link from "next/link";
import styles from "../styles/components/Footer.module.scss";
import Image from "next/image";

export const Footer = () => {
  return (
    <section className={styles.footer}>
      <Link href="/">
        <Image
          src="/DiamondProminenceLogo.png"
          alt="Diamond Prominence Logo"
          width={200}
          height={200}
        />
      </Link>
      <div className={styles.footerLinks}>
        <Link href="">Create</Link>
        <Link href="">Join</Link>
        <Link href="">View</Link>
        <Link href="">Contact</Link>
        <Link href="">About Us</Link>
      </div>

    </section>
  );
};
