import { useState, useRef, useEffect } from "react";

export default function SpotifyCard({ item }) {
  if (!item) return null;

  const isTrack = item.type === "track";
  const coverUrl = isTrack
    ? item.album.images[0]?.url
    : item.images?.[0]?.url ?? "";
  const name = item.name ?? "Sin nombre";
  const artists = item.artists?.map((a) => a.name).join(", ") ?? "";
  const spotifyUrl = item.external_urls?.spotify ?? "#";

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const [nameOverflow, setNameOverflow] = useState(false);
  const [artistOverflow, setArtistOverflow] = useState(false);
  const nameRef = useRef(null);
  const artistRef = useRef(null);

  const togglePlay = () => {
    if (!isTrack || !item.preview_url) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play().catch(() => setIsPlaying(false));

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isTrack) return;
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setProgress(audio.currentTime);
    const ended = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, [isTrack]);

  useEffect(() => {
    if (nameRef.current) {
      setNameOverflow(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
    if (artistRef.current) {
      setArtistOverflow(
        artistRef.current.scrollWidth > artistRef.current.clientWidth
      );
    }
  }, [name, artists]);

  return (
    <div className="w-[200px] rounded-3xl shadow-2xl overflow-hidden text-white mx-auto relative flex flex-col opacity-20 hover:opacity-100 transition-all hover:scale-101">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${coverUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
          opacity: 0.5,
          zIndex: 0,
          transition: "opacity 0.3s",
        }}
      />

      <div className="relative z-10 bg-black/50 flex flex-col duration-300 opacity-100">
        <div className="w-full">
          <img src={coverUrl} alt={name} className="w-full h-auto object-cover" />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <div className="w-40 overflow-hidden">
            <h2
              ref={nameRef}
              className="relative text-md font-bold whitespace-nowrap"
            >
              <span className={nameOverflow ? "animate-marquee inline-block" : ""}>
                {name}
              </span>
            </h2>
            <p
              ref={artistRef}
              className="relative text-white/50 text-sm whitespace-nowrap"
            >
              <span className={artistOverflow ? "animate-marquee inline-block" : ""}>
                {artists}
              </span>
            </p>
          </div>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 px-4 py-2 bg-[#fff]/60 hover:bg-[#fdbaff]/100 hover:scale-102 transition-all text-black font-semibold rounded-full text-center"
          >
            Escuchar
          </a>
        </div>
      </div>
    </div>
  );
}
