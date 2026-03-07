import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ path: ".env.local" });

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const FEATURED_PLAYLIST_ID = "6rhg71awO0tB2GIunqOxAg";
const PROFILE_URL = "https://open.spotify.com/user/harshpratapchauhan";
const PLAYLIST_IDS = [
  FEATURED_PLAYLIST_ID,
  "1XoiWZo7JKCsSg0libZLwe",
  "7sP1QRH16monjfrPiLfXf2",
  "5z9RE0beJ1hbfX9LMr27AA",
  "1ZbcTBBsSTNiUOmqNSUE2B",
];
const OUTPUT_PATH = path.join(process.cwd(), "lib", "spotify-home-snapshot.json");

function ensureEnv() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error(
      "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REFRESH_TOKEN in .env.local.",
    );
    process.exit(1);
  }
}

async function getUserAccessToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(`Spotify refresh failed: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

async function spotifyGet(urlPath, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1${urlPath}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Spotify request failed for ${urlPath}: ${JSON.stringify(data)}`);
  }

  return data;
}

function pickImage(images) {
  return images?.[0]?.url;
}

function mapArtist(artist) {
  return {
    id: artist.id,
    title: artist.name,
    subtitle: artist.genres?.slice(0, 2).join(" | ") || "Artist",
    href: artist.external_urls?.spotify || "https://open.spotify.com/",
    image: pickImage(artist.images),
    meta: artist.genres?.[0],
  };
}

function mapTrack(track) {
  const title = (track.name || "").trim();
  if (!title) {
    return null;
  }

  return {
    id: track.id,
    title,
    subtitle: track.artists?.map((artist) => artist.name).join(", ") || "Track",
    href: track.external_urls?.spotify || "https://open.spotify.com/",
    image: pickImage(track.album?.images),
    meta: track.album?.name,
  };
}

function mapPlaylist(playlist, id) {
  return {
    id,
    name: playlist.name || "Spotify playlist",
    description:
      playlist.description?.replace(/<[^>]+>/g, "") ||
      "Open the playlist on Spotify.",
    href:
      playlist.external_urls?.spotify ||
      `https://open.spotify.com/playlist/${id}`,
    owner: playlist.owner?.display_name || "Spotify",
    trackCount: playlist.tracks?.total,
    image: pickImage(playlist.images),
  };
}

async function main() {
  ensureEnv();

  const accessToken = await getUserAccessToken();
  const [artistsShort, artistsLong, tracksShort, tracksLong, ...playlistsRaw] =
    await Promise.all([
      spotifyGet("/me/top/artists?limit=6&time_range=short_term", accessToken),
      spotifyGet("/me/top/artists?limit=6&time_range=long_term", accessToken),
      spotifyGet("/me/top/tracks?limit=6&time_range=short_term", accessToken),
      spotifyGet("/me/top/tracks?limit=6&time_range=long_term", accessToken),
      ...PLAYLIST_IDS.map((id) => spotifyGet(`/playlists/${id}`, accessToken)),
    ]);

  const playlists = playlistsRaw.map((playlist, index) =>
    mapPlaylist(playlist, PLAYLIST_IDS[index]),
  );

  const snapshot = {
    personalizedDataAvailable: true,
    profileUrl: PROFILE_URL,
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
        items: (tracksShort.items || []).map(mapTrack).filter(Boolean),
      },
      {
        id: "tracks-long",
        label: "Top tracks",
        eyebrow: "This year",
        items: (tracksLong.items || []).map(mapTrack).filter(Boolean),
      },
    ],
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`Wrote Spotify snapshot to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
