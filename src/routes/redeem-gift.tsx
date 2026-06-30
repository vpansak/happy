import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redeem-gift")({
  component: RedeemGiftPage,
  head: () => ({
    meta: [
      { title: "Redeem Your Gift ❤️ — For Motu" },
      { name: "description", content: "Unlock a special birthday surprise from Alok." },
    ],
  }),
});

function RedeemGiftPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fire = () => {
    const burst = (origin: { x: number; y: number }) =>
      confetti({
        particleCount: 80,
        spread: 70,
        origin,
        colors: ["#ff6b9d", "#ffc6d9", "#ffd6a5", "#fdffb6", "#caffbf"],
      });
    burst({ x: 0.2, y: 0.6 });
    burst({ x: 0.8, y: 0.6 });
    setTimeout(() => burst({ x: 0.5, y: 0.3 }), 250);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("gift_redemptions")
        .insert({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        });

      if (insertError) {
        throw new Error(insertError.message || "Could not save your details. Please try again.");
      }

      setSuccess(true);
      fire();
      setTimeout(fire, 700);
      setTimeout(fire, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => navigate({ to: "/" }), 6500);
    return () => clearTimeout(t);
  }, [success, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      {/* Soft floating hearts */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 67) % 100}%`,
              fontSize: 14 + (i % 4) * 6,
              animation: `float-up ${9 + (i % 6)}s linear ${(i * 0.6) % 8}s infinite`,
              position: "absolute",
              bottom: 0,
              opacity: 0,
            }}
          >
            {i % 2 ? "❤️" : "🌸"}
          </span>
        ))}
      </div>

      <Link
        to="/"
        className="glass-card relative z-10 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm text-[color:var(--plum)]"
      >
        ← Back
      </Link>

      <div className="relative z-10 mx-auto mt-8 max-w-lg">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-6 sm:p-10"
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3], y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mx-auto mb-4 w-fit text-7xl"
              >
                🎁
              </motion.div>
              <h1 className="font-serif-display text-center text-3xl sm:text-4xl text-[color:var(--plum)]">
                Unlock Your Gift
              </h1>
              <p className="mt-2 text-center text-[color:var(--muted-foreground)]">
                A little surprise is waiting for you, Motu 💕
              </p>

              <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
                <Field
                  label="Your Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="Ayushi (Motu) 💕"
                  autoComplete="name"
                />
                <Field
                  label="Mobile Number"
                  value={form.mobile}
                  onChange={(v) => setForm({ ...form, mobile: v })}
                  placeholder="+91 ..."
                  type="tel"
                  autoComplete="tel"
                />
                <Field
                  label="Email Address"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />

                {error && (
                  <p className="text-center text-sm text-[color:var(--rose)]">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-romance mt-2 disabled:opacity-60"
                >
                  {loading ? "Unlocking…" : "Unlock My Gift ❤️"}
                </button>
                <p className="text-center text-xs text-[color:var(--muted-foreground)]">
                  Your details are kept safe and only used to send your surprise.
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.1 }}
                className="text-8xl"
              >
                🎁
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mt-4 text-5xl"
              >
                ❤️
              </motion.div>
              <h2 className="font-serif-display mt-4 text-3xl text-[color:var(--plum)]">
                Your surprise is unlocking ❤️
              </h2>
              <p className="font-script mt-3 text-2xl text-[color:var(--rose)]">
                Happy Birthday Motu — you mean the world to me.
              </p>
              <p className="mt-6 text-sm text-[color:var(--muted-foreground)]">
                Taking you back to your surprise page…
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[color:var(--plum)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        required
        className="rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-3 outline-none transition focus:border-[color:var(--rose)] focus:ring-2 focus:ring-[color:var(--blush)]"
      />
    </label>
  );
}
