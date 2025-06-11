import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { CLIENT_ID } from "@/lib/constants";
import { useUserStore } from "@/lib/store/userStore";
import spotifyApi from "@/api/axios";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useUserStore((state) => state.setAuthenticated);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    } else if (localStorage.getItem("access_token")) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setIsAuthenticated]);

  interface SpotifyTokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    error?: string;
  }

  const getUserInfo = async () => {
    const response = await spotifyApi.get("/me");
    setUser(response.data);
  };

  const exchangeCodeForToken = async (code: string): Promise<void> => {
    setLoading(true);
    try {
      const codeVerifier = localStorage.getItem("code_verifier");

      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: window.location.origin + "/toptune",
          code_verifier: codeVerifier || "",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data: SpotifyTokenResponse = await response.data;

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        setIsAuthenticated(true);
        await getUserInfo();

        // Clean up the URL to remove the code
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else {
        console.error("Failed to get access token:", data);
      }
    } catch (error: unknown) {
      console.error("Error exchanging code for token:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
  }
  return <Outlet />;
};

export default ProtectedRoute;
