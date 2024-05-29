import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/pages/contact.module.scss";
import { Input } from "../components/Forms/Inputs";

const Contact: React.FC = () => {
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

    // Validación del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      setMailError("Por favor ingresa un correo electrónico válido.");
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
        setSuccessMessage("Correo enviado exitosamente.");
        setName("");
        setMail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMessage("Error enviando el correo. Por favor intenta nuevamente.");
      }
    } catch (error) {
      setErrorMessage("Error enviando el correo. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className={styles.contactContainer}>
        <h1 className={styles.title}>Contacto</h1>
        <h2 className={styles.subtitle}>Envíanos un mensaje</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Nombre</label>
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
            <label className={styles.label} htmlFor="subject">Asunto</label>
            <Input
              type="text"
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="message">Mensaje</label>
            <textarea
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
            {isSubmitting ? "Enviando..." : "Enviar"}
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
