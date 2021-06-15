import React from 'react';

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';

const Header = () => {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return (
    <header className={styles.headerContainer}>
      <img src="/codar.svg" alt="Codar" />

      <p>Notícias, dicas e macetes para quem quer ter sucesso no mercado.</p>

      <span>{currentDate}</span>
    </header>
  );
}

export default React.memo(Header);
