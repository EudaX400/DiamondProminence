// contact.tsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/pages/contact.module.scss";
import { Input } from "../components/Forms/Inputs";
import { Textarea } from "../components/Forms/Textarea";
import { useTranslation } from 'next-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation('common'); // Asegúrate de que el namespace 'common' esté siendo utilizado
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mailError, setMailError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      setMailError(t('contact_mail_error'));
      setIsSubmitting(false);
      return;
    } else {
      setMailError("");
    }

    const formData = { name, mail, subject, message };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Email sent successfully");
        setName("");
        setMail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMessage("Error sending email. Please try again");
      }
    } catch (error) {
      setErrorMessage("Please enter a valid email address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className={styles.contactContainer}>
        <h1 className={styles.title}>Contact</h1>
        <h2 className={styles.subtitle}>Send us a message</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Name</label>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="mail">Email</label>
            <Input
              type="text"
              name="mail"
              value={mail}
              onChange={(event) => setMail(event.target.value)}
            />
            {mailError && <p className={styles.errorMessage}>{mailError}</p>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="subject">Subject</label>
            <Input
              type="text"
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="message">Message</label>
            <Textarea
              id="message"
              name="message"
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
          {successMessage && (
            <p className={styles.thankYouMessage}>{successMessage}</p>
          )}
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Contact;
