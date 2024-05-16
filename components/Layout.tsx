import React, { ReactNode } from "react";
import Header from "./Header";
import styles from '../styles/components/Layout.module.scss'

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className={styles.layout}>{props.children}</div>
  </div>
);

export default Layout;
