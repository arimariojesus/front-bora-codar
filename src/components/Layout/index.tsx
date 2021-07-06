import { NextPage } from 'next';
import Head from 'next/head';
import Header from './../../components/Header';
import Player from './../../components/Player';

import styles from './styles.module.scss';

interface LayoutProps {
  title?: string;
}

const Layout: NextPage<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Bora Codar` : 'Bora Codar'}</title>
      </Head>
      <div className={styles.wrapper}>
        <main>
          <Header />
          {children}
        </main>

        <Player />
      </div>
    </>
  );
};

export default Layout;