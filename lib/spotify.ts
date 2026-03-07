const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const PLAYLIST_ID = "6rhg71awO0tB2GIunqOxAg";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_ACCOUNTS_BASE = "https://accounts.spotify.com/api";

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
  personalizedDataAvailable: boolean;
};

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

async function spotifyGet<T>(path: string, accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify request failed for ${path}: ${response.status}`);
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
    subtitle: artist.genres?.slice(0, 2).join(" • ") || "Artist",
    href: artist.external_urls?.spotify || "https://open.spotify.com/",
    image: pickImage(artist.images),
    meta: artist.genres?.[0],
  };
}

function mapTrack(track: SpotifyTrack): ListeningCard {
  const artistNames = track.artists?.map((artist) => artist.name).join(", ") || "Track";
  return {
    id: track.id,
    title: track.name,
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

async function getPlaylistSummary(accessToken: string | null): Promise<PlaylistSummary> {
  const fallbackHref = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

  if (!accessToken) {
    return {
      name: "Featured playlist",
      description: "Open the playlist on Spotify.",
      href: fallbackHref,
      owner: "Spotify",
    };
  }

  try {
    const playlist = await spotifyGet<SpotifyPlaylistResponse>(
      `/playlists/${PLAYLIST_ID}`,
      accessToken,
    );

    return {
      name: playlist.name || "Featured playlist",
      description: playlist.description?.replace(/<[^>]+>/g, "") || "Open the playlist on Spotify.",
      href: playlist.external_urls?.spotify || fallbackHref,
      owner: playlist.owner?.display_name || "Spotify",
      trackCount: playlist.tracks?.total,
      image: pickImage(playlist.images),
    };
  } catch {
    return {
      name: "Featured playlist",
      description: "Open the playlist on Spotify.",
      href: fallbackHref,
      owner: "Spotify",
    };
  }
}

export async function getSpotifyHomeData(): Promise<SpotifyHomeData> {
  const clientToken = await getClientAccessToken().catch(() => null);
  const userToken = await getUserAccessToken().catch(() => null);

  const playlist = await getPlaylistSummary(clientToken);

  if (!userToken) {
    return {
      personalizedDataAvailable: false,
      playlist,
      filters: [
        emptyFilter("artists-short", "Top artists", "This month"),
        emptyFilter("artists-long", "Top artists", "This year"),
        emptyFilter("tracks-short", "Top tracks", "This month"),
        emptyFilter("tracks-long", "Top tracks", "This year"),
      ],
    };
  }

  try {
    const [artistsShort, artistsLong, tracksShort, tracksLong] = await Promise.all([
      spotifyGet<SpotifyTopItemsResponse<SpotifyArtist>>("/me/top/artists?limit=6&time_range=short_term", userToken),
      spotifyGet<SpotifyTopItemsResponse<SpotifyArtist>>("/me/top/artists?limit=6&time_range=long_term", userToken),
      spotifyGet<SpotifyTopItemsResponse<SpotifyTrack>>("/me/top/tracks?limit=6&time_range=short_term", userToken),
      spotifyGet<SpotifyTopItemsResponse<SpotifyTrack>>("/me/top/tracks?limit=6&time_range=long_term", userToken),
    ]);

    return {
      personalizedDataAvailable: true,
      playlist,
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
          items: (tracksShort.items || []).map(mapTrack),
        },
        {
          id: "tracks-long",
          label: "Top tracks",
          eyebrow: "This year",
          items: (tracksLong.items || []).map(mapTrack),
        },
      ],
    };
  } catch {
    return {
      personalizedDataAvailable: false,
      playlist,
      filters: [
        emptyFilter("artists-short", "Top artists", "This month"),
        emptyFilter("artists-long", "Top artists", "This year"),
        emptyFilter("tracks-short", "Top tracks", "This month"),
        emptyFilter("tracks-long", "Top tracks", "This year"),
      ],
    };
  }
}
