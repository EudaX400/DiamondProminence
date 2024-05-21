"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import styles from '../../styles/components/LogIn/form.module.scss';
import { GoogleIcon } from "../../public/icons/google";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ email: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);

      console.log(res);
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className={`${styles.error}`}>{error}</p>
      )}
      <div className={`${styles.mb6}`}>
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
          className={`${styles.inputStyle}`}
        />
      </div>
      <div className={`${styles.mb6}`}>
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password"
          className={`${styles.inputStyle}`}
        />
      </div>
      <button
        type="submit"
        style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
        className={`${styles.submitButton}`}
        disabled={loading}
      >
        {loading ? "loading..." : "Sign In"}
      </button>

      <div className={`${styles.divider}`}>
        <p className={`${styles.dividerText}`}>OR</p>
      </div>

      <a
        className={`${styles.googleButton}`}
        onClick={() => signIn("google", { callbackUrl })}
        role="button"
      >
        <GoogleIcon/>
        Continue with Google
      </a>
    </form>
  );
};
