import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import spotifyApi from "@/api/axios";

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

interface TopTracksResponse {
  items: SpotifyTrack[];
}
export default function TopTracks() {
  const [topTracks, setTopTracks] = useState<TopTracksResponse | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setIsLoading(true);
        const response = await spotifyApi.get(
          "/me/top/tracks?time_range=long_term&limit=10"
        );
        setTopTracks(response.data);
      } catch (err) {
        setError("Failed to fetch top tracks");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 max-w-2xl mx-auto w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 w-full bg-white/10 backdrop-blur-lg rounded-2xl animate-pulse border border-white/20"
          />
        ))}
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!topTracks)
    return (
      <div>
        <h2 className="text-2xl font-black text-white mb-8 flex items-center justify-center gap-3 max-w-2xl mx-auto">
          You don't have any top tracks 🥲
        </h2>
      </div>
    );

  const top3Tracks = topTracks.items.slice(0, 3);
  const remainingTracks = topTracks.items.slice(3);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 max-w-2xl mx-auto">
        <div className="h-1 flex-1 bg-gradient-to-l from-pink-500 to-transparent rounded-full"></div>
        Your Top Tracks
        <div className="h-1 flex-1 bg-gradient-to-r from-pink-500 to-transparent rounded-full"></div>
      </h2>

      <div className="flex justify-center items-end gap-2 md:gap-4 mb-8 max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <Card
            className={`bg-white/10 backdrop-blur-lg border border-white/20 mb-2 p-2 md:p-3 w-full max-w-[150px] md:max-w-[180px] transform transition-all duration-300 hover:scale-105 hover:bg-white/20 relative overflow-hidden`}
          >
            <CardContent className="p-0 flex flex-col items-center relative z-10">
              <Avatar className="w-20 h-20 md:w-28 md:h-28 rounded-xl shadow-lg mb-2">
                <AvatarImage
                  src={
                    top3Tracks[1]?.album.images[0]?.url || "/placeholder.svg"
                  }
                  alt={top3Tracks[1]?.album.name}
                />
                <AvatarFallback className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                  {top3Tracks[1]?.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-white text-center truncate w-full text-sm">
                {top3Tracks[1]?.name}
              </p>
              <p className="text-gray-300 text-center truncate w-full text-xs">
                {top3Tracks[1]?.artists.map((a) => a.name).join(", ")}
              </p>
            </CardContent>
          </Card>
          <div className="h-24 w-28 md:w-32 bg-gradient-to-t from-purple-500 to-violet-500 rounded-t-lg relative flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-black text-white absolute">
              2
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Card
            className={`bg-white/10 backdrop-blur-lg border border-white/30 mb-2 p-2 md:p-3 w-full max-w-[170px] md:max-w-[200px] transform transition-all duration-300 hover:scale-105 hover:bg-white/20 z-10 relative overflow-hidden`}
          >
            <CardContent className="p-0 flex flex-col items-center relative z-10">
              <Avatar className="w-24 h-24 md:w-36 md:h-36 rounded-xl shadow-lg mb-2">
                <AvatarImage
                  src={
                    top3Tracks[0]?.album.images[0]?.url || "/placeholder.svg"
                  }
                  alt={top3Tracks[0]?.album.name}
                />
                <AvatarFallback className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold">
                  {top3Tracks[0]?.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-white text-center truncate w-full">
                {top3Tracks[0]?.name}
              </p>
              <p className="text-gray-300 text-center truncate w-full text-sm">
                {top3Tracks[0]?.artists.map((a) => a.name).join(", ")}
              </p>
            </CardContent>
          </Card>
          <div className="h-32 w-32 md:w-40 bg-gradient-to-t from-pink-500 to-rose-500 rounded-t-lg relative flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-black text-white absolute">
              1
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Card
            className={`bg-white/10 backdrop-blur-lg border border-white/20 mb-2 p-2 md:p-3 w-full max-w-[140px] md:max-w-[170px] transform transition-all duration-300 hover:scale-105 hover:bg-white/20 relative overflow-hidden`}
          >
            <CardContent className="p-0 flex flex-col items-center relative z-10">
              <Avatar className="w-20 h-20 md:w-28 md:h-28 rounded-xl shadow-lg mb-2">
                <AvatarImage
                  src={
                    top3Tracks[2]?.album.images[0]?.url || "/placeholder.svg"
                  }
                  alt={top3Tracks[2]?.album.name}
                />
                <AvatarFallback className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
                  {top3Tracks[2]?.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-white text-center truncate w-full text-sm">
                {top3Tracks[2]?.name}
              </p>
              <p className="text-gray-300 text-center truncate w-full text-xs">
                {top3Tracks[2]?.artists.map((a) => a.name).join(", ")}
              </p>
            </CardContent>
          </Card>
          <div className="h-16 w-28 md:w-32 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg relative flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-black text-white absolute">
              3
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-2 max-w-2xl mx-auto w-full">
        {remainingTracks.map((track, index) => (
          <Card
            key={track.id}
            className="bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:scale-[1.01] group"
          >
            <CardContent className="py-2 px-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-12">
                  <span
                    className={`text-4xl font-black`}
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      lineHeight: 1,
                    }}
                  >
                    {index + 4}
                  </span>
                </div>

                <Avatar className="w-12 h-12 rounded-xl shadow-lg">
                  <AvatarImage
                    src={track.album.images[0]?.url || "/placeholder.svg"}
                    alt={track.album.name}
                  />
                  <AvatarFallback className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    {track.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate text-sm">
                    {track.name}
                  </p>
                  <p className="text-gray-300 truncate text-xs">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                  <span>{track.popularity}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
