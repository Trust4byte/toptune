import spotifyApi from "./api/axios";
import { useEffect, useState } from "react";

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
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

interface TopTracksResponse {
  items: SpotifyTrack[];
}

const OldTopTracks = () => {
  const [topTracks, setTopTracks] = useState<TopTracksResponse | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setIsLoading(true);
        const response = await spotifyApi.get(
          "/me/top/tracks?time_range=long_term"
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!topTracks) return <div>No tracks found</div>;

  // return (
  //   <div className="">
  //     <h2>Your Top Tracks</h2>
  //     <div className="">
  //       {topTracks.items.map((track) => (
  //         <div key={track.id} className="">
  //           <div className="track-image">
  //             {track.album.images.length > 0 && (
  //               <img
  //                 src={track.album.images[0].url}
  //                 alt={`${track.name} album cover`}
  //                 width="60"
  //                 height="60"
  //               />
  //             )}
  //           </div>
  //           <div className="">
  //             <h3>{track.name}</h3>
  //             <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
  //             <p>Album: {track.album.name}</p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default OldTopTracks;
