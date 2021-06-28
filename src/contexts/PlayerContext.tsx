import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  audio: HTMLAudioElement;
  episodeList: Episode[];
  currentEpisodeIndex: number;
  currentTime: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  setCurrentTime: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
  const [audio, setAudio] = useState<HTMLAudioElement>(null);
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const handleSetEpisode = () => {
    const currentEpisode = episodeList[currentEpisodeIndex];
    audio.src = currentEpisode.url;
  };

  const togglePlay = useCallback(async () => {
    if (!isPlaying) {
      await audio.play();
      setIsPlaying(true);

      return;
    }

    await audio.pause();
    setIsPlaying(false);
  }, [audio, isPlaying]);

  const toggleLoop = () => {
    setIsLooping(state => !state);
  };

  const toggleShuffle = () => {
    setIsShuffling(state => !state);
  };

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  };

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = (currentEpisodeIndex - 1) >= 0;

  const playNext = () => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    }else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const playPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  };

  useEffect(() => {
    const audioElement = new Audio('');

    const handleSetCurrentTime = () => {
      setCurrentTime(Math.floor(audioElement.currentTime));
    };

    const setupProgressListener = () => {
      audioElement.currentTime = 0;

      audioElement.addEventListener('timeupdate', handleSetCurrentTime);
    };

    audioElement.onplay = () => setPlayingState(true);
    audioElement.onpause = () => setPlayingState(false);
    audioElement.onended = handleEpisodeEnded;
    audioElement.onloadedmetadata = setupProgressListener;

    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = '';
      audioElement.removeEventListener('timeupdate', handleSetCurrentTime);
    };
  }, []);

  useEffect(() => {
  }, [currentTime]);

  useEffect(() => {
    if(!audio?.src) {
      return;
    }

    if(isPlaying) {
      handleSetEpisode();
      audio.play();
    }else {
      audio.pause();
    }
  }, [episodeList, currentEpisodeIndex]);

  return (
    <PlayerContext.Provider
      value={{
        audio,
        episodeList,
        currentEpisodeIndex,
        currentTime,
        play,
        playList,
        isPlaying,
        togglePlay,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        playNext,
        playPrevious,
        setPlayingState,
        setCurrentTime,
        clearPlayerState,
        hasNext,
        hasPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};
