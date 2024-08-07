import { createContext, useEffect, useRef, useState } from "react";

const AudioContext = createContext();
export { AudioContext };

const AudioState = (props) => {
  const [currSong, setCurrSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currTime, setCurrTime] = useState(0);
  const [duration, setDuration] = useState();
  const [queue, setQueue] = useState([]);
  const [loop, setLoop] = useState(0);
  const queueRef = useRef(queue); // Ref to keep latest queue value
  const currSongRef = useRef(currSong);
  const loopRef = useRef(loop);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    currSongRef.current = currSong;
  }, [currSong]);
  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const handleAudioSync = (newAudio, song) => {
    setCurrTime(newAudio.currentTime);
    if (newAudio.currentTime === newAudio.duration) {
      console.log("Ended");
      if (loopRef.current == 1) {
        setLoop(0);
        play(song);
      } else if (loopRef.current == 2) {
        play(song);
      } else {
        next(song);
      }
    }
  };
  const play = (song) => {
    if (audio) {
      audio.pause();
      audio.removeEventListener("timeupdate", handleAudioSync);
    }
    const newAudio = new Audio(song.filePath);
    setAudio(newAudio);
    setCurrSong(song);

    newAudio.addEventListener("timeupdate", () => {
      handleAudioSync(newAudio, song);
    });
    newAudio.volume = volume;
    newAudio
      .play()
      .then(() => {
        setIsPlaying(true);
        setDuration(newAudio.duration);
        document.title =  "Raahi Beats | " + song.title;
      })
      .catch((error) => {
        alert("Some Error Occured");
        console.error(error);
        // setAudio(null);
      });
  };

  const stop = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  };

  const playnpause = () => {
    if (audio) {
      if (!isPlaying) audio.play();
      else audio.pause();
      setIsPlaying(!isPlaying);
    } else {
      alert("No Audio is being played");
    }
  };

  const volumeChange = (e) => {
    const vol = Number(e) / 100;
    audio.volume = vol;
    setVolume(vol);
  };

  const handleSeek = (e) => {
    setCurrTime(e);
    audio.currentTime = e;
  };

  const next = () => {
    let queue = queueRef.current;
    const currSong = currSongRef.current;
    if (currSong) {
      const currentIndex = queue.findIndex((curr) => curr === currSong);
      if (currentIndex < queue.length - 1) {
        const nextSong = queue[currentIndex + 1];
        play(nextSong);
      } else {
        // alert("No next song available or reached the end of the queue.");
      }
    } else {
      alert("No current song playing.");
    }
  };

  const previous = () => {
    if (currSong) {
      const currentIndex = queue.findIndex((curr) => curr === currSong);
      if (currentIndex > 0) {
        const previousSong = queue[currentIndex - 1];
        play(previousSong);
      } else {
        alert("No previous song available or at the start of the queue.");
      }
    } else {
      alert("No current song playing.");
    }
  };

  const playbtnAddToQueue = (song) => {
    let tempQueue = queueRef.current;
    let index = tempQueue.findIndex((curr) => curr === song);
    if (index !== -1) {
      if (index == 0) audio.pause();
      tempQueue = tempQueue.filter((curr) => curr !== song);
    }
    tempQueue.push(song);
    setQueue(tempQueue);
  };
  const addToQueue = (song) => {
    let tempQueue = queueRef.current;
    let index = tempQueue.findIndex((curr) => curr === song);
    if (index !== -1) {
      if (index == 0) audio.pause();
      tempQueue = tempQueue.filter((curr) => curr !== song);
    }
    tempQueue.push(song);
    setQueue(tempQueue);
    alert("Song Added To Queue");
    if (!audio || audio.paused) play(tempQueue[0]);
  };

  const addPlaylistToQueue = (playlist) => {
    setQueue([...playlist]);
    play(playlist[0]);
  };

  const shuffle = () => {
    const queueTemp = queueRef.current;

    for (let i = queueTemp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queueTemp[i], queueTemp[j]] = [queueTemp[j], queueTemp[i]];
    }
    setQueue(queueTemp);
    play(queueTemp[0]);
  };

  return (
    <AudioContext.Provider
      value={{
        play,
        isPlaying,
        playnpause,
        stop,
        volumeChange,
        currTime,
        setCurrTime,
        duration,
        audio,
        handleSeek,
        currSong,
        queue,
        next,
        previous,
        setQueue,
        playbtnAddToQueue,
        addToQueue,
        addPlaylistToQueue,
        loop,
        setLoop,
        shuffle,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
export default AudioState;
