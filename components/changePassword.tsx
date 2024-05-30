import React, { useState } from "react";
import { useTranslation } from 'next-i18next';
import styles from "../styles/components/changePassword.module.scss";
import { Input } from "./Forms/Inputs";
import { Button } from "./Buttons/Button";

export default function ChangePassword({ email, closePassword }) {
  const { t } = useTranslation('common');
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage(t('changePassword_error'));
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
        credentials: "include", 
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordChangeMessage(t('changePassword_success'));
        closePassword();
      } else {
        setPasswordChangeMessage(data.message || t('changePassword_error'));
      }
    } catch (error) {
      setPasswordChangeMessage(t('changePassword_error'));
    }
  };

  return (
    <>
      <div className={styles.main_background} onClick={closePassword}></div>
      <div className={styles.changePasswordContainer}>
        <h2>{t('changePassword_title')}</h2>
        <form onSubmit={handlePasswordChange}>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder={t('changePassword_currentPassword')}
            />
          </div>
          <div>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              name="newPassword"
              placeholder={t('changePassword_newPassword')}
            />
          </div>
          <div>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
              placeholder={t('changePassword_confirmPassword')}
            />
          </div>
          <Button type="submit" style={undefined} disabled={undefined}>
            {t('changePassword_button')}
          </Button>
        </form>
        {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
      </div>
    </>
  );
}
