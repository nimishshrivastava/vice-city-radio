"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "@/lib/demo";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function Player({
  song,
  onEnded,
  onPlayingChange,
}: {
  song?: Song;
  onEnded: () => void;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => setReady(true);
    if (window.YT) setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !song) return;
    playerRef.current?.destroy?.();
    playerRef.current = new window.YT.Player("yt-player", {
      videoId: song.youtube_id,
      playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, playsinline: 1 },
      events: {
       onReady: () => {
  setPlaying(false);
  onPlayingChange?.(false);
},
onStateChange: (e: any) => {
  if (e.data === 0) {
    setPlaying(false);
    onPlayingChange?.(false);
    onEnded();
  }

  if (e.data === 1) {
    setPlaying(true);
    onPlayingChange?.(true);
  }

  if (e.data === 2) {
    setPlaying(false);
    onPlayingChange?.(false);
  }
}
        }
      }
    });
    return () => playerRef.current?.destroy?.();
  }, [ready, song?.youtube_id]);

  const toggle = () => {
    if (!playerRef.current) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  return (
    <>
      <div id="yt-player" className="yt-hidden" />
      <div className="timeLine"><span>LIVE</span><div className="line"><i /></div><span>RADIO</span></div>
      <div className="controls">
        <button aria-label="Shuffle">⤨</button>
        <button aria-label="Previous">|◀</button>
        <button className="play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? "Ⅱ" : "▶"}</button>
        <button aria-label="Next" onClick={onEnded}>▶|</button>
        <button aria-label="Repeat">↻</button>
      </div>
    </>
  );
}
