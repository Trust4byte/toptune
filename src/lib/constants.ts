// CLIENT_ID is sourced from environment variables
// For local dev: .env file with VITE_SPOTIFY_CLIENT_ID
// For GitHub Pages: Repository secret SPOTIFY_CLIENT_ID injected during build
// export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// export const CLIENT_ID = "e5ebcd8b4a1447c2a5d6306a19f01d94";

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
export const REDIRECT_URI = isDevelopment
  ? "http://127.0.0.1:3000"
  : `${window.location.origin}${window.location.pathname}`;

export const SCOPE = "user-read-private user-read-email user-top-read";
export const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
