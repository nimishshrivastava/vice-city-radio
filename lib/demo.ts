export type Playlist = {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_time: string;
  end_time: string;
  cover_url?: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  youtube_id: string;
  artwork_url: string;
  duration_seconds: number;
  playlist_id: string;
};

export const demoPlaylists: Playlist[] = [
  { id: "p1", name: "90s Drive", slug: "90s-drive", description: "The perfect start to your day.", start_time: "06:00", end_time: "12:00" },
  { id: "p2", name: "Retro Afternoon", slug: "retro-afternoon", description: "Timeless hits all day long.", start_time: "12:00", end_time: "18:00" },
  { id: "p3", name: "Night Cruise", slug: "night-cruise", description: "Smooth tracks for the night.", start_time: "18:00", end_time: "00:00" },
  { id: "p4", name: "Midnight Vibes", slug: "midnight-vibes", description: "Late night, high vibes.", start_time: "00:00", end_time: "06:00" }
];

export const demoSongs: Song[] = [
  { id: "s6", title: "Dai Dai", artist: "Shakira, Burna Boy", album: "Dai Dai", youtube_id: "fcnDmrtj6Sk", artwork_url: "", duration_seconds: 190, playlist_id: "p3" },
  { id: "s1", title: "Dil Chahta Hai", artist: "Shankar–Ehsaan–Loy", album: "Dil Chahta Hai", youtube_id: "2M5j0f2Zl4U", artwork_url: "", duration_seconds: 310, playlist_id: "p1" },
  { id: "s2", title: "Khai Ke Paan Banaras Wala", artist: "Kishore Kumar", album: "Don", youtube_id: "b0pL6Y9K8dM", artwork_url: "", duration_seconds: 275, playlist_id: "p1" },
  { id: "s3", title: "Yun Hi Chala Chal", artist: "Udit Narayan, Hariharan, Kailash Kher", album: "Swades", youtube_id: "Y0U8Y4qj3wE", artwork_url: "", duration_seconds: 262, playlist_id: "p2" },
  { id: "s4", title: "Zinda", artist: "Shankar Mahadevan", album: "Bhaag Milkha Bhaag", youtube_id: "JfQxvK7hR6Y", artwork_url: "", duration_seconds: 227, playlist_id: "p3" },
  { id: "s5", title: "Kun Faya Kun", artist: "A.R. Rahman, Javed Ali, Mohit Chauhan", album: "Rockstar", youtube_id: "T94PHkuydcw", artwork_url: "", duration_seconds: 345, playlist_id: "p3" }
];
