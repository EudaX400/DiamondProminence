import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from 'next-i18next';
import "../styles/global.scss";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default appWithTranslation(App);
