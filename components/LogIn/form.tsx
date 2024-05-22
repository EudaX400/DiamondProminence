"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import styles from '../../styles/components/LogIn/form.module.scss';
import { GoogleIcon } from "../../public/icons/google";
import { Input } from "../Forms/Inputs";
import { Button } from "../Buttons/Button";

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
        <Input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
        />
      </div>
      <div className={`${styles.mb6}`}>
        <Input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password"
        />
      </div>
      <Button
        type="submit"
        style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
        disabled={loading}
      >
        {loading ? "loading..." : "Sign In"}
      </Button>

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
