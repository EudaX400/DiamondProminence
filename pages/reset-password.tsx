import { useState } from 'react';
import styles from '../styles/pages/resetPassword.module.scss';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.error);
        setMessage('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </section>
  );
};

export default ResetPassword;
