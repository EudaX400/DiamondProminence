import React from "react";
import Layout from "../components/Layout";
import styles from "../styles/pages/prime.module.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonClick } from "../components/Buttons/ButtonClick";

const Prime = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleBecomePrime = async () => {
    try {
      const response = await fetch("/api/become-prime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        router.push("/create");
      } else {
        console.error("Error becoming prime");
      }
    } catch (error) {
      console.error("Error becoming prime:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <section className={styles.primeSection}>
      <div className={styles.top}>
        <h1>Become a Prime User</h1>
        <p>Unlock exclusive features by becoming a prime user.</p>
      </div>
      <div className={styles.plan}>
        <div className={styles.free}>
          <div className={styles.title}>
            <h2>Free Plan</h2>
            <h2>0€</h2>
          </div>
          <p>Join tournaments</p>
          <p>View tournaments</p>
          <p>Access limited support</p>
          <p>Basic statistics</p>
        </div>
        <div className={styles.prime}>
          <div className={styles.title}>
            <h2>Prime Plan</h2>
            <h2>5€/month</h2>
          </div>
          <p>Join tournaments</p>
          <p>View tournaments</p>
          <p>Create tournaments</p>
          <p>Administrate tournaments</p>
          <p>Priority support</p>
          <p>Advanced statistics</p>
          <p>No ads</p>
          <ButtonClick onClick={handleBecomePrime}>Become Prime</ButtonClick>
        </div>
      </div>
      <div className={styles.details}>
        <h3>Why Become a Prime User?</h3>
        <p>As a prime user, you get access to premium features that enhance your tournament experience. Create and manage your own tournaments, gain priority support, and enjoy an ad-free experience.</p>
        <h3>Support & Community</h3>
        <p>Join a community of dedicated gamers and tournament enthusiasts. Get help from our support team and participate in exclusive events.</p>
        <h3>Advanced Features</h3>
        <p>Track your progress with advanced statistics, and enjoy a smoother, more enriched user experience.</p>
      </div>
    </section>
    </Layout>
  );
};

export default Prime;
