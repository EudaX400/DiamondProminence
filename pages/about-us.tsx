import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/pages/about-us.module.scss";
import Layout from "../components/Layout";

const AboutUs = () => {
  return (
    <Layout>
    <section className={styles.section}>
      <div className={styles.header}>
          <h1>About Us</h1>
        </div>
        <div className={styles.container}>
          <p>
            Welcome to our company! We are dedicated to providing the best
            service in the industry. Our team is made up of talented and
            passionate individuals who are committed to exceeding your
            expectations.
          </p>
          <p>
            We believe in the power of innovation and strive to bring you the
            latest solutions to meet your needs. Our mission is to deliver
            exceptional value to our customers through unparalleled quality and
            service.
          </p>
          <p>
            Thank you for choosing us. We look forward to serving you and
            helping you achieve your goals.
          </p>
        </div>
    </section>
    </Layout>
  );
};

export default AboutUs;
