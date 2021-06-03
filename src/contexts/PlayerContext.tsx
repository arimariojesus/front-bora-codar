import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  isPlaying: boolean;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  const hasNext = (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = (currentEpisodeIndex - 1) > 0;

  const playNext = () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(nextEpisodeIndex);
    }
  };

  const playPrevious = () => {
    const previousEpisodeIndex = currentEpisodeIndex - 1;

    if (previousEpisodeIndex >= 0) {
      setCurrentEpisodeIndex(previousEpisodeIndex);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        setPlayingState,
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
