import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";

type YouTubePlayerProps = {
  player: YouTubePlayer;
  // eslint-disable-next-line no-unused-vars
  setPlayer: (x: YouTubePlayer) => void;
};

const YoutubeComponent = ({ player, setPlayer }: YouTubePlayerProps) => {
  const opts: YouTubeProps["opts"] = {
    playerVars: {
      rel: 0,
    },
  };
  const handleOnReady: YouTubeProps["onReady"] = (e) => {
    // prevent flickering
    setTimeout(() => {
      setPlayer(e.target);
    }, 500);
  };

  return (
    <YouTube
      videoId="YNIFm0QFAuA"
      onReady={handleOnReady}
      opts={opts}
      className={`${player ? "" : "invisible"} iframe-wrapper`}
    />
  );
};

export default YoutubeComponent;
