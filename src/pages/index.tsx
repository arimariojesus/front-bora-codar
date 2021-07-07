import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from './../services/api';
import { convertDurationToTimeString } from './../utils/convertDurationToTimeString';

import styles from './home.module.scss';
import { usePlayer } from './../contexts/PlayerContext';
import Layout from './../components/Layout';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  // members: string;
  slug: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
  lastEpisode: Episode;
  allEpisodes: Episode[];
};

export default function Home({ lastEpisode, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [lastEpisode, ...allEpisodes];
  
  return (
    <Layout title="Home">
      <div className={styles.homepage}>
        
        <section className={styles.lastEpisode}>
          <h2>Último lançamento</h2>

          <ul>
            <li>
              <Image
                width={192}
                height={192}
                src={lastEpisode.thumbnail}
                alt={lastEpisode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${lastEpisode.slug}`}>
                  <a>{lastEpisode.title}</a>
                </Link>
                {/* <p>{lastEpisode.members}</p> */}
                <span>{lastEpisode.publishedAt}</span>
                <span>{lastEpisode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => playList(episodeList, 0)}>
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          </ul>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.slug}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  {/* <td>{episode.members}</td> */}
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + 1)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // const { data: episodes } = await api.get('episodes');

    // if (!episodes) {
    //   return {
    //     notFound: true,
    //   };
    // }

    // const mappedEpisodes = episodes.map(episode => {
    //   return {
    //     id: episode._id,
    //     title: episode.title,
    //     thumbnail: episode.thumbnail,
    //     // members: episode.members,
    //     // publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
    //     slug: episode.slug,
    //     publishedAt: episode.published_at,
    //     duration: parseInt(episode.file.duration, 10),
    //     durationAsString: convertDurationToTimeString(parseInt(episode.file.duration, 10)),
    //     url: episode.file.url,
    //   }
    // });
    const mappedEpisodes = [{
      title: 'Série Código Limpo - EP 01 [prefácio]',
      published_at: '2021-02-21 20:10:40',
      thumbnail: 'https://production.listennotes.com/podcasts/bora-codar-RsLEMX_G8at-k7eaqr-ljOs.300x300.jpg',
      description: '<p>Codigo limpo é uma verdadeira obra de arte, somos apaixonados pelo livro.</p><p>Esta série é uma declaração de amor a obra, onde uniremos o conteudo do livro com nossa vivencia de mercado; esperamos que gostem!</p><p>Nosso site:</p><p><a href=https://codar.app>https://codar.app</a></p><p>Link para comprar o livro na Amazon:</p><p><a href=https://www.amazon.com.br/s?k=codigo+limpo&adgrpid=81608350312&gclid=Cj0KCQiApsiBBhCKARIsAN8o_4h3bBlJ2CD74udp3pdT3x8fS2mBE6nARpqXUYzJzya7iKvpY2KumtgaAhegEALw_wcB&hvadid=426015455681&hvdev=c&hvlocphy=1001533&hvnetw=g&hvqmt=e&hvrand=1641774745756650072&hvtargid=kwd-447114230604&hydadcr=5622_11235117&tag=hydrbrgk-20&ref=pd_sl_4ujrlkbcg3_e>https://www.amazon.com.br/s?k=codigo+limpo&adgrpid=81608350312&gclid=Cj0KCQiApsiBBhCKARIsAN8o_4h3bBlJ2CD74udp3pdT3x8fS2mBE6nARpqXUYzJzya7iKvpY2KumtgaAhegEALw_wcB&hvadid=426015455681&hvdev=c&hvlocphy=1001533&hvnetw=g&hvqmt=e&hvrand=1641774745756650072&hvtargid=kwd-447114230604&hydadcr=5622_11235117&tag=hydrbrgk-20&ref=pd_sl_4ujrlkbcg3_e</a></p>',
      // members: members,
      // publishedAt: format(parseISO(published_at), 'd MMM yy', { locale: ptBR }),
      slug: 'serie-codigo-limpo-ep-01-prefacio',
      publishedAt: '',
      duration: 0,
      durationAsString: '',
      url: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2021-1-21/157518456-44100-2-1515b72064319.m4a',
    }];

    const lastEpisode = mappedEpisodes[0];
    const allEpisodes = mappedEpisodes.slice(0);

    return {
      props: {
        lastEpisode,
        allEpisodes,
      },
      revalidate: 60 * 60 * 8,
    };
  } catch (_) {
    return {
      notFound: true,
    };
  }
}
