import '../styles/global.scss';

import { PlayerContextProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <Component {...pageProps} />
    </PlayerContextProvider>
  );
}

export default MyApp;
