const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

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

const cache = new Map<string, any>();
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now + 10000) {
    // Retornar token válido en cache
    return cachedToken.token;
  }

  const basic = btoa(`${clientId}:${clientSecret}`);
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(`No se pudo obtener el token: ${data.error_description || data.error}`);

  // Guardar token y expiración
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return data.access_token;
}

async function fetchSpotify(url: string, retries = 3, delayMs = 2000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const token = await getAccessToken();
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (resp.status === 429) {
      // Rate limit, esperar y reintentar
      const retryAfter = resp.headers.get("Retry-After");
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : delayMs;
      console.warn(`Rate limit alcanzado, reintentando en ${wait}ms...`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }

    const text = await resp.text();
    if (!resp.ok) throw new Error(`Error al obtener datos de Spotify: ${resp.status} - ${text}`);
    return JSON.parse(text);
  }

  throw new Error("No se pudo obtener datos de Spotify tras varios intentos");
}

export async function getSpotifyItem(id: string, type: "track" | "album"): Promise<SpotifyTrack | SpotifyAlbumItem> {
  const cacheKey = `${type}-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  let url = "";
  if (type === "track") url = `https://api.spotify.com/v1/tracks/${id}`;
  else if (type === "album") url = `https://api.spotify.com/v1/albums/${id}`;
  else throw new Error("Tipo no soportado");

  const data = await fetchSpotify(url);
  const result = { ...data, type };
  cache.set(cacheKey, result); // Guardar en cache
  return result;
}