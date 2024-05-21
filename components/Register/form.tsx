"use client";

import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import styles from "../../styles/components/Register/form.module.scss";
import { Input } from "../Forms/Inputs";
import { Button } from "../Buttons/Button";

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    email: "",
    username: "",
    country: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      if (!res.ok) {
        const data = await res.json();
        setError(data.message);
        return;
      }

      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p className={styles["error-message"]}>{error}</p>}
      <div className={styles["input-container"]}>
        <Input
          type="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Name"
        />
      </div>
      <div className={styles["input-container"]}>
        <Input
          type="lastName"
          name="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
      </div>
      <div className={styles["input-container"]}>
        <Input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
        />
      </div>
      <div className={styles["input-container"]}>
        <Input
          type="username"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          placeholder="Username"
        />
      </div>
      <div className={styles["input-container"]}>
        <Input
          type="country"
          name="country"
          value={formValues.country}
          onChange={handleChange}
          placeholder="Country"
        />
      </div>
      <div className={styles["input-container"]}>
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
        style={{ backgroundColor: loading ? "#ccc" : "#3446eb" }}
        disabled={loading}
      >
        {loading ? "loading..." : "Sign Up"}
      </Button>
    </form>
  );
};
