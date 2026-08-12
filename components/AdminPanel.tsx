"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  youtube_id: string;
  playlist_id: string;
  active: boolean;
};

export default function AdminPanel() {
  const supabase = getSupabaseBrowser();
  const [user, setUser] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ title: "", artist: "", album: "", youtube_id: "", playlist_id: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    load();
  }, []);

  async function load() {
    if (!supabase) return;
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from("songs").select("*").order("sort_order"),
      supabase.from("playlists").select("*").order("sort_order")
    ]);
    setSongs(s ?? []);
    setPlaylists(p ?? []);
    if (!form.playlist_id && p?.[0]) setForm(f => ({ ...f, playlist_id: p[0].id }));
  }

  async function login() {
    if (!supabase) return setMessage("Add Supabase environment variables first.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error?.message ?? "Logged in.");
    if (!error) window.location.reload();
  }

  async function addSong(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.from("songs").insert({ ...form, active: true, sort_order: songs.length });
    setMessage(error?.message ?? "Song added.");
    if (!error) {
      setForm({ title: "", artist: "", album: "", youtube_id: "", playlist_id: playlists[0]?.id ?? "" });
      load();
    }
  }

  async function logout() {
    await supabase?.auth.signOut();
    window.location.reload();
  }

  if (!supabase) {
    return <div className="adminPage"><div className="adminBox"><h1>Admin setup</h1><p>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment.</p><a href="/">← Back to radio</a></div></div>;
  }

  if (!user) {
    return <div className="adminPage"><div className="adminBox"><h1>RADIO ADMIN</h1><p>Sign in with your Supabase admin account.</p><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><button onClick={login}>SIGN IN</button><small>{message}</small><a href="/">← Back to radio</a></div></div>;
  }

  return (
    <div className="adminPage">
      <div className="adminHeader"><div><span>VICE CITY RADIO</span><h1>CONTROL ROOM</h1></div><button onClick={logout}>LOG OUT</button></div>
      <div className="adminGrid">
        <section className="adminBox">
          <h2>ADD SONG</h2>
          <form onSubmit={addSong}>
            <input required placeholder="Song title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input placeholder="Artist" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
            <input placeholder="Album / film" value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} />
            <input required placeholder="YouTube video ID" value={form.youtube_id} onChange={e => setForm({ ...form, youtube_id: e.target.value })} />
            <select value={form.playlist_id} onChange={e => setForm({ ...form, playlist_id: e.target.value })}>
              {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button type="submit">PUBLISH SONG</button>
            <small>{message}</small>
          </form>
        </section>
        <section className="adminBox">
          <h2>SONGS</h2>
          <div className="adminList">
            {songs.map(s => <div className="adminRow" key={s.id}><b>{s.title}</b><span>{s.artist}</span><small>{s.youtube_id}</small></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
