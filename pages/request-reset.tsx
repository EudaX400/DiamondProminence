import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/requestReset.module.scss";
import { Input } from "../components/Forms/Inputs";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        router.push("/reset-password"); // Redireccionar a la página de restablecimiento de contraseña
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.customBackground}`}>
    <div className={styles.section}>
      <div className={styles.container}>
        <h1>Request Password Reset</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name={undefined}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.message}>
              Check your email for the verification code
            </p>
          )}
        </form>
      </div>
    </div>
    </div>
  );
}
