"use client";

import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import styles from "../../styles/components/Register/form.module.scss";

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
            <div className="mb-6">
                <input
                    required
                    type="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className={styles["form-control"]}
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="lastName"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={styles["form-control"]}
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className={styles["form-control"]}
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="username"
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={styles["form-control"]}
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="country"
                    name="country"
                    value={formValues.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={styles["form-control"]}
                />
            </div>
            <div className="mb-6">
                <input
                    required
                    type="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={styles["form-control"]}
                />
            </div>
            <button
                type="submit"
                style={{ backgroundColor: loading ? "#ccc" : "#3446eb" }}
                className={styles["btn-primary"]}
                disabled={loading}
            >
                {loading ? "loading..." : "Sign Up"}
            </button>
        </form>
    );
};

