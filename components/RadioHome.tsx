"use client";

import { useEffect, useMemo, useState } from "react";
import { demoPlaylists, demoSongs, Playlist, Song } from "@/lib/demo";
import Player from "./Player";
import { getSupabaseBrowser } from "@/lib/supabase";

const hero = "/slay-house-bg.png";
function indiaMinutes() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find(p => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find(p => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

function activePlaylist(playlists: Playlist[]) {
  const now = indiaMinutes();
  return playlists.find(p => {
    const [sh, sm] = p.start_time.slice(0, 5).split(":").map(Number);
    const [eh, em] = p.end_time.slice(0, 5).split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return start < end ? now >= start && now < end : now >= start || now < end;
  }) ?? playlists[0];
}

export default function RadioHome() {
  const [playlists, setPlaylists] = useState<Playlist[]>(demoPlaylists);
  const [songs, setSongs] = useState<Song[]>(demoSongs);
  const [playlist, setPlaylist] = useState<Playlist>(demoPlaylists[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
const [menu, setMenu] = useState(false);
const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    (async () => {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("playlists").select("*").order("sort_order"),
        supabase.from("songs").select("*").eq("active", true).order("sort_order"),
      ]);
      if (p?.length) setPlaylists(p);
      if (s?.length) setSongs(s);
    })();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setPlaylist(activePlaylist(playlists)), 30000);
    setPlaylist(activePlaylist(playlists));
    return () => window.clearInterval(timer);
  }, [playlists]);

  const playlistSongs = useMemo(
    () => songs.filter(s => s.playlist_id === playlist?.id),
    [songs, playlist]
  );

  const current = playlistSongs[currentIndex] ?? playlistSongs[0] ?? songs[0];
  const next = playlistSongs.slice(currentIndex + 1, currentIndex + 6);

  const goNext = () => {
    if (!playlistSongs.length) return;
    setCurrentIndex((i) => (i + 1) % playlistSongs.length);
  };

  const selectSong = (index: number) => setCurrentIndex(index);

  return (
    <main className="radio" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,4,12,.82), rgba(7,4,12,.18) 48%, rgba(7,4,12,.70)), url(${hero})` }}>
      <header className="nav">
        <a className="brand" href="#">
          <span>Vice City</span>
          <b>RADIO</b>
        </a>
        <nav className={menu ? "navlinks open" : "navlinks"}>
          <a href="#home">HOME</a>
          <a href="#playlists">PLAYLISTS</a>
          <a href="#schedule">SCHEDULE</a>
          <a href="#about">ABOUT</a>
        </nav>
        <div className="navright">
          <span className="live"><i /> LIVE NOW</span>
          <button className="iconbtn" aria-label="Sound">◖))</button>
          <button className="hamb" onClick={() => setMenu(!menu)}>☰</button>
        </div>
      </header>

      <section id="home" className="heroGrid">
        <div className="leftStack">
          <section className="nowCard glass">
            <div className="eyebrow">NOW PLAYING</div>
            <div className="songMain">
              <div className="cover">
                {current?.artwork_url
                  ? <img src={current.artwork_url} alt="" />
                  : <img src={`https://i.ytimg.com/vi/${current?.youtube_id}/hqdefault.jpg`} alt="" />
                }
              </div>
              <div>
                <h1>{current?.title ?? "Vice City Radio"}</h1>
                <h3>{current?.artist ?? "Live Radio"}</h3>
                <p>{current?.album ?? "A nostalgic radio for timeless souls."}</p>
              </div>
            </div>
            <div className={`wave ${isPlaying ? "wavePlaying" : ""}`}>
  <span />
  {Array.from({ length: 54 }).map((_, i) => (
    <i
      key={i}
      style={{
        "--bar": `${8 + ((i * 17) % 28)}px`,
        "--delay": `${(i % 12) * 0.055}s`,
      } as React.CSSProperties}
    />
  ))}
  <span />
</div>
<Player song={current} onEnded={goNext} onPlayingChange={setIsPlaying} />
          </section>

          <section className="vibe glass">
            <div className="eyebrow">CURRENT VIBE</div>
            <strong>{playlist?.name ?? "90s Drive"} <small>✦</small></strong>
            <p>{playlist?.description ?? "Feel the nostalgia. Live the vibe."}</p>
          </section>
        </div>

        <section className="upNext glass">
          <div className="eyebrow">UP NEXT</div>
          <div className="queue">
            {next.map((song, idx) => {
              const actualIndex = currentIndex + 1 + idx;
              return (
                <button key={song.id} className="queueRow" onClick={() => selectSong(actualIndex)}>
                  <img src={song.artwork_url || `https://i.ytimg.com/vi/${song.youtube_id}/mqdefault.jpg`} alt="" />
                  <span><b>{song.title}</b><small>{song.artist}</small></span>
                  <em>{song.duration_seconds ? `${Math.floor(song.duration_seconds / 60)}:${String(song.duration_seconds % 60).padStart(2, "0")}` : "--:--"}</em>
                </button>
              );
            })}
          </div>
          <a href="#playlists" className="playlistLink">VIEW FULL PLAYLIST →</a>
        </section>
      </section>

      <section id="schedule" className="scheduleWrap">
        <div className="eyebrow">TUNE IN AT</div>
        <div id="playlists" className="schedule">
          {playlists.map((p, i) => (
            <button key={p.id} className={`scheduleCard ${p.id === playlist?.id ? "selected" : ""}`} onClick={() => { setPlaylist(p); setCurrentIndex(0); }}>
              <div className={`miniArt art${i}`} />
              <div>
                <h2>{p.name}</h2>
                <p>{p.start_time.slice(0,5)} — {p.end_time.slice(0,5)}</p>
                <span>{p.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer id="about" className="footer glass">
        <div className="social">◎ &nbsp; f &nbsp; ▶ &nbsp; ◇</div>
        <div className="footerBrand"><b>☼ &nbsp; V I C E &nbsp; C I T Y &nbsp; R A D I O</b><span>A nostalgic radio for timeless souls.</span></div>
        <div className="listen">LISTEN ON &nbsp; <b>▶</b> <b>●</b> <b>♪</b></div>
      </footer>
    </main>
  );
}
