import spotifyApi from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { Crown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ProfileHeader() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const setAuth = useUserStore((state) => state.setAuthenticated);
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await spotifyApi.get("/me");
      setUser(response.data);
    };

    if (!user) {
      fetchUser();
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setAuth(false);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-6 border border-white/20 animate-pulse max-w-2xl min-w-[16rem] w-full mx-auto">
        <div className="h-16 bg-white/20 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl max-w-2xl min-w-[16rem] w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:items-center gap-3 md:gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16 md:w-20 md:h-20">
            <AvatarImage
              src={user?.images[0]?.url || "/placeholder.svg"}
              alt={user?.display_name}
            />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
              {user?.display_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {user?.product === "premium" && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-sky-400 to-violet-500 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h1 className="text-xl md:text-2xl font-black text-white mb-1">
            Hello
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              {" " + user?.display_name}
            </span>
            🎉
          </h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-gray-300">
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
              <span className="font-semibold text-xs">
                {user?.followers.total.toLocaleString()}{" "}
                {user?.followers.total == 1 ? "follower" : "followers"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-2xl h-7 px-3"
              onClick={() => handleLogout()}
            >
              <LogOut className="w-3 h-3 mr-1 cursor-pointer" />
              <div className="text-xs cursor-pointer">Logout</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
