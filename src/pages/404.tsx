import { NextPage } from 'next';

import Layout from '../components/Layout';

const NotFound: NextPage<Record<string, unknown>> = () => {
  return (
    <Layout title="Página não encontrada.">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <h1>Página não encontrada.</h1>
      </div>
    </Layout>
  );
};

export default NotFound;
