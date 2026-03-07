import fs from "fs";
import path from "path";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const FEATURED_PLAYLIST_ID = "6rhg71awO0tB2GIunqOxAg";
const SPOTIFY_PROFILE_URL = "https://open.spotify.com/user/harshpratapchauhan";
const PLAYLIST_IDS = [FEATURED_PLAYLIST_ID] as const;
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_ACCOUNTS_BASE = "https://accounts.spotify.com/api";
const SPOTIFY_SNAPSHOT_PATH = path.join(
  process.cwd(),
  "lib",
  "spotify-home-snapshot.json",
);

type SpotifyImage = {
  url: string;
  width?: number | null;
  height?: number | null;
};

type SpotifyArtist = {
  id: string;
  name: string;
  external_urls?: {
    spotify?: string;
  };
  images?: SpotifyImage[];
  genres?: string[];
};

type SpotifyTrack = {
  id: string;
  name: string;
  external_urls?: {
    spotify?: string;
  };
  album?: {
    name: string;
    images?: SpotifyImage[];
  };
  artists?: Array<{
    id: string;
    name: string;
    external_urls?: {
      spotify?: string;
    };
  }>;
};

type SpotifyTopItemsResponse<T> = {
  items?: T[];
};

type SpotifyPlaylistResponse = {
  id: string;
  name: string;
  description: string;
  external_urls?: {
    spotify?: string;
  };
  images?: SpotifyImage[];
  owner?: {
    display_name?: string;
  };
  tracks?: {
    total?: number;
  };
};

export type ListeningCard = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  meta?: string;
};

export type ListeningFilter = {
  id: "artists-short" | "artists-long" | "tracks-short" | "tracks-long";
  label: string;
  eyebrow: string;
  items: ListeningCard[];
};

export type PlaylistSummary = {
  id: string;
  name: string;
  description: string;
  href: string;
  owner: string;
  trackCount?: number;
  image?: string;
};

export type SpotifyHomeData = {
  filters: ListeningFilter[];
  playlist: PlaylistSummary;
  playlists: PlaylistSummary[];
  profileUrl: string;
  personalizedDataAvailable: boolean;
};

function readSpotifySnapshot() {
  if (!fs.existsSync(SPOTIFY_SNAPSHOT_PATH)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(SPOTIFY_SNAPSHOT_PATH, "utf8");
    return JSON.parse(raw) as SpotifyHomeData;
  } catch {
    return null;
  }
}

function hasClientCredentials() {
  return Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET);
}

async function getClientAccessToken() {
  if (!hasClientCredentials()) {
    return null;
  }

  const credentials = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify client token failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  return data.access_token || null;
}

async function getUserAccessToken() {
  if (!hasClientCredentials() || !SPOTIFY_REFRESH_TOKEN) {
    return null;
  }

  const credentials = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify refresh token failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  return data.access_token || null;
}

async function spotifyGet<T>(urlPath: string, accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}${urlPath}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify request failed for ${urlPath}: ${response.status}`);
  }

  return (await response.json()) as T;
}

function pickImage(images?: SpotifyImage[]) {
  return images?.[0]?.url;
}

function mapArtist(artist: SpotifyArtist): ListeningCard {
  return {
    id: artist.id,
    title: artist.name,
    subtitle: artist.genres?.slice(0, 2).join(" | ") || "Artist",
    href: artist.external_urls?.spotify || "https://open.spotify.com/",
    image: pickImage(artist.images),
    meta: artist.genres?.[0],
  };
}

function mapTrack(track: SpotifyTrack): ListeningCard | null {
  const title = (track.name || "").trim();
  if (!title) {
    return null;
  }

  const artistNames =
    track.artists?.map((artist) => artist.name).join(", ") || "Track";

  return {
    id: track.id,
    title,
    subtitle: artistNames,
    href: track.external_urls?.spotify || "https://open.spotify.com/",
    image: pickImage(track.album?.images),
    meta: track.album?.name,
  };
}

function emptyFilter(
  id: ListeningFilter["id"],
  label: string,
  eyebrow: string,
): ListeningFilter {
  return {
    id,
    label,
    eyebrow,
    items: [],
  };
}

function createFallbackPlaylist(id: string): PlaylistSummary {
  return {
    id,
    name: "Spotify playlist",
    description: "Open the playlist on Spotify.",
    href: `https://open.spotify.com/playlist/${id}`,
    owner: "Spotify",
  };
}

function createEmptyData(playlists: PlaylistSummary[]): SpotifyHomeData {
  return {
    personalizedDataAvailable: false,
    profileUrl: SPOTIFY_PROFILE_URL,
    playlist: playlists[0],
    playlists,
    filters: [
      emptyFilter("artists-short", "Top artists", "This month"),
      emptyFilter("artists-long", "Top artists", "This year"),
      emptyFilter("tracks-short", "Top tracks", "This month"),
      emptyFilter("tracks-long", "Top tracks", "This year"),
    ],
  };
}

function mapPlaylist(playlist: SpotifyPlaylistResponse, id: string): PlaylistSummary {
  return {
    id,
    name: playlist.name || "Spotify playlist",
    description:
      playlist.description?.replace(/<[^>]+>/g, "") ||
      "Open the playlist on Spotify.",
    href: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${id}`,
    owner: playlist.owner?.display_name || "Spotify",
    trackCount: playlist.tracks?.total,
    image: pickImage(playlist.images),
  };
}

async function getPlaylists(accessToken: string | null) {
  if (!accessToken) {
    return PLAYLIST_IDS.map((id) => createFallbackPlaylist(id));
  }

  const playlists = await Promise.all(
    PLAYLIST_IDS.map(async (id) => {
      const playlist = await spotifyGet<SpotifyPlaylistResponse>(
        `/playlists/${id}`,
        accessToken,
      );
      return mapPlaylist(playlist, id);
    }),
  );

  return playlists;
}

function normalizeHomeData(data: SpotifyHomeData): SpotifyHomeData {
  const playlists =
    data.playlists?.length
      ? data.playlists
      : data.playlist
        ? [data.playlist]
        : [createFallbackPlaylist(FEATURED_PLAYLIST_ID)];

  const featured =
    playlists.find((playlist) => playlist.id === FEATURED_PLAYLIST_ID) || playlists[0];

  return {
    ...data,
    profileUrl: data.profileUrl || SPOTIFY_PROFILE_URL,
    playlist: featured,
    playlists,
    personalizedDataAvailable: data.filters.some((filter) => filter.items.length > 0),
  };
}

function mapTracks(items: SpotifyTrack[]) {
  return items
    .map(mapTrack)
    .filter((item): item is ListeningCard => item !== null);
}

export async function getSpotifyHomeData(): Promise<SpotifyHomeData> {
  const snapshot = readSpotifySnapshot();
  const clientToken = await getClientAccessToken().catch(() => null);
  const userToken = await getUserAccessToken().catch(() => null);
  const playlists =
    (await getPlaylists(clientToken).catch(() => null)) ||
    snapshot?.playlists ||
    [snapshot?.playlist || createFallbackPlaylist(FEATURED_PLAYLIST_ID)];

  if (!userToken) {
    return normalizeHomeData(snapshot || createEmptyData(playlists));
  }

  try {
    const [artistsShort, artistsLong, tracksShort, tracksLong] =
      await Promise.all([
        spotifyGet<SpotifyTopItemsResponse<SpotifyArtist>>(
          "/me/top/artists?limit=6&time_range=short_term",
          userToken,
        ),
        spotifyGet<SpotifyTopItemsResponse<SpotifyArtist>>(
          "/me/top/artists?limit=6&time_range=long_term",
          userToken,
        ),
        spotifyGet<SpotifyTopItemsResponse<SpotifyTrack>>(
          "/me/top/tracks?limit=6&time_range=short_term",
          userToken,
        ),
        spotifyGet<SpotifyTopItemsResponse<SpotifyTrack>>(
          "/me/top/tracks?limit=6&time_range=long_term",
          userToken,
        ),
      ]);

    return normalizeHomeData({
      personalizedDataAvailable: true,
      profileUrl: SPOTIFY_PROFILE_URL,
      playlist: playlists[0],
      playlists,
      filters: [
        {
          id: "artists-short",
          label: "Top artists",
          eyebrow: "This month",
          items: (artistsShort.items || []).map(mapArtist),
        },
        {
          id: "artists-long",
          label: "Top artists",
          eyebrow: "This year",
          items: (artistsLong.items || []).map(mapArtist),
        },
        {
          id: "tracks-short",
          label: "Top tracks",
          eyebrow: "This month",
          items: mapTracks(tracksShort.items || []),
        },
        {
          id: "tracks-long",
          label: "Top tracks",
          eyebrow: "This year",
          items: mapTracks(tracksLong.items || []),
        },
      ],
    });
  } catch {
    return normalizeHomeData(snapshot || createEmptyData(playlists));
  }
}
