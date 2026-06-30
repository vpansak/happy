import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import InteractiveCakeSection from "@/components/InteractiveCakeSection";

/* ───────────────── Unlock date ───────────────── */
const UNLOCK_AT = new Date("2026-08-12T00:00:00+05:30").getTime();

/* ───────────────── Netflix-style intro ───────────────── */
function NetflixIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1800),
      setTimeout(() => setPhase(2), 4200),
      setTimeout(() => setPhase(3), 7000),
      setTimeout(() => onDone(), 9500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black text-center"
    >
      {/* rain */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"
            style={{
              left: `${(i * 53) % 100}%`,
              top: "-20%",
              height: `${40 + (i % 6) * 20}px`,
              animation: `rain-fall ${0.6 + (i % 5) * 0.15}s linear ${(i % 10) * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
      {/* light streaks */}
      <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.25),transparent_60%)] blur-3xl" />

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.h1
            key="net"
            initial={{ scale: 0.6, opacity: 0, letterSpacing: "0.6em" }}
            animate={{ scale: 1, opacity: 1, letterSpacing: "0.35em" }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="font-serif-display text-3xl sm:text-5xl font-black tracking-[0.35em] text-red-600"
            style={{ textShadow: "0 0 24px rgba(239,68,68,0.9), 0 0 60px rgba(239,68,68,0.6)" }}
          >
            HAPPY BDAY MOTU
          </motion.h1>
        )}
        {phase === 1 && (
          <motion.div
            key="title"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="px-6"
          >
            <p className="font-serif-display tracking-[0.3em] text-xs text-red-500/90 uppercase">A Love Story</p>
            <h2
              className="font-serif-display mt-3 text-4xl sm:text-7xl font-bold text-white"
              style={{ textShadow: "0 0 30px rgba(255,200,200,0.7)" }}
            >
              MOTU
            </h2>
            <p className="font-script mt-2 text-2xl sm:text-4xl text-rose-300">An Unbreakable Love Story ❤️</p>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.p
            key="line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="max-w-2xl px-6 text-lg sm:text-2xl italic text-white/90"
          >
            A story that survived distance, pain, time…<br />but never stopped loving ❤️
          </motion.p>
        )}
        {phase === 3 && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/70 text-sm tracking-[0.3em] uppercase"
          >
            presenting…
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onDone}
        className="absolute bottom-6 right-6 rounded-full border border-white/30 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 hover:bg-white/10"
      >
        Skip ▸
      </button>

      <style>{`@keyframes rain-fall { to { transform: translateY(140vh); } }`}</style>
    </motion.div>
  );
}

/* ───────────────── Lock screen ───────────────── */
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [now, setNow] = useState(Date.now());
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, UNLOCK_AT - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  useEffect(() => {
    if (diff <= 0) window.location.reload();
  }, [diff]);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === "motu") {
      onUnlock();
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  const Cell = ({ v, l }: { v: number; l: string }) => (
    <div className="glass-card flex min-w-[68px] flex-col items-center rounded-2xl px-3 py-3 sm:min-w-[88px] sm:px-5 sm:py-4">
      <span className="font-serif-display text-3xl sm:text-5xl font-bold text-[color:var(--rose)] tabular-nums">
        {String(v).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] sm:text-xs">{l}</span>
    </div>
  );

  return (
    <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="glass-card relative overflow-hidden rounded-[2rem] p-8 sm:p-14 max-w-xl"
      >
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-rose-400/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl" />
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto text-6xl sm:text-7xl"
        >
          🔒❤️
        </motion.div>
        <h1 className="font-serif-display mt-4 text-3xl sm:text-5xl text-[color:var(--plum)]">
          Your Love Surprise is Locked
        </h1>
        <p className="font-script mt-2 text-2xl sm:text-3xl text-[color:var(--rose)]">
          Unlocks on 12 August 2026
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2 sm:gap-3">
          <Cell v={d} l="Days" />
          <Cell v={h} l="Hours" />
          <Cell v={m} l="Minutes" />
          <Cell v={s} l="Seconds" />
        </div>
        <button
          disabled
          className="mt-8 cursor-not-allowed rounded-full bg-gradient-to-r from-rose-300 to-pink-400 px-7 py-3 font-semibold text-white opacity-80"
        >
          Coming Soon ❤️
        </button>
        <p className="mt-5 text-sm italic text-[color:var(--muted-foreground)]">
          A story that survived everything… made with all my love by <b>Alok Singh</b>
        </p>

        {/* Small Bypass Key */}
        <div className="mt-6 flex flex-col items-center justify-center">
          {!showPass ? (
            <button
              onClick={() => setShowPass(true)}
              className="text-muted-foreground/30 hover:text-[color:var(--rose)] transition-colors duration-300 text-lg focus:outline-none"
              title="Unlock backdoor"
            >
              🔑
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleUnlockSubmit}
              className="flex flex-col items-center gap-2 mt-2 w-full max-w-xs"
            >
              <div className="flex gap-2 w-full">
                <input
                  type="password"
                  placeholder="Enter secret code..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 text-center text-sm rounded-full border bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    passError
                      ? "border-red-400 focus:ring-red-400/50"
                      : "border-rose-200 focus:ring-rose-400/50 focus:border-rose-400"
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-full bg-[color:var(--rose)] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Go
                </button>
              </div>
              {passError && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 font-medium"
                >
                  Wrong code, try again! 🤫
                </motion.span>
              )}
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────── Auto love letters feed ───────────────── */
const LOVE_LETTERS = [
  "Motu ❤️ तुम मेरी life की सबसे special हो",
  "तुम्हारी smile मेरी पूरी दुनिया है ❤️",
  "हर मुश्किल में तुमने मेरा साथ दिया, हमेशा।",
  "तुमने बिना phone के भी मुझे कभी अकेला नहीं छोड़ा।",
  "जब सब टूट रहा था, तब भी तुमने मुझे थामे रखा।",
  "तुम्हारी आँखों में मेरा घर है, Motu।",
  "हर रात की चोरी-छुपे call मेरी जान थी ❤️",
  "तुमने मुझे चुना — बार-बार, हर बार।",
  "4 Feb 2025 — वो दिन मेरी ज़िंदगी बदल गया।",
  "14 Oct 2025 — दुनिया ने pixels देखे, हमने वादे जिए।",
  "तुम्हारे बिना मैं अधूरा हूँ, हमेशा रहूँगा।",
  "I love you Motu — आज भी, कल भी, हमेशा ❤️",
];

function LoveLettersFeed() {
  const [items, setItems] = useState<{ id: number; text: string; typed: string }[]>([]);
  const idx = useRef(0);
  const counter = useRef(0);

  const push = () => {
    const text = LOVE_LETTERS[idx.current % LOVE_LETTERS.length];
    idx.current += 1;
    counter.current += 1;
    const id = counter.current;
    setItems((p) => [{ id, text, typed: "" }, ...p].slice(0, 8));
    // typing animation
    let i = 0;
    const typer = setInterval(() => {
      i += 1;
      setItems((p) => p.map((it) => (it.id === id ? { ...it, typed: text.slice(0, i) } : it)));
      if (i >= text.length) clearInterval(typer);
    }, 45);
  };

  useEffect(() => {
    push();
    const t = setInterval(push, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative z-10 mx-auto w-full max-w-2xl px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif-display mb-3 text-center text-4xl sm:text-5xl text-[color:var(--plum)]"
      >
        💌 Love Letters For You
      </motion.h2>
      <p className="mb-8 text-center text-sm text-[color:var(--muted-foreground)]">
        A new letter appears every minute ❤️
      </p>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="glass-card relative rounded-2xl rounded-tl-sm p-4 pr-6"
            >
              <span className="absolute -top-2 -left-2 text-xl">❤️</span>
              <p className="text-base sm:text-lg text-[color:var(--foreground)]">
                {it.typed}
                {it.typed.length < it.text.length && <span className="ml-0.5 animate-pulse">▍</span>}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

import hero from "@/assets/photos/1781266167807.png.asset.json";
import p1 from "@/assets/photos/Screenshot_20260612_165200.jpg.asset.json";
import p2 from "@/assets/photos/Screenshot_20260612_165243.jpg.asset.json";
import p3 from "@/assets/photos/Screenshot_20260612_165429.jpg.asset.json";
import p4 from "@/assets/photos/Screenshot_20260612_165505.jpg.asset.json";
import p5 from "@/assets/photos/Screenshot_20260612_165538.jpg.asset.json";
import p6 from "@/assets/photos/Screenshot_20260612_165601.jpg.asset.json";
import p7 from "@/assets/photos/Screenshot_20260612_165653.jpg.asset.json";
import p8 from "@/assets/photos/Screenshot_20260612_165831.jpg.asset.json";
import p9 from "@/assets/photos/Screenshot_20260612_165849.jpg.asset.json";

export const Route = createFileRoute("/")({ component: BirthdayPage });

const ALL = [hero, p1, p2, p3, p4, p5, p6, p7, p8, p9];

/* ───────────────── Ambient effects ───────────────── */

function Petals() {
  const items = Array.from({ length: 22 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 47) % 100;
        const dur = 10 + (i % 8);
        const delay = (i * 0.6) % 12;
        const size = 12 + (i % 5) * 6;
        const sym = i % 4 === 0 ? "✨" : i % 4 === 1 ? "❤️" : i % 4 === 2 ? "🌸" : "🌹";
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              fontSize: size,
              animation: `float-up ${dur}s linear ${delay}s infinite`,
              position: "absolute",
              bottom: 0,
              opacity: 0,
              filter: "drop-shadow(0 2px 6px rgba(244,114,182,.35))",
            }}
          >
            {sym}
          </span>
        );
      })}
    </div>
  );
}

function Twinkles() {
  const items = Array.from({ length: 36 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {items.map((_, i) => (
        <span
          key={i}
          className="animate-twinkle absolute"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDelay: `${(i * 0.3) % 3}s`,
            color: i % 2 ? "#f59ec0" : "#f7c873",
            fontSize: 10,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    ref.current = new Audio("https://cdn.pixabay.com/audio/2022/10/30/audio_347111d654.mp3");
    ref.current.loop = true;
    ref.current.volume = 0.4;
    return () => { ref.current?.pause(); };
  }, []);
  const toggle = () => {
    if (!ref.current) return;
    if (playing) ref.current.pause();
    else ref.current.play().catch(() => {});
    setPlaying(!playing);
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle music"
      className="glass-card fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-xl"
    >
      {playing ? "🔊" : "🎵"}
    </button>
  );
}

/* ───────────────── Photo frame ───────────────── */

function PhotoFrame({
  src,
  className = "",
  position = "center 25%",
}: { src: string; className?: string; position?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.95_0.04_20)] to-[oklch(0.9_0.07_340)] p-1.5 shadow-2xl ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full rounded-2xl object-cover transition-transform duration-[3000ms] hover:scale-105"
        style={{ objectPosition: position }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/40" />
    </div>
  );
}

/* ───────────────── Cinematic chapter ───────────────── */

type Chapter = {
  id: string;
  badge: string;
  title: string;
  date?: string;
  text: string;
  photo: typeof hero;
  position?: string;
  align?: "left" | "right";
  accent?: string;
};

const chapters: Chapter[] = [
  {
    id: "begin",
    badge: "✨ Chapter 1",
    title: "Beginning of Love",
    text: "Two hearts connected beyond distance — somewhere between glances and small talks, a forever quietly began.",
    photo: p1,
    align: "left",
    accent: "from-rose-200/60 to-pink-300/40",
  },
  {
    id: "proposal",
    badge: "💘 Chapter 2",
    title: "The Proposal",
    date: "4 February 2025",
    text: "He took a deep breath, said the words he had carried for years… and her life changed forever. She said yes — softly, but it sounded like the whole sky cheering.",
    photo: p2,
    align: "right",
    accent: "from-rose-300/60 to-fuchsia-300/40",
  },
  {
    id: "marriage",
    badge: "💍 Chapter 3",
    title: "Our Online Marriage",
    date: "14 October 2025",
    text: "No grand hall, no thousand guests — just two hearts, a small screen and a real forever bond. The world saw pixels; we felt vows.",
    photo: p3,
    align: "left",
    accent: "from-amber-200/60 to-rose-300/40",
  },
  {
    id: "storms",
    badge: "🌧 Chapter 4",
    title: "Through the Storms",
    text: "Caught while talking, scolded, separated, judged… family pressure and emotional storms hit again and again. But love never moved an inch.",
    photo: p4,
    align: "right",
    accent: "from-slate-200/60 to-rose-200/40",
  },
  {
    id: "distance",
    badge: "📱 Chapter 5",
    title: "Distance & Effort",
    text: "No personal phone. Stolen minutes on a study phone. Whispered calls past midnight. She always found a way back to him — every single day.",
    photo: p5,
    align: "left",
    accent: "from-indigo-200/60 to-rose-200/40",
  },
  {
    id: "loyal",
    badge: "❤️ Chapter 6",
    title: "She Always Chose Him",
    text: "Through every option, every doubt, every chance to walk away — she never chose anyone else. She always, always chose him.",
    photo: p6,
    align: "right",
    accent: "from-rose-300/60 to-pink-200/40",
  },
  {
    id: "today",
    badge: "🔥 Chapter 7",
    title: "Still Us — 12 August 2026",
    date: "Today",
    text: "Still together. Still strong. Still madly in love. The same eyes, the same laugh, the same Motu — only the love has grown bigger.",
    photo: p7,
    align: "left",
    accent: "from-amber-300/60 to-rose-300/40",
  },
];

function ChapterSection({ c, index }: { c: Chapter; index: number }) {
  const reverse = c.align === "right";
  return (
    <section id={c.id} className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className={`flex flex-col gap-8 ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center`}
      >
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 }}
            className="relative"
          >
            <div className={`absolute -inset-4 rounded-[2rem] bg-gradient-to-br ${c.accent ?? "from-rose-200/60 to-pink-300/40"} blur-2xl`} />
            <PhotoFrame
              src={c.photo.url}
              className="relative aspect-[4/5] w-full"
              position="center 22%"
            />
            <div className="absolute -bottom-3 -right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--plum)] shadow-lg backdrop-blur">
              Scene {String(index + 1).padStart(2, "0")}
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ x: reverse ? -30 : 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="glass-card rounded-3xl p-7 sm:p-9"
          >
            <p className="font-serif-display tracking-[0.25em] text-xs uppercase text-[color:var(--rose)]">
              {c.badge}
            </p>
            <h2 className="font-serif-display mt-2 text-3xl sm:text-5xl text-[color:var(--plum)]">
              {c.title}
            </h2>
            {c.date && (
              <p className="font-script mt-1 text-2xl text-[color:var(--rose)]">{c.date}</p>
            )}
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[color:var(--foreground)]">
              {c.text}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────── Memory gallery ───────────────── */

function Gallery() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ALL.length), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="gallery" className="relative z-10 mx-auto w-full max-w-5xl px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif-display mb-10 text-center text-4xl sm:text-6xl text-[color:var(--plum)]"
      >
        📸 Our Memories
      </motion.h2>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.95_0.04_20)] to-[oklch(0.9_0.07_340)] p-2 shadow-2xl sm:aspect-[4/3] sm:max-w-3xl">
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={i}
              src={ALL[i].url}
              alt={`Memory ${i + 1}`}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.1 }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 22%" }}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {ALL.map((_, j) => (
              <button
                key={j}
                onClick={() => setI(j)}
                aria-label={`Photo ${j + 1}`}
                className={`h-2 rounded-full transition-all ${j === i ? "w-7 bg-white" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {ALL.map((ph, j) => (
          <button
            key={j}
            onClick={() => setI(j)}
            className={`aspect-square overflow-hidden rounded-2xl ring-2 transition ${j === i ? "ring-[color:var(--rose)] scale-105" : "ring-transparent opacity-75 hover:opacity-100"}`}
          >
            <img
              src={ph.url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 22%" }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ───────────────── Timeline ───────────────── */

const milestones = [
  { date: "Before time", text: "Two strangers, one quiet feeling growing in silence." },
  { date: "4 Feb 2025", text: "He proposed. She said yes. The universe smiled." },
  { date: "14 Oct 2025", text: "Online marriage — real vows, real forever." },
  { date: "Every storm", text: "Caught, scolded, separated… still chose love." },
  { date: "Every night", text: "Stolen minutes on a study phone, always finding him." },
  { date: "12 Aug 2026", text: "Still together. Still us. Still unbreakable." },
];

function Timeline() {
  return (
    <section id="timeline" className="relative z-10 mx-auto w-full max-w-3xl px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif-display mb-10 text-center text-4xl sm:text-6xl text-[color:var(--plum)]"
      >
        💕 Our Story
      </motion.h2>
      <ol className="relative space-y-10 border-l-2 border-dashed border-[color:var(--rose)] pl-8">
        {milestones.map((t, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="glass-card rounded-2xl p-5"
          >
            <span className="absolute -left-[14px] flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-sm text-white shadow-lg">❤</span>
            <p className="font-script text-2xl text-[color:var(--plum)]">{t.date}</p>
            <p className="mt-1 text-[color:var(--muted-foreground)]">{t.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────── Forever promise ───────────────── */

function Promise() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="glass-card relative overflow-hidden rounded-[2rem] p-10 sm:p-14"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-rose-300/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
        <p className="font-serif-display tracking-[0.3em] text-xs uppercase text-[color:var(--rose)]">
          Forever Promise
        </p>
        <h3 className="font-script mt-4 text-5xl sm:text-7xl text-[color:var(--rose)] animate-heartbeat">
          I will always choose you
        </h3>
        <p className="mt-5 text-[color:var(--muted-foreground)] sm:text-lg">
          Through every storm, every silence and every sunrise — you are my home, Motu. ❤️
        </p>
        <p className="font-script mt-6 text-2xl text-[color:var(--plum)]">— Always yours, Alok</p>
      </motion.div>
    </section>
  );
}

/* ───────────────── Hero ───────────────── */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div style={{ y, opacity }} className="flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-serif-display tracking-[0.35em] text-xs uppercase text-[color:var(--plum)]"
        >
          A Love Story · 12 August
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
          className="font-serif-display mt-4 text-5xl sm:text-7xl text-[color:var(--plum)]"
        >
          Happy Birthday
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
          className="font-script text-7xl sm:text-9xl text-[color:var(--rose)] drop-shadow-sm animate-heartbeat"
        >
          Motu ❤️
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-6 max-w-xl text-base sm:text-lg italic text-[color:var(--muted-foreground)]"
        >
          A love story that survived everything…<br />
          made with all my heart by <span className="font-semibold text-[color:var(--plum)]">Alok Singh</span>
        </motion.p>

        <div className="relative mt-10 w-full max-w-2xl">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-rose-300/50 via-pink-300/40 to-amber-200/40 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.95_0.04_20)] to-[oklch(0.9_0.07_340)] p-2 shadow-2xl"
          >
            <img
              src={hero.url}
              alt="Motu & Alok"
              className="aspect-[4/5] w-full rounded-3xl object-cover sm:aspect-[4/3]"
              style={{ objectPosition: "center 22%" }}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="mt-10 text-sm uppercase tracking-[0.3em] text-[color:var(--plum)]"
        >
          scroll · our story begins ↓
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ───────────────── Final unlock ───────────────── */

function FinalUnlock() {
  return (
    <section id="unlock" className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-20 pt-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="glass-card relative overflow-hidden rounded-[2rem] p-10 sm:p-14"
      >
        <motion.div
          animate={{ rotate: [0, -6, 6, -4, 4, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto text-7xl"
        >
          🎁
        </motion.div>
        <h3 className="font-serif-display mt-5 text-3xl sm:text-4xl text-[color:var(--plum)]">
          One last surprise for you
        </h3>
        <p className="mt-3 text-[color:var(--muted-foreground)]">
          Tap below to unlock your special birthday gift, Motu ❤️
        </p>
        <Link to="/redeem-gift" className="btn-romance mt-7 inline-block text-lg">
          🎁 Unlock My Surprise Gift ❤️
        </Link>
      </motion.div>
    </section>
  );
}

/* ───────────────── Section wrapper ───────────────── */

function _Section({ id, title, emoji, children }: { id: string; title: string; emoji: string; children: ReactNode }) {
  return (
    <section id={id} className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 sm:py-24">
      <h2 className="font-serif-display mb-8 text-center text-3xl sm:text-5xl text-[color:var(--plum)]">
        <span className="mr-2">{emoji}</span>{title}
      </h2>
      <div className="glass-card rounded-3xl p-6 sm:p-10">{children}</div>
    </section>
  );
}

/* ───────────────── Page ───────────────── */

function BirthdayPage() {
  const [introDone, setIntroDone] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [byPassed, setByPassed] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const locked = now < UNLOCK_AT && !byPassed;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Twinkles />
      <Petals />

      <AnimatePresence>
        {!introDone && <NetflixIntro key="intro" onDone={() => setIntroDone(true)} />}
      </AnimatePresence>

      {introDone && locked && <LockScreen onUnlock={() => setByPassed(true)} />}

      {introDone && !locked && (
        <>
          <MusicToggle />
          <Hero />
          {chapters.map((c, i) => (
            <ChapterSection key={c.id} c={c} index={i} />
          ))}
          <Gallery />
          <Timeline />
          <LoveLettersFeed />
          <Promise />
          <InteractiveCakeSection />
          <FinalUnlock />
          <footer className="relative z-10 py-10 text-center text-sm text-[color:var(--muted-foreground)]">
            Made with <span className="text-[color:var(--rose)]">❤</span> by Alok Singh, forever for Motu.
          </footer>
        </>
      )}
    </div>
  );
}

