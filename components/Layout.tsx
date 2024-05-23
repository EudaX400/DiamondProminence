import React, { ReactNode, useState } from "react";
import Header from "./Header";
import styles from '../styles/components/Layout.module.scss'

const Layout = ({ children }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  return (
    <div>
      <Header isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />
      <div className={`${styles.layout} ${isOpenMobile ? styles.openMobile : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
