import { useState } from "react";
import styles from "../styles/components/changePassword.module.scss";
import { Input } from "./Forms/Inputs";
import { Button } from "./Buttons/Button";

export default function ChangePassword({ email, openPassword }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage("New passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordChangeMessage("Password changed successfully");
      } else {
        setPasswordChangeMessage(data.message || "Error changing password");
      }
    } catch (error) {
      setPasswordChangeMessage("Error changing password");
    }
  };

  return (
    <>
      <div className={styles.main_background} onClick={openPassword}></div>
      <div className={styles.changePasswordContainer}>
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Current Password"
            />
          </div>
          <div>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              name="password"
              placeholder="New Password"
            />
          </div>
          <div>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="password"
              placeholder="Confirm Password"
            />
          </div>
          <Button type="submit" style={undefined} disabled={undefined}>
            Change Password
          </Button>
        </form>
        {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
      </div>
    </>
  );
}
