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
import { connectToDatabase } from '../../utils/mongodb';

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
            height={400}
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
  const { db } = await connectToDatabase();
  const data = await db.collection('episodes').find().sort({ _id: -1 }).toArray();

  const paths = data.map(episode => {
    return {
      params: {
        slug: `${episode.slug}`,
      }
    };
  });

  return {
    paths,
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

    const episode = {
      id: `${data._id}`,
      title: data.title,
      thumbnail: data.thumbnail,
      // members: data.members,
      // publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
      slug: data.slug,
      publishedAt: data.published_at,
      description: data.description,
      duration: parseInt(data.file.duration, 10),
      durationAsString: convertDurationToTimeString(parseInt(data.file.duration, 10)),
      url: data.file.url,
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