import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
        
        <section>
          <h2>Último lançamento</h2>

          <figure className={styles.lastEpisode}>
            <Link href={`/episodes/${lastEpisode.slug}`}>
              <a>
                <picture>
                  <Image
                    width={264}
                    height={264}
                    src={lastEpisode.thumbnail}
                    alt={lastEpisode.title}
                    objectFit="cover"
                  />
                </picture>
              </a>
            </Link>

            <footer className={styles.episodeContent}>
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
            </footer>
          </figure>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          {allEpisodes.map((episode, index) => (
            <div className={styles.episodeContainer}>
              <Link href={`/episodes/${episode.slug}`}>
                <a>
                  <picture>
                    <Image
                      width={100}
                      height={100}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </picture>
                </a>
              </Link>
              <div>
                <h4>
                  <Link href={`/episodes/${episode.slug}`}>
                    <a>{episode.title}</a>
                  </Link>
                </h4>
                <p>{episode.publishedAt}</p>
              </div>
              <button type="button" onClick={() => playList(episodeList, index + 1)}>
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data: episodes } = await api.get('/episodes');

    if (!episodes) {
      return {
        notFound: true,
      };
    }

    const mappedEpisodes = episodes.map(episode => {
      return {
        id: `${episode._id}`,
        title: episode.title,
        thumbnail: episode.thumbnail,
        // members: episode.members,
        // publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
        slug: episode.slug,
        publishedAt: episode.published_at,
        duration: parseInt(episode.file.duration, 10),
        durationAsString: convertDurationToTimeString(parseInt(episode.file.duration, 10)),
        url: episode.file.url,
      }
    });

    const lastEpisode = mappedEpisodes[0];
    const allEpisodes = mappedEpisodes.slice(0);

    return {
      props: {
        lastEpisode,
        allEpisodes,
      },
      revalidate: 60 * 60 * 8,
    };
  } catch (err) {
    console.log('Error: ', err);
    return {
      notFound: true,
    };
  }
}
