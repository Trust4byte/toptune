import { Button } from "@/components/ui/button";
import { AUTH_URL, CLIENT_ID, SCOPE } from "@/lib/constants";
import { useUserStore } from "@/lib/store/userStore";
import { base64encode, generateRandomString, sha256 } from "@/lib/utils";
import { Hexagon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const isAuth = useUserStore((state) => state.isAuthenticated);

  const handleLogin = async () => {
    // Generate and store a new code verifier
    const codeVerifier = generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);

    // Create code challenge
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // Set up auth parameters
    const params = {
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPE,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: window.location.origin + "/toptune",
    };

    // Build and redirect to authorization URL
    AUTH_URL.search = new URLSearchParams(params).toString();
    window.location.href = AUTH_URL.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-20 max-w-4xl">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl flex items-center justify-center transform rotate-12 shadow-2xl">
                <Hexagon className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              Discover your
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Vibes
              </span>
            </h1>
          </div>

          <Button
            onClick={() => (isAuth ? navigate("/") : handleLogin())}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-12 py-6 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            {isAuth ? "Your Top Tracks" : "Connect Spotify"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
