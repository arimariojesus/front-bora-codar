import React from 'react';

import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { usePlayer } from './../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from './../../utils/convertDurationToTimeString';

function Player() {
  const {
    audio,
    episodeList,
    currentEpisodeIndex,
    currentTime,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrevious,
    setCurrentTime,
    hasNext,
    hasPrevious
  } = usePlayer();

  const handleSeek = (amount: number) => {
    audio.currentTime = amount;
    setCurrentTime(amount);
  };

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing-codar.svg" alt="Tocando agora" style={{ width: '40px' }} />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <div className={styles.marquee}>
            <div>
              <strong>{episode.title}</strong>
              <strong>{episode.title}</strong>
            </div>
          </div>
          {/* <span>{episode.members}</span> */}
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <div className={styles.progress}>
        <span>{convertDurationToTimeString(currentTime)}</span>
        <div className={styles.slider}>
          {episode ? (
            <Slider
              max={episode.duration}
              value={currentTime}
              onChange={handleSeek}
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }}
              handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
            />
          ) : (
            <div className={styles.emptySlider} />
          )}
        </div>
        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
      </div>

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default React.memo(Player);