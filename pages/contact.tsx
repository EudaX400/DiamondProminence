import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/pages/contact.module.scss";
import { Input } from "../components/Forms/Inputs";

//VJ5AANNKHJDFLMMKZ441YWXY
//Diamond_Prominence1824*
//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

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setFormData({ name, email, subject, message });

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
        setFormData({ name: "", email: "", subject: "", message: "" });
        setName("");
        setEmail("");
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
            <label className={styles.label} htmlFor="email">Correo Electrónico</label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
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
