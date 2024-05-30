import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/resetPassword.module.scss";
import { Input } from "../components/Forms/Inputs";

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, password, confirmPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        router.push("/login"); // Redireccionar a la página de login después del restablecimiento
      } else {
        setError(data.error || data.message || "Something went wrong");
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
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            placeholder="Enter your verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            name={undefined}
          />
          <Input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name={undefined}
          />
          <Input
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name={undefined}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.message}>
              Password reset successfully. Redirecting to login...
            </p>
          )}
        </form>
      </div>
    </div>
    </div>
  );
}