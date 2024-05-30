import { useRouter } from 'next/router';
import styles from '../styles/components/LanguageSelector.module.scss';

export const LanguageSelector = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;

  const handleLocaleChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const locales = [
    { code: 'en', label: 'English' },
    { code: 'ca', label: 'Catalan' },
    { code: 'es', label: 'Español' },
  ];

  return (
    <div className={styles.languageSelector}>
      <select
        value={activeLocale}
        onChange={(e) => handleLocaleChange(e.target.value)}
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
    </div>
  );
};
