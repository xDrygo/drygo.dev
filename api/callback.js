import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No hay código de Spotify");

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = "https://www.drygo.dev/api/callback";

  try {
    // Intercambiar code por access_token y refresh_token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const data = await response.json();

    if (!data.refresh_token) {
      return res.status(500).send("No se recibió refresh token");
    }

    // Guardar refresh token
    const filePath = path.resolve("./refresh_token.txt");
    fs.writeFileSync(filePath, data.refresh_token, "utf-8");

    console.log("Access Token:", data.access_token);
    console.log("Refresh Token guardado correctamente.");

    res.status(200).send("Tokens recibidos y refresh token guardado. Revisa la consola.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el token");
  }
}