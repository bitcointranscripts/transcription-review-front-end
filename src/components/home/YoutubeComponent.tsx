import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";

type YouTubePlayerProps = {
  player: YouTubePlayer;
  setPlayer: (x: YouTubePlayer) => void;
};

const YoutubeComponent = ({player, setPlayer}: YouTubePlayerProps) => {
  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 1,
      controls: 0,
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
    <div style={Boolean(player) ? { opacity: 1 } : { opacity: 0 }}>
      <YouTube
        videoId="YNIFm0QFAuA"
        onReady={handleOnReady}
        {...opts}
        className="iframe-wrapper"
      />
    </div>
  );
};

export default YoutubeComponent;
