import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';

import { api } from './../../services/api';
import { convertDurationToTimeString } from './../../utils/convertDurationToTimeString';

import styles from './episodes.module.scss';
import { usePlayer } from './../../contexts/PlayerContext';
import Layout from './../../components/Layout';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  // members: string;
  publishedAt: string;
  slug: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

const Episode = ({ episode }: EpisodeProps) => {
  const { play } = usePlayer();

  return (
    <Layout title={episode.title}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          {/* <span>{episode.members}</span> */}
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </Layout>
  );
};

export default Episode;

export const getStaticPaths: GetStaticPaths = async  () => {
  // const { data } = await api.get('episodes', {
  //   params: {
  //     _limit: 2,
  //     _sort: 'published_at',
  //     _order: 'desc',
  //   }
  // });

  // const paths = data.map(episode => {
  //   return {
  //     params: {
  //       slug: episode.id,
  //     }
  //   };
  // });

  return {
    paths: [],
    fallback: 'blocking',
  }
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  try {
    const { data } = await api.get(`episodes/${slug}`);

    if (!data) {
      return {
        notFound: true,
      };
    }

    // const episode = {
    //   id: data._id,
    //   title: data.title,
    //   thumbnail: data.thumbnail,
    //   // members: data.members,
    //   // publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    //   slug: data.slug,
    //   publishedAt: data.published_at,
    //   description: data.description,
    //   duration: parseInt(data.file.duration, 10),
    //   durationAsString: convertDurationToTimeString(parseInt(data.file.duration, 10)),
    //   url: data.file.url,
    // };
    const episode = {
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
    };

    return {
      props: {
        episode,
      },
      revalidate: 60 * 60 * 24, // 24 horas
    };
  } catch(_) {
    return {
      notFound: true,
    };
  }
};