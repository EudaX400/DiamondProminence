import { useState } from 'react';
import styles from '../styles/pages/requestReset.module.scss';

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Check your email for the verification code.');
        setError('');
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Send Verification Code</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </section>
  );
};

export default RequestReset;
