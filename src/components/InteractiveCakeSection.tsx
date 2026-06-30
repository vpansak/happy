import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

// Import family photos (copied to assets)
import mummyPhoto from "@/assets/photos/mummy.jpg";
import papaPhoto from "@/assets/photos/papa.jpg";
import didiPhoto from "@/assets/photos/didi.jpg";
import honeyPhoto from "@/assets/photos/honey.jpg";
import familyPhoto from "@/assets/photos/family.jpg";

// Define the structure of family members
interface FamilyMember {
  name: string;
  relation: string;
  photoUrl: string | null;
  initials: string;
  gradient: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
  {
    name: "Mummy",
    relation: "Mother",
    photoUrl: mummyPhoto,
    initials: "M",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    name: "Papa",
    relation: "Father",
    photoUrl: papaPhoto,
    initials: "P",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: "Didi",
    relation: "Sister",
    photoUrl: didiPhoto,
    initials: "D",
    gradient: "from-purple-400 to-fuchsia-500",
  },
  {
    name: "Honey",
    relation: "Husband",
    photoUrl: honeyPhoto,
    initials: "H",
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function InteractiveCakeSection() {
  const [step, setStep] = useState<"candle" | "cut" | "feed" | "wish" | "done">("candle");
  const [fanActive, setFanActive] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [cakeCut, setCakeCut] = useState(false);
  const [feedIndex, setFeedIndex] = useState(0);
  const [feedingAnim, setFeedingAnim] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [wish, setWish] = useState("");
  const [submittingWish, setSubmittingWish] = useState(false);

  // Success confetti bursts
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff6b9d", "#ffc6d9", "#ffd6a5", "#fdffb6", "#caffbf"],
    });
  };

  // Candle blowing simulation
  useEffect(() => {
    if (fanActive) {
      const timer = setTimeout(() => {
        setCandleLit(false);
        triggerConfetti();
        setTimeout(() => {
          setStep("cut");
        }, 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [fanActive]);

  const handleCutCake = () => {
    setCakeCut(true);
    triggerConfetti();
    setTimeout(() => {
      setStep("feed");
    }, 1800);
  };

  const handleFeed = () => {
    if (feedingAnim) return;
    setFeedingAnim(true);

    // Generate floating hearts
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 40 + Math.random() * 20,
      y: 30 + Math.random() * 20,
    }));
    setHearts(newHearts);

    setTimeout(() => {
      setFeedingAnim(false);
      setHearts([]);
      if (feedIndex < FAMILY_MEMBERS.length - 1) {
        setFeedIndex((prev) => prev + 1);
      } else {
        setStep("wish");
      }
    }, 2000);
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    setSubmittingWish(true);
    try {
      // Save wish in Supabase logs
      await supabase.from("gift_redemptions").insert({
        name: "Motu's Wish",
        mobile: "8738869635",
        email: "wish@birthday.com",
        user_agent: `Wish: ${wish.trim()}`,
      });

      triggerConfetti();
      setStep("done");

      // Redirect to WhatsApp with pre-filled wish text
      const whatsappText = `Motu, Happy Birthday! ❤️🎂 Here is my special wish for you:\n\n"${wish.trim()}"\n\nSee your birthday surprise here: https://happybdaymotu.vercel.app`;
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=918738869635&text=${encodedText}`;

      // Short delay before opening WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);
    } catch (err) {
      console.error("Failed to submit wish:", err);
    } finally {
      setSubmittingWish(false);
    }
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-4 py-12 text-center">
      <h2 className="font-serif-display mb-6 text-3xl sm:text-5xl text-[color:var(--plum)]">
        🎂 Online Celebration!
      </h2>
      <div className="glass-card relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 shadow-soft">
        
        {/* Step 1: Blow out the Candle */}
        {step === "candle" && (
          <div className="flex flex-col items-center">
            <h3 className="font-serif-display text-xl sm:text-2xl text-[color:var(--plum)] mb-4">
              Blow Out the Candle! 🕯️
            </h3>
            <p className="text-sm text-[color:var(--muted-foreground)] mb-8">
              Turn on the fan below to blow out the candle and make a wish!
            </p>

            <div className="relative flex justify-center items-center gap-12 sm:gap-20 h-64 w-full">
              {/* The Fan */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={fanActive ? { rotate: 360 } : {}}
                  transition={fanActive ? { repeat: Infinity, duration: 0.3, ease: "linear" } : {}}
                  className="w-24 h-24 text-6xl flex items-center justify-center filter drop-shadow-md"
                >
                  🪭
                </motion.div>
                <button
                  onClick={() => setFanActive(true)}
                  disabled={fanActive}
                  className={`mt-4 px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-md ${
                    fanActive
                      ? "bg-emerald-100 text-emerald-600 cursor-not-allowed"
                      : "bg-rose-400 hover:bg-rose-500 text-white active:scale-95"
                  }`}
                >
                  {fanActive ? "Fan is ON 🌀" : "Turn Fan ON 🔘"}
                </button>
              </div>

              {/* Wind stream animation */}
              <AnimatePresence>
                {fanActive && candleLit && (
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -100, opacity: 0, scaleY: 0.5 }}
                        animate={{ x: 100, opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                        className="absolute h-1 bg-gradient-to-r from-sky-200/10 via-sky-300/40 to-transparent rounded-full"
                        style={{
                          width: "80px",
                          top: `${35 + i * 12}%`,
                          left: "40%",
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* The Cake & Candle */}
              <div className="relative flex flex-col items-center">
                {/* Candle Flame */}
                {candleLit ? (
                  <motion.div
                    animate={fanActive ? { x: [0, 10, -5, 10, 0], scaleY: [1, 0.7, 1.2, 0.5, 1] } : { scale: [1, 1.05, 0.95, 1] }}
                    transition={{ repeat: Infinity, duration: fanActive ? 0.2 : 0.8 }}
                    className="absolute -top-12 w-6 h-10 bg-gradient-to-t from-amber-400 via-orange-500 to-red-500 rounded-full blur-[1px] shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                    style={{ transformOrigin: "bottom center" }}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: [0, 1, 0], y: -40 }}
                    className="absolute -top-12 text-sm text-muted-foreground/60 select-none pointer-events-none"
                  >
                    💨
                  </motion.div>
                )}
                {/* Candle Stick */}
                <div className="absolute -top-4 w-2 h-10 bg-rose-200 border border-rose-300 rounded-t-sm" />
                {/* Cake Icon */}
                <div className="text-8xl filter drop-shadow-lg">🎂</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Cut the Cake */}
        {step === "cut" && (
          <div className="flex flex-col items-center py-6">
            <h3 className="font-serif-display text-xl sm:text-2xl text-[color:var(--plum)] mb-4">
              Candle is out! Now slice the cake 🔪
            </h3>
            <p className="text-sm text-[color:var(--muted-foreground)] mb-8">
              Click the button to cut the birthday cake!
            </p>

            <div className="relative flex justify-center items-center h-48 w-full">
              <AnimatePresence mode="wait">
                {!cakeCut ? (
                  <motion.div
                    key="uncut"
                    className="text-9xl relative filter drop-shadow-xl"
                  >
                    🎂
                  </motion.div>
                ) : (
                  <motion.div
                    key="cut-anim"
                    initial={{ scale: 0.9, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex gap-4 items-center justify-center"
                  >
                    <span className="text-8xl filter drop-shadow-md">🍰</span>
                    <span className="text-8xl filter drop-shadow-md">🎂</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleCutCake}
              disabled={cakeCut}
              className={`mt-6 btn-romance text-base px-8 py-3 ${
                cakeCut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              🔪 Cut Birthday Cake!
            </button>
          </div>
        )}

        {/* Step 3: Feed the Family */}
        {step === "feed" && (
          <div className="flex flex-col items-center">
            <h3 className="font-serif-display text-xl sm:text-2xl text-[color:var(--plum)] mb-2">
              Feed Cake to Your Family! 🍰
            </h3>
            <p className="text-sm text-[color:var(--muted-foreground)] mb-6">
              Let's share the happiness. Feed a slice to: <b>{FAMILY_MEMBERS[feedIndex].name}</b>
            </p>

            <div className="relative flex flex-col items-center justify-center py-4 w-full max-w-sm">
              {/* Floating Hearts Animation */}
              <AnimatePresence>
                {hearts.map((h) => (
                  <motion.span
                    key={h.id}
                    initial={{ x: `${h.x}%`, y: `${h.y}%`, opacity: 1, scale: 0.5 }}
                    animate={{ y: "-10%", opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute text-2xl z-20 pointer-events-none"
                  >
                    ❤️
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Sliced cake element for feeding */}
              <AnimatePresence>
                {feedingAnim && (
                  <motion.div
                    initial={{ y: 120, x: 0, scale: 1, opacity: 1 }}
                    animate={{ y: -30, scale: 0.6, opacity: 0.3 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute text-6xl z-10 pointer-events-none"
                  >
                    🍰
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Circular Avatar Container */}
              <div className="relative w-44 h-44 rounded-full p-2 border-4 border-rose-300 bg-white/40 shadow-lg overflow-hidden flex items-center justify-center">
                {FAMILY_MEMBERS[feedIndex].photoUrl ? (
                  <img
                    src={FAMILY_MEMBERS[feedIndex].photoUrl!}
                    alt={FAMILY_MEMBERS[feedIndex].name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${FAMILY_MEMBERS[feedIndex].gradient} flex items-center justify-center text-white text-6xl font-bold font-serif-display shadow-inner`}>
                    {FAMILY_MEMBERS[feedIndex].initials}
                  </div>
                )}

                {/* Smile / Mouth feed overlap */}
                <AnimatePresence>
                  {feedingAnim && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-rose-500/20 backdrop-blur-[2px] flex items-center justify-center text-4xl"
                    >
                      😋❤️
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title & Info */}
              <div className="mt-4">
                <span className="text-lg font-bold text-[color:var(--plum)]">
                  {FAMILY_MEMBERS[feedIndex].name}
                </span>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {FAMILY_MEMBERS[feedIndex].relation}
                </span>
              </div>

              {/* Feed Button */}
              <button
                onClick={handleFeed}
                disabled={feedingAnim}
                className="btn-romance mt-6 px-8 py-2.5 text-sm flex items-center gap-2"
              >
                🍰 Feed Cake!
              </button>
            </div>

            {/* Progress indicators */}
            <div className="flex gap-2 mt-8">
              {FAMILY_MEMBERS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === feedIndex
                      ? "w-8 bg-[color:var(--rose)]"
                      : i < feedIndex
                      ? "w-2.5 bg-[color:var(--rose)]/60"
                      : "w-2.5 bg-rose-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Write Wish with Big Frame */}
        {step === "wish" && (
          <div className="flex flex-col items-center">
            <h3 className="font-serif-display text-xl sm:text-3xl text-[color:var(--plum)] mb-2">
              Write a Wish for Motu! ✍️❤️
            </h3>
            <p className="text-sm text-[color:var(--muted-foreground)] mb-6">
              Aapka wish direct WhatsApp par send karne ka option niche milega.
            </p>

            {/* Big Polaroid Style Frame */}
            <div className="relative mb-8 p-4 bg-white shadow-soft rounded-3xl max-w-sm w-full border border-pink-100 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 shadow-inner">
                <img
                  src={familyPhoto}
                  alt="Happy Birthday Motu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-script mt-3 text-2xl text-[color:var(--rose)]">
                Happy Birthday Motu! 🎂❤️
              </div>
            </div>

            <form onSubmit={handleWishSubmit} className="w-full max-w-md flex flex-col gap-4">
              <textarea
                required
                rows={4}
                placeholder="Type your beautiful birthday wish here for Motu..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-rose-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 text-sm placeholder:text-muted-foreground/60 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={submittingWish || !wish.trim()}
                className="btn-romance w-full text-base py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingWish ? "Saving..." : "✨ Submit Wish & Open WhatsApp 📲"}
              </button>
            </form>
          </div>
        )}

        {/* Step 5: Completed state - One Last Surprise */}
        {step === "done" && (
          <div className="flex flex-col items-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              className="text-7xl mb-4 animate-heartbeat"
            >
              🎉🎁💖
            </motion.div>
            <h3 className="font-serif-display text-3xl sm:text-4xl text-[color:var(--plum)] mb-2">
              One last surprise for you
            </h3>
            <p className="text-sm sm:text-base text-[color:var(--rose)] max-w-md mb-8">
              Tap below to unlock your special birthday gift, Motu ❤️
            </p>

            <Link to="/redeem-gift" className="btn-romance inline-block text-lg px-8 py-4 mb-8">
              🎁 Unlock My Surprise Gift ❤️
            </Link>

            <div className="relative w-48 h-48 rounded-[2rem] overflow-hidden border-2 border-rose-200 shadow-md">
              <img
                src={mummyPhoto}
                alt="Celebration"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setStep("candle")}
              className="mt-8 px-6 py-2 border border-rose-300 rounded-full text-xs text-[color:var(--rose)] hover:bg-rose-50 transition-colors"
            >
              Celebration restart/review 🎂
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
