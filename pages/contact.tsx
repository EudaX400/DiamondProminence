import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/pages/contact.module.scss";
import { Input } from "../components/Forms/Inputs";
import { Textarea } from "../components/Forms/Textarea";
import { useTranslation } from 'next-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation('common');
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

    // Email validation
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
        setSuccessMessage(t('contact_success'));
        setName("");
        setMail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMessage(t('contact_error'));
      }
    } catch (error) {
      setErrorMessage(t('contact_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className={styles.contactContainer}>
        <h1 className={styles.title}>{t('contact_title')}</h1>
        <h2 className={styles.subtitle}>{t('contact_subtitle')}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">{t('contact_name')}</label>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="mail">{t('contact_email')}</label>
            <Input
              type="text"
              name="mail"
              value={mail}
              onChange={(event) => setMail(event.target.value)}
            />
            {mailError && <p className={styles.errorMessage}>{mailError}</p>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="subject">{t('contact_subject')}</label>
            <Input
              type="text"
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="message">{t('contact_message')}</label>
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
            {isSubmitting ? t('contact_sending') : t('contact_send')}
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
