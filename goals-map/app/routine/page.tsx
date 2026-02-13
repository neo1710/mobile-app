"use client";

import { useState, useRef, useCallback } from "react";

const CONFETTI_COLORS = ["#f9c0cb", "#e8728c", "#c94070", "#fde8ee", "#f4b8c8", "#ff9fb5", "#ffb3c6"];

const NO_LABELS = [
  "No",
  "Really though?? 👀",
  "Think again…",
  "I'm waiting 🥺",
  "Come on now…",
  "You sure about that?",
  "Please reconsider 🙃",
  "Last chance!",
  "Okay but still no",
  "…seriously??",
];

const QUESTIONS = [
  {
    id: "q1",
    question: "Who's my baby girl?",
    options: ["Me", "Bubu", "Mallika"],
    correctOnly: null, // all correct answers
  },
  {
    id: "q2",
    question: "Who is my Mika?",
    options: ["Meeeeeee", "Moti baby"],
    correctOnly: null, // all answers correct
  },
  {
    id: "q3",
    question: "Are you afraid?",
    options: ["No", "Are you kidding me?", "Hell nahh"],
    correctOnly: null, // all answers correct
  },
];

export default function RoutinePage() {
  const [step, setStep] = useState(0);
  const [noPressCount, setNoPressCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; symbol: string }[]>([]);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; size: number; delay: number; rotate: number }[]>([]);
  const uidRef = useRef(0);
  const uid = () => ++uidRef.current;

  const burst = useCallback((x: number, y: number, symbols = ["✨", "💕", "♡"]) => {
    const items = Array.from({ length: 10 }, () => ({
      id: uid(),
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 60,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));
    setParticles((p) => [...p, ...items]);
    setTimeout(() => setParticles((p) => p.filter((s) => !items.find((i) => i.id === s.id))), 1200);
  }, []);

  const celebrate = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 400;
    const pieces = Array.from({ length: 55 }, () => ({
      id: uid(),
      x: Math.random() * w,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 10,
      delay: Math.random() * 0.8,
      rotate: Math.random() * 360,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3200);
  }, []);

  const handleAnswer = (optionIndex: number, btnEl: HTMLButtonElement) => {
    if (transitioning) return;
    const q = QUESTIONS[step];

    if (q.correctOnly !== null && optionIndex !== q.correctOnly) {
      const key = `${step}-${optionIndex}`;
      setWrongKey(key);
      setTimeout(() => setWrongKey(null), 600);
      return;
    }

    setTransitioning(true);
    const rect = btnEl.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setTimeout(() => {
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 650);
  };

  const handleLastYes = (btnEl: HTMLButtonElement) => {
    if (transitioning) return;
    const rect = btnEl.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, ["💕", "✨", "♡", "💖"]);
    setTimeout(() => {
      setComplete(true);
      celebrate();
    }, 650);
  };

  const handleLastNo = (btnEl: HTMLButtonElement) => {
    setNoPressCount((n) => n + 1);
    const rect = btnEl.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, ["🥺", "👀", "💭"]);
  };

  const totalSteps = QUESTIONS.length + 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Lato:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --rose:       #e8728c;
          --deep-rose:  #c94070;
          --muted-rose: #f4b8c8;
          --text-dark:  #3a1a25;
          --text-mid:   #7a3a50;
          --wrong:      #e05555;
        }

        html { -webkit-text-size-adjust: 100%; }
        html, body {
          height: 100%;
          -webkit-tap-highlight-color: transparent;
          overscroll-behavior: none;
        }

        .rp {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(155deg, #fff0f4 0%, #ffe4ec 50%, #ffd6e7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(20px, 5vw, 48px) clamp(14px, 4vw, 24px);
          position: relative;
          overflow: hidden;
        }

        .rp::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.018;
          pointer-events: none;
          z-index: 0;
        }

        .rp__wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 560px;
        }

        /* ── header ── */
        .rp__header {
          text-align: center;
          margin-bottom: clamp(28px, 6vw, 50px);
          animation: slideDown 0.55s cubic-bezier(.22,1,.36,1) both;
        }

        .rp__title {
          font-family: 'Bodoni Moda', serif;
          font-size: clamp(34px, 10vw, 56px);
          color: var(--text-dark);
          font-weight: 500;
          line-height: 1.1;
        }
        .rp__title em { font-style: italic; color: var(--deep-rose); }

        .rp__subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(15px, 4vw, 19px);
          color: var(--text-mid);
          font-weight: 300;
          margin-top: 8px;
        }

        .rp__dots {
          display: flex;
          gap: 9px;
          justify-content: center;
          margin-top: 18px;
        }
        .rp__dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(232,114,140,0.2);
          transition: background 0.3s, transform 0.3s;
          flex-shrink: 0;
        }
        .rp__dot--done   { background: var(--muted-rose); }
        .rp__dot--active { background: var(--deep-rose); transform: scale(1.45); }

        /* ── card ── */
        .rp__card {
          background: rgba(255,255,255,0.91);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(249,192,203,0.55);
          border-radius: clamp(18px, 4vw, 26px);
          padding: clamp(28px, 7vw, 52px) clamp(20px, 6vw, 40px);
          box-shadow:
            0 14px 60px rgba(201,64,112,0.10),
            0 2px 8px rgba(0,0,0,0.03),
            inset 0 1px 0 rgba(255,255,255,0.8);
          animation: slideUp 0.55s cubic-bezier(.22,1,.36,1) both;
        }

        .rp__q {
          font-family: 'Bodoni Moda', serif;
          font-size: clamp(20px, 5.5vw, 30px);
          color: var(--text-dark);
          text-align: center;
          font-weight: 500;
          line-height: 1.45;
          margin-bottom: clamp(24px, 5vw, 36px);
        }

        .rp__opts {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 2.5vw, 14px);
        }

        /* ── buttons ── */
        .rp__btn {
          padding: clamp(14px, 3.5vw, 18px) clamp(16px, 4vw, 28px);
          background: linear-gradient(135deg, rgba(232,114,140,0.08), rgba(249,192,203,0.08));
          border: 1.5px solid var(--muted-rose);
          border-radius: clamp(10px, 2.5vw, 14px);
          font-family: 'Bodoni Moda', serif;
          font-size: clamp(14px, 3.8vw, 17px);
          color: var(--text-dark);
          cursor: pointer;
          letter-spacing: 0.02em;
          font-weight: 500;
          transition:
            background 0.22s,
            border-color 0.22s,
            transform 0.18s cubic-bezier(.34,1.56,.64,1),
            box-shadow 0.22s,
            color 0.18s;
          will-change: transform;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          width: 100%;
          text-align: center;
          line-height: 1.4;
        }

        .rp__btn:hover {
          background: linear-gradient(135deg, rgba(232,114,140,0.17), rgba(249,192,203,0.17));
          border-color: var(--rose);
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 24px rgba(201,64,112,0.16);
        }

        .rp__btn:active {
          transform: translateY(-1px) scale(0.99);
        }

        .rp__btn--wrong {
          animation: wrongShake 0.5s ease both;
          border-color: var(--wrong) !important;
          color: var(--wrong) !important;
          background: linear-gradient(135deg, rgba(224,85,85,0.1), rgba(224,85,85,0.05)) !important;
          pointer-events: none;
        }

        .rp__btn--no {
          font-style: italic;
          color: var(--text-mid);
          border-color: rgba(201,64,112,0.28);
          background: linear-gradient(135deg, rgba(232,114,140,0.04), rgba(249,192,203,0.04));
        }
        .rp__btn--no:hover {
          color: var(--deep-rose);
          border-color: var(--deep-rose);
        }

        /* ── celebration ── */
        .rp__cel { text-align: center; animation: fadeIn 0.65s cubic-bezier(.22,1,.36,1) both; }

        .rp__cel-emoji {
          display: block;
          font-size: clamp(56px, 14vw, 80px);
          line-height: 1;
          margin-bottom: clamp(18px, 4vw, 26px);
          animation: popIn 0.6s cubic-bezier(.34,1.56,.64,1) both;
        }

        .rp__cel-title {
          font-family: 'Bodoni Moda', serif;
          font-size: clamp(28px, 8vw, 46px);
          color: var(--text-dark);
          font-weight: 500;
          margin-bottom: 6px;
        }

        .rp__cel-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(19px, 5vw, 28px);
          color: var(--deep-rose);
          font-weight: 300;
          margin-bottom: clamp(18px, 4vw, 26px);
        }

        .rp__cel-msg {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(16px, 4vw, 18px);
          color: var(--text-mid);
          line-height: 1.85;
        }
        .rp__cel-msg + .rp__cel-msg { margin-top: 14px; }

        /* ── particles ── */
        .rp__particle {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          font-size: clamp(14px, 4vw, 20px);
          animation: particleFloat 1.1s cubic-bezier(.22,1,.36,1) forwards;
          transform: translate(-50%, -50%);
          will-change: transform, opacity;
        }

        @keyframes particleFloat {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.5); }
          45%  { opacity: 1; transform: translate(-50%,-85%) scale(1.3); }
          100% { opacity: 0; transform: translate(-50%,-150%) scale(0.6); }
        }

        /* ── confetti ── */
        .rp__confetti {
          position: fixed;
          top: -16px;
          pointer-events: none;
          z-index: 9998;
          border-radius: 2px;
          animation: confettiFall 3s ease-in forwards;
          will-change: transform, opacity;
        }

        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) rotate(800deg); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes wrongShake {
          0%   { transform: translateX(0); }
          18%  { transform: translateX(-9px); }
          36%  { transform: translateX(9px); }
          54%  { transform: translateX(-5px); }
          72%  { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .rp {
            padding-bottom: calc(clamp(20px, 5vw, 48px) + env(safe-area-inset-bottom));
            padding-left: calc(clamp(14px, 4vw, 24px) + env(safe-area-inset-left));
            padding-right: calc(clamp(14px, 4vw, 24px) + env(safe-area-inset-right));
          }
        }
      `}</style>

      {particles.map((p) => (
        <span key={p.id} className="rp__particle" style={{ left: p.x, top: p.y }}>
          {p.symbol}
        </span>
      ))}

      {confetti.map((c) => (
        <div
          key={c.id}
          className="rp__confetti"
          style={{
            left: c.x,
            width: c.size,
            height: c.size * 1.7,
            background: c.color,
            transform: `rotate(${c.rotate}deg)`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      <div className="rp">
        <div className="rp__wrap">
          {!complete ? (
            <>
              <header className="rp__header">
                <h1 className="rp__title">Our <em>Routine</em></h1>
                <p className="rp__subtitle">Answer these questions for me, baby ♡</p>
                <div className="rp__dots">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`rp__dot ${
                        i < step ? "rp__dot--done" :
                        i === step ? "rp__dot--active" : ""
                      }`}
                    />
                  ))}
                </div>
              </header>

              <div className="rp__card" key={step}>
                {step < QUESTIONS.length ? (
                  <>
                    <p className="rp__q">{QUESTIONS[step].question}</p>
                    <div className="rp__opts">
                      {QUESTIONS[step].options.map((opt, i) => {
                        const key = `${step}-${i}`;
                        return (
                          <button
                            key={key}
                            className={`rp__btn${wrongKey === key ? " rp__btn--wrong" : ""}`}
                            onClick={(e) => handleAnswer(i, e.currentTarget)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="rp__q">You know I am here right?</p>
                    <div className="rp__opts">
                      <button className="rp__btn" onClick={(e) => handleLastYes(e.currentTarget)}>
                        Offcourse baby
                      </button>
                      <button className="rp__btn rp__btn--no" onClick={(e) => handleLastNo(e.currentTarget)}>
                        {NO_LABELS[Math.min(noPressCount, NO_LABELS.length - 1)]}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="rp__card">
              <div className="rp__cel">
                <span className="rp__cel-emoji">🎉💕✨</span>
                <h2 className="rp__cel-title">Good Girl!</h2>
                <p className="rp__cel-sub">I love you bubu ♡</p>
                <p className="rp__cel-msg">
                  You passed all the questions!<br />
                  I&rsquo;m so proud of you, and I love you so much.
                </p>
                <p className="rp__cel-msg">Forever yours ♡</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}