import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Film,
  Camera,
  Radio,
} from 'lucide-react';

const HD_VIDEO_FEEDS = [
  {
    id: 'drone1',
    title: 'Drone Mohalla & Kothi Flyover',
    hindiTitle: 'ड्रोन मोहल्ला व कोठी व्यू',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-with-houses-and-trees-41559-large.mp4',
    poster: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&auto=format&fit=crop&q=85',
    tag: '4K Mohalla Drone',
  },
  {
    id: 'drone2',
    title: 'Sector Main Road & Market Artery',
    hindiTitle: '30ft/40ft मेन रोड व मंडी व्यू',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-highway-in-the-middle-of-a-rural-landscape-41554-large.mp4',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=85',
    tag: 'Road Width HD',
  },
  {
    id: 'drone3',
    title: 'Green Township & Plot Land Parcels',
    hindiTitle: 'टाउनशिप व ज़मीन प्लॉट व्यू',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-small-town-surrounded-by-nature-41556-large.mp4',
    poster: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=85',
    tag: 'Freehold Plots',
  },
];

export const VideoHeroBanner: React.FC = () => {
  const [activeFeed, setActiveFeed] = useState(HD_VIDEO_FEEDS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const switchFeed = (feed: typeof HD_VIDEO_FEEDS[0]) => {
    setActiveFeed(feed);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 bg-slate-950 my-6 group">
      {/* Immersive Full-Bleed HD Video Player Background */}
      <div className="relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[500px] flex flex-col justify-between p-5 sm:p-8 md:p-10 overflow-hidden">
        {/* HTML5 HD Video Stream */}
        <video
          key={activeFeed.src}
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={activeFeed.poster}
          className="absolute inset-0 w-full h-full object-cover brightness-70 contrast-105 transition-all duration-1000 scale-100 group-hover:scale-105"
        >
          <source src={activeFeed.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Cinematic Deep Royal Green & Saffron Ambience Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#072b17] via-[#072b17]/65 to-[#072b17]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.2),transparent_60%)] pointer-events-none" />

        {/* Top Floating Glassmorphism Navigation Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/50 text-emerald-300 text-xs font-black shadow-lg">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>HD SATELLITE MOHALLA FEED</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] bg-saffron-500/20 text-saffron-300 border border-saffron-400/40 px-2.5 py-1 rounded-full font-bold">
              1080p 60fps Drone
            </span>
          </div>

          {/* Interactive Camera Angle Feeds & Video Controls */}
          <div className="flex items-center gap-2">
            {/* Camera Feed Switcher Buttons */}
            <div className="hidden lg:flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-2xl border border-white/15">
              {HD_VIDEO_FEEDS.map((feed) => (
                <button
                  key={feed.id}
                  type="button"
                  onClick={() => switchFeed(feed)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeFeed.id === feed.id
                      ? 'bg-emerald-600 text-white shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>{feed.tag}</span>
                </button>
              ))}
            </div>

            {/* Play/Pause & Audio Toggles */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-xl bg-white/15 hover:bg-emerald-600 text-white transition-all active:scale-95"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl bg-white/15 hover:bg-saffron-600 text-white transition-all active:scale-95"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Center/Hero Glassmorphic Information Card Overlay */}
        <div className="relative z-10 my-auto py-6 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 border border-saffron-400/40 text-saffron-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-saffron-400 animate-spin-slow" />
            <span>Modern Indian Small-Town Property Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
            घर बैठे अपने मोहल्ले का <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-amber-300 to-emerald-300 font-serif">
              असली और सही रेट
            </span> जानिए
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-cream-100 font-medium leading-relaxed drop-shadow-md max-w-xl">
            भारतीय छोटे कस्बों और टियर-2/3 शहरों के लिए विशेष निर्मित। सरकारी सब-रजिस्ट्रार बैनामा, 30ft/40ft रोड फ्रंट और कॉर्नर प्लॉट के आधार पर सटीक मूल्यांकन।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-saffron-500 to-terracotta-600 hover:from-saffron-600 hover:to-terracotta-700 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-saffron-500/30 transition-all transform active:scale-95 group"
            >
              <Play className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>Full HD Explainer Video (1 Min)</span>
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-cream-100 text-xs font-bold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Active Feed: {activeFeed.title}</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Stats Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15 text-xs text-cream-200">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1,20,000+ Verified Registry Deeds
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <MapPin className="w-4 h-4 text-saffron-400" />
              140+ Tier-2 & Tier-3 Small Towns
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Circle Rate Gazette Linked
            </span>
          </div>

          {/* Camera Feed Ticker for Mobile */}
          <div className="flex lg:hidden items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-[10px] font-bold text-saffron-300">
            <Film className="w-3 h-3 text-saffron-400" />
            <span>HD Drone Stream Active</span>
          </div>
        </div>
      </div>

      {/* Interactive Explainer Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border-2 border-emerald-500/50 max-w-3xl w-full p-6 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 font-black text-base sm:text-lg">
                <Film className="w-5 h-5 text-saffron-400" />
                <span>MoolyaSetu (मूल्यसेतु) • Small Town Valuation Walkthrough</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                src={activeFeed.src}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-emerald-400">1. Sub-Registrar Gazette</div>
                <p className="text-slate-400 text-[11px]">Real 12-month registered sale deed records from your local tehsil.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-amber-400">2. Road Width Formula</div>
                <p className="text-slate-400 text-[11px]">Distinguishes tight 15ft gali vs wide 40ft sector road value.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-sky-400">3. Corner Plot Multiplier</div>
                <p className="text-slate-400 text-[11px]">Accounts for dual frontage and superior natural ventilation.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
