import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Play, X } from "lucide-react";

const PLACEHOLDER_FILMS = [
  { id: "p1", title: "Boschendal Estate", couple: "A & B", venue: "Boschendal, Franschhoek" },
  { id: "p2", title: "Tintswalo Atlantic", couple: "C & D", venue: "Tintswalo Atlantic, Hout Bay" },
  { id: "p3", title: "La Cotte Farm", couple: "E & F", venue: "La Cotte, Franschhoek" },
  { id: "p4", title: "Cavalli Estate", couple: "G & H", venue: "Cavalli Estate, Somerset West" },
  { id: "p5", title: "Zorgvliet Wines", couple: "I & J", venue: "Zorgvliet, Stellenbosch" },
  { id: "p6", title: "Johannesdal Farm", couple: "K & L", venue: "Johannesdal, Stellenbosch" },
];

function FilmCard({ film, onClick, isPlaceholder }) {
  return (
    <div
      className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
      style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 60%, #111 100%)" }}
      onClick={() => !isPlaceholder && onClick(film)}
    >
      {film.file_url && !isPlaceholder ? (
        <img
          src={film.file_url}
          alt={film.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
        />
      ) : (
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.15) 0%, transparent 60%)" }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#c9a84c] group-hover:scale-110 transition-all duration-300 backdrop-blur-sm bg-black/20">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
        </div>
        {isPlaceholder && (
          <div className="absolute bottom-20 text-center px-4">
            <p className="text-white/30 text-xs">Films coming soon — check back shortly</p>
          </div>
        )}
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white font-light text-base leading-snug">{film.title || film.couple}</p>
        <p className="text-white/40 text-xs mt-1 tracking-wide">{film.venue || film.assigned_to || ""}</p>
      </div>
    </div>
  );
}

function VideoModal({ film, onClose }) {
  if (!film) return null;
  const isYouTube = film.file_url?.includes("youtube") || film.file_url?.includes("youtu.be");
  const isVimeo = film.file_url?.includes("vimeo");

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(film.file_url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
        <X className="w-6 h-6" />
      </button>
      <div
        className="w-full max-w-4xl mx-6 aspect-video rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {(isYouTube || isVimeo) && embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={film.title}
          />
        ) : (
          <video src={film.file_url} controls autoPlay className="w-full h-full" />
        )}
      </div>
    </div>
  );
}

export default function Films() {
  const [activeFilm, setActiveFilm] = useState(null);

  const { data: mediaAssets = [] } = useQuery({
    queryKey: ["films-videos"],
    queryFn: () => base44.entities.MediaAsset.filter({ type: "video" }),
    initialData: [],
  });

  const films = mediaAssets.length > 0 ? mediaAssets : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6 text-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.25) 0%, transparent 60%)" }}
        />
        <div className="relative">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Portfolio</p>
          <h1
            className="text-5xl md:text-7xl font-light text-white mb-5"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Wedding Films
          </h1>
          <p className="text-white/50 text-lg font-light max-w-xl mx-auto">
            A selection of stories I've been honoured to tell.
          </p>
        </div>
      </section>

      {/* Films grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {films
            ? films.map((film) => (
                <FilmCard key={film.id} film={film} onClick={setActiveFilm} isPlaceholder={false} />
              ))
            : PLACEHOLDER_FILMS.map((film) => (
                <FilmCard key={film.id} film={film} onClick={() => {}} isPlaceholder={true} />
              ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 border-t border-white/10 mt-8">
        <p className="text-white/50 text-lg mb-3">Want to see if we're a good fit?</p>
        <Link
          to="/book-me"
          className="inline-flex items-center gap-2 px-8 py-4 rounded text-sm font-medium text-black transition-all hover:opacity-90 mt-4"
          style={{ backgroundColor: "#c9a84c" }}
        >
          Book Me
        </Link>
      </section>

      {/* Modal */}
      {activeFilm && <VideoModal film={activeFilm} onClose={() => setActiveFilm(null)} />}
    </div>
  );
}