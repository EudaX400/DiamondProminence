import { useRouter } from 'next/router';

export const LanguageSelector = () => {
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  const otherLocales = locales?.filter((locale) => locale !== activeLocale);

  const handleLocaleChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <div>
      {otherLocales?.map((locale) => (
        <button key={locale} onClick={() => handleLocaleChange(locale)}>
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
