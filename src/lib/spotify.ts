const clientId = import.meta.env.SPOTIFY_CLIENT_ID!;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET!;

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyAlbumImage {
  url: string;
  width: number;
  height: number;
}

interface SpotifyAlbum {
  images: SpotifyAlbumImage[];
}

export interface SpotifyTrack {
  type: "track";
  name: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyAlbumItem {
  type: "album";
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyAlbumImage[];
  external_urls: { spotify: string };
}

import fs from "fs";

export async function getUserAccessToken(): Promise<string> {
  const refresh_token = fs.readFileSync("./refresh_token.txt", "utf-8");

  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(`Error refrescando token: ${data.error}`);
  return data.access_token;
}

export async function getSpotifyItem(id: string, type: "track" | "album"): Promise<SpotifyTrack | SpotifyAlbumItem> {
  const token = await getUserAccessToken();
  let url = "";

  if (type === "track") url = `https://api.spotify.com/v1/tracks/${id}`;
  else if (type === "album") url = `https://api.spotify.com/v1/albums/${id}`;
  else throw new Error("Tipo no soportado");

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await resp.text();
  if (!resp.ok) throw new Error(`No se pudo obtener el ${type} de Spotify: ${resp.status}`);

  const data = JSON.parse(text);

  if (type === "track") return { ...data, type: "track" };
  else return { ...data, type: "album" };
}
