// CLIENT_ID is sourced from environment variables
// For local dev: .env file with VITE_SPOTIFY_CLIENT_ID
// For GitHub Pages: Repository secret SPOTIFY_CLIENT_ID injected during build
export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = "http://127.0.0.1:3000";
export const SCOPE = "user-read-private user-read-email user-top-read";
export const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
