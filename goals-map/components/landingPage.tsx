"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const hearts = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 7 + Math.random() * 6,
  size: 10 + Math.random() * 18,
  opacity: 0.15 + Math.random() * 0.3,
}));

const loveMessages = [
  "Meri bubu, Ummahh 💕",
  "Thanks for making me feel super safe 🌸",
  "Daddy is Here for you 💕",
  "My heart found its home in you 🏡",
  "Always take care of yourself 🌷",
];

export default function ValentinePage() {
  const [currentMsg, setCurrentMsg] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; rotate: number }[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const nextId = useRef(0);
  const router = useRouter();

  const CORRECT_PASSWORD = "meribubu";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === CORRECT_PASSWORD) {
      setIsUnlocked(true);
    } else {
      setPasswordInput("");
      alert("Incorrect password. Try again!");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % loveMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPetals(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 6,
        rotate: Math.random() * 360,
      }))
    );
  }, []);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const newSparkles = Array.from({ length: 10 }, () => ({
      id: nextId.current++,
      x: cx + (Math.random() - 0.5) * 100,
      y: cy + (Math.random() - 0.5) * 100,
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.find((n) => n.id === s.id)));
    }, 900);
    setTimeout(() => setClicked(false), 600);
    router.push("/routine");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blush: #f9c0cb;
          --rose: #e8728c;
          --deep-rose: #c94070;
          --soft-pink: #fde8ee;
          --muted-rose: #f4b8c8;
          --text-dark: #3a1a25;
          --text-mid: #7a3a50;
        }

        html {
          -webkit-text-size-adjust: 100%;
          scroll-behavior: smooth;
        }

        html, body {
          height: 100%;
          -webkit-tap-highlight-color: transparent;
        }

        .page {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(160deg, #fff0f4 0%, #ffe4ec 45%, #ffd6e7 100%);
          font-family: 'Lato', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .page::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.022; pointer-events: none; z-index: 0;
        }

        /* ── Floating hearts ── */
        .hearts-bg { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .heart-float { position: absolute; bottom: -60px; animation: floatUp linear infinite; opacity: 0; }
        .heart-float svg { display: block; }
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: var(--op); }
          90%  { opacity: var(--op); }
          100% { transform: translateY(-110vh) rotate(20deg); opacity: 0; }
        }

        /* ── Petals ── */
        .petals-bg { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .petal {
          position: absolute; top: -30px;
          width: 12px; height: 16px;
          background: radial-gradient(ellipse at 40% 30%, #ffc8d8, #e8728c88);
          border-radius: 70% 30% 70% 30% / 40% 50% 50% 60%;
          animation: petalFall linear infinite; opacity: 0;
        }
        @keyframes petalFall {
          0%   { transform: translateY(0) rotate(var(--rot)); opacity: 0; }
          8%   { opacity: 0.55; }
          85%  { opacity: 0.45; }
          100% { transform: translateY(110vh) rotate(calc(var(--rot) + 180deg)) translateX(36px); opacity: 0; }
        }

        /* ── Sparkle ── */
        .sparkle {
          position: fixed; pointer-events: none; z-index: 999;
          font-size: 18px;
          animation: sparkleAnim 0.85s ease forwards;
          transform: translate(-50%, -50%);
        }
        @keyframes sparkleAnim {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.5); }
          50%  { opacity: 1; transform: translate(-50%,-80%) scale(1.3); }
          100% { opacity: 0; transform: translate(-50%,-120%) scale(0.6); }
        }

        /* ── Layout ── */
        .container {
          position: relative; z-index: 2;
          max-width: 860px; margin: 0 auto;
          padding: 0 20px;
          display: flex; flex-direction: column; align-items: center;
        }

        /* ── Top badge ── */
        .top-band { width: 100%; display: flex; justify-content: center; padding-top: 32px; animation: fadeSlideDown 0.8s ease both; }
        .top-tag {
          font-family: 'Lato', sans-serif; font-weight: 300; font-size: 10px;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--deep-rose); border: 1px solid var(--muted-rose);
          padding: 6px 16px; border-radius: 100px;
          background: rgba(255,255,255,0.72); backdrop-filter: blur(6px);
          white-space: nowrap;
        }

        /* ── Hero ── */
        .hero { text-align: center; padding: 40px 0 16px; animation: fadeSlideDown 0.9s ease 0.1s both; }
        .hero-eyebrow { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; color: var(--rose); letter-spacing: 0.04em; margin-bottom: 12px; }
        .hero-title {
          font-family: 'Bodoni Moda', serif; font-weight: 500;
          font-size: clamp(44px, 13vw, 96px);
          line-height: 1.0; color: var(--text-dark); letter-spacing: -0.02em;
        }
        .hero-title em { font-style: italic; color: var(--deep-rose); }
        .hero-sub {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(16px, 4vw, 22px);
          color: var(--text-mid); font-weight: 300; margin-top: 14px; line-height: 1.55;
        }

        /* ── Divider ── */
        .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; width: 100%; max-width: 260px; animation: fadeIn 1s ease 0.4s both; }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--muted-rose), transparent); }
        .divider-heart { color: var(--rose); font-size: 16px; }

        /* ── Message box ── */
        .message-box {
          background: rgba(255,255,255,0.78); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,182,202,0.45); border-radius: 18px;
          padding: 24px 28px; width: 100%; max-width: 540px;
          text-align: center; margin: 0 0 32px;
          min-height: 80px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 30px rgba(233,114,140,0.1), 0 2px 6px rgba(0,0,0,0.04);
          animation: fadeIn 1s ease 0.5s both; position: relative; overflow: hidden;
        }
        .message-box::before {
          content: '"'; position: absolute; top: -18px; left: 14px;
          font-family: 'Bodoni Moda', serif; font-size: 100px;
          color: var(--blush); line-height: 1; pointer-events: none;
        }
        .message-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(15px, 4.2vw, 20px);
          color: var(--text-mid); font-style: italic; font-weight: 300;
          line-height: 1.5; position: relative; z-index: 1;
          animation: msgFadeIn 0.6s ease both;
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── CTA heart ── */
        .cta-section { display: flex; flex-direction: column; align-items: center; gap: 16px; margin: 0 0 44px; animation: fadeSlideUp 1s ease 0.6s both; }
        .heart-btn {
          background: none; border: none; cursor: pointer;
          padding: 10px; outline: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transition: transform 0.15s ease; border-radius: 50%;
        }
        .heart-btn:active { transform: scale(0.9); }
        .heart-btn:hover .heart-shape { filter: drop-shadow(0 10px 28px rgba(201,64,112,0.45)); }
        .heart-shape {
          width: clamp(100px, 28vw, 158px); height: clamp(100px, 28vw, 158px);
          fill: url(#heartGrad);
          filter: drop-shadow(0 6px 18px rgba(201,64,112,0.28));
          transition: filter 0.3s ease;
          animation: heartbeat 1.8s ease-in-out infinite;
        }
        .heart-shape.clicked { animation: heartPop 0.4s ease forwards; }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.09); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.05); }
          70%     { transform: scale(1); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.28); }
          60%  { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        .heart-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: var(--text-mid); letter-spacing: 0.05em; }

        /* ── Cards — 3 col desktop ── */
        .cards-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 100%; margin-bottom: 52px; animation: fadeSlideUp 1s ease 0.75s both; }
        .card {
          background: rgba(255,255,255,0.74); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,192,210,0.45); border-radius: 16px;
          padding: 22px 16px; text-align: center;
          box-shadow: 0 4px 20px rgba(233,114,140,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(233,114,140,0.17); }
        .card-icon { font-size: 28px; margin-bottom: 10px; }
        .card-title { font-family: 'Bodoni Moda', serif; font-size: 16px; color: var(--text-dark); margin-bottom: 7px; font-weight: 500; }
        .card-desc { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: var(--text-mid); line-height: 1.5; font-weight: 300; }
        .card-body { flex: 1; }

        /* ── Timeline ── */
        .timeline-section { width: 100%; margin-bottom: 52px; animation: fadeSlideUp 1s ease 0.9s both; }
        .section-title { font-family: 'Bodoni Moda', serif; font-size: clamp(24px, 6vw, 36px); color: var(--text-dark); text-align: center; margin-bottom: 30px; font-weight: 500; }
        .section-title em { font-style: italic; color: var(--deep-rose); }
        .timeline { display: flex; flex-direction: column; position: relative; padding-left: 36px; }
        .timeline::before { content: ''; position: absolute; left: 8px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, var(--blush), var(--rose), var(--blush)); }
        .tl-item { padding: 0 0 26px; position: relative; }
        .tl-dot { position: absolute; left: -36px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; border: 2px solid var(--rose); display: flex; align-items: center; justify-content: center; font-size: 9px; color: var(--rose); flex-shrink: 0; }
        .tl-date { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose); margin-bottom: 3px; }
        .tl-title { font-family: 'Bodoni Moda', serif; font-size: 17px; color: var(--text-dark); margin-bottom: 4px; }
        .tl-desc { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: var(--text-mid); line-height: 1.55; font-weight: 300; }

        /* ── Love letter ── */
        .letter-section { width: 100%; margin-bottom: 60px; animation: fadeSlideUp 1s ease 1s both; }
        .letter-card {
          background: rgba(255,255,255,0.84); backdrop-filter: blur(18px);
          border: 1px solid rgba(255,192,210,0.5); border-radius: 22px;
          padding: 44px 44px;
          box-shadow: 0 10px 50px rgba(233,114,140,0.12), 0 2px 8px rgba(0,0,0,0.04);
          position: relative; overflow: hidden;
        }
        .letter-card::after { content: '♡'; position: absolute; bottom: -24px; right: -8px; font-size: 120px; color: var(--soft-pink); line-height: 1; pointer-events: none; }
        .letter-greeting { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 21px; color: var(--rose); margin-bottom: 16px; }
        .letter-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(16px, 3.8vw, 19px); color: var(--text-dark); line-height: 1.85; font-weight: 300; margin-bottom: 24px; }
        .letter-body p { margin-bottom: 14px; }
        .letter-sign { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 19px; color: var(--deep-rose); }

        /* ── Footer ── */
        .footer { text-align: center; padding: 16px 0 44px; animation: fadeIn 1s ease 1.1s both; }
        .footer-hearts { font-size: 20px; letter-spacing: 4px; margin-bottom: 8px; }
        .footer-text { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: var(--text-mid); opacity: 0.65; }

        /* ── Keyframes ── */
        @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideUp   { from { opacity: 0; transform: translateY(22px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn        { from { opacity: 0; } to { opacity: 1; } }

        /* ── Password Lock Screen ── */
        .password-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: linear-gradient(160deg, #fff0f4 0%, #ffe4ec 45%, #ffd6e7 100%);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.4s ease;
        }

        .password-container {
          background: rgba(255,255,255,0.88); backdrop-filter: blur(18px);
          border: 1px solid rgba(255,192,210,0.5); border-radius: 24px;
          padding: 52px 44px; max-width: 420px; width: 90%; text-align: center;
          box-shadow: 0 10px 50px rgba(233,114,140,0.15), 0 2px 8px rgba(0,0,0,0.04);
          animation: fadeSlideUp 0.6s ease;
        }

        .password-icon {
          font-size: 48px; margin-bottom: 18px; display: block;
        }

        .password-title {
          font-family: 'Bodoni Moda', serif; font-weight: 500;
          font-size: 28px; color: var(--text-dark); margin-bottom: 12px;
        }

        .password-subtitle {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 16px; color: var(--text-mid); margin-bottom: 30px; font-weight: 300;
        }

        .password-form { display: flex; flex-direction: column; gap: 16px; }

        .password-input {
          width: 100%; padding: 14px 16px; border: 1.5px solid var(--muted-rose);
          border-radius: 12px; font-size: 16px; font-family: 'Lato', sans-serif;
          background: rgba(249,192,203,0.08); color: var(--text-dark);
          transition: all 0.3s ease; outline: none;
        }

        .password-input:focus {
          border-color: var(--rose); background: rgba(249,192,203,0.15);
          box-shadow: 0 0 0 3px rgba(232,114,140,0.1);
        }

        .password-input::placeholder {
          color: var(--text-mid); opacity: 0.6;
        }

        .password-btn {
          padding: 14px 24px; background: linear-gradient(135deg, #e8728c 0%, #c94070 100%);
          color: white; border: none; border-radius: 12px; font-size: 16px;
          font-family: 'Bodoni Moda', serif; font-weight: 500; cursor: pointer;
          transition: all 0.3s ease; letter-spacing: 0.05em;
        }

        .password-btn:hover {
          transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,64,112,0.35);
        }

        .password-btn:active { transform: translateY(0); }

        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           MOBILE PASSWORD  ≤ 640px
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        @media (max-width: 640px) {
          .password-container {
            padding: 36px 24px;
            border-radius: 18px;
          }

          .password-icon {
            font-size: 40px; margin-bottom: 14px;
          }

          .password-title {
            font-size: 24px; margin-bottom: 8px;
          }

          .password-subtitle {
            font-size: 14px; margin-bottom: 24px;
          }

          .password-input {
            padding: 12px 14px; font-size: 16px;
          }

          .password-btn {
            padding: 12px 20px; font-size: 15px;
          }
        }

        
           MOBILE  ≤ 640px
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        @media (max-width: 640px) {
          .container     { padding: 0 14px; }

          .top-band      { padding-top: 20px; }
          .top-tag       { font-size: 9px; letter-spacing: 0.18em; padding: 5px 12px; }

          .hero          { padding: 24px 0 10px; }
          .hero-eyebrow  { font-size: 15px; margin-bottom: 8px; }
          .hero-sub      { font-size: 16px; margin-top: 10px; }
          .hero-sub br   { display: none; }

          .divider       { margin: 16px 0; }

          .message-box   { padding: 18px 18px; border-radius: 14px; margin-bottom: 20px; }
          .message-box::before { font-size: 70px; top: -12px; }

          .cta-section   { gap: 10px; margin-bottom: 36px; }
          .heart-label   { font-size: 13px; }

          /* Cards → horizontal pill on mobile */
          .cards-row     { grid-template-columns: 1fr; gap: 10px; margin-bottom: 36px; }
          .card          { display: flex; align-items: flex-start; padding: 16px 16px; gap: 14px; text-align: left; border-radius: 14px; }
          .card-icon     { font-size: 28px; flex-shrink: 0; margin-bottom: 0; margin-top: 2px; }
          .card-title    { font-size: 16px; margin-bottom: 3px; }
          .card-desc     { font-size: 14px; }

          /* Timeline tighter */
          .timeline-section  { margin-bottom: 36px; }
          .timeline          { padding-left: 28px; }
          .timeline::before  { left: 6px; }
          .tl-item           { padding-bottom: 20px; }
          .tl-dot            { left: -28px; width: 14px; height: 14px; font-size: 8px; }
          .tl-title          { font-size: 16px; }
          .tl-desc           { font-size: 14px; }

          /* Letter */
          .letter-section    { margin-bottom: 40px; }
          .letter-card       { padding: 26px 20px; border-radius: 16px; }
          .letter-card::after{ font-size: 90px; bottom: -18px; }
          .letter-greeting   { font-size: 18px; margin-bottom: 12px; }
          .letter-body       { font-size: 16px; line-height: 1.8; margin-bottom: 18px; }
          .letter-body p     { margin-bottom: 12px; }
          .letter-sign       { font-size: 17px; }

          .footer            { padding: 10px 0 32px; }
        }

        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           VERY SMALL  ≤ 380px
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        @media (max-width: 380px) {
          .hero-title        { font-size: 38px; }
          .letter-card       { padding: 20px 14px; }
          .message-box       { padding: 14px 12px; }
          .card              { padding: 13px 12px; gap: 10px; }
          .card-icon         { font-size: 24px; }
        }
      `}</style>

      {/* Password Protection Screen */}
      {!isUnlocked && (
        <div className="password-overlay">
          <div className="password-container">
            <span className="password-icon">🔐</span>
            <h2 className="password-title">Locked with Love</h2>
            <p className="password-subtitle">This page is protected. Enter the password to continue.</p>
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                className="password-input"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="password-btn">Unlock ♡</button>
            </form>
          </div>
        </div>
      )}

      <div className="page">
        {/* Floating hearts */}
        <div className="hearts-bg">
          {hearts.map((h) => (
            <div key={h.id} className="heart-float" style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, animationDuration: `${h.duration}s`, ["--op" as string]: h.opacity }}>
              <svg width={h.size} height={h.size} viewBox="0 0 32 29.6">
                <path d="M16 27.9C16 27.9 1 18.9 1 9.9C1 5.5 4.5 2 8.9 2C11.5 2 13.8 3.2 16 5.2C18.2 3.2 20.5 2 23.1 2C27.5 2 31 5.5 31 9.9C31 18.9 16 27.9 16 27.9Z" fill="#e8728c" />
              </svg>
            </div>
          ))}
        </div>

        {/* Rose petals */}
        <div className="petals-bg">
          {petals.map((p) => (
            <div key={p.id} className="petal" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, ["--rot" as string]: `${p.rotate}deg` }} />
          ))}
        </div>

        {/* Sparkles */}
        {sparkles.map((s) => (
          <div key={s.id} className="sparkle" style={{ left: s.x, top: s.y }}>✨</div>
        ))}

        <div className="container">
          {/* Badge */}
          <div className="top-band">
            <span className="top-tag">Valentine's Day · February 14</span>
          </div>

          {/* Hero */}
          <section className="hero">
            <p className="hero-eyebrow">a message just for you</p>
            <h1 className="hero-title">
              My <em>Love</em>,<br />
              My <em>Mika</em>
            </h1>
            <p className="hero-sub">
              Because you deserve more than a card —<br />
              you deserve the whole world.
            </p>
          </section>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-heart">♡</span>
            <div className="divider-line" />
          </div>

          {/* Rotating messages */}
          <div className="message-box">
            <p className="message-text" key={currentMsg}>{loveMessages[currentMsg]}</p>
          </div>

          {/* Heartbeat CTA */}
          <div className="cta-section">
            <button className="heart-btn" onClick={handleHeartClick} aria-label="Send love">
              <svg viewBox="0 0 32 29.6" className={`heart-shape ${clicked ? "clicked" : ""}`}>
                <defs>
                  <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#f472a0" />
                    <stop offset="60%"  stopColor="#e8728c" />
                    <stop offset="100%" stopColor="#c94070" />
                  </linearGradient>
                </defs>
                <path d="M16 27.9C16 27.9 1 18.9 1 9.9C1 5.5 4.5 2 8.9 2C11.5 2 13.8 3.2 16 5.2C18.2 3.2 20.5 2 23.1 2C27.5 2 31 5.5 31 9.9C31 18.9 16 27.9 16 27.9Z" />
              </svg>
            </button>
            <span className="heart-label">tap to send love ♡</span>
          </div>

          {/* Love letter */}
          <div className="letter-section">
            <h2 className="section-title">A Letter <em>From the Heart</em></h2>
            <div className="letter-card">
              <div className="letter-greeting">My dearest,</div>
              <div className="letter-body">
                <p>Hey baby it's valentines to maine socha thoda coding skills showoff kar lun, coder boyfriend hone ka fayda.</p>
                <p>Bubu meri, I am so proud of you, you are getting stronger and stronger everyday and taking care of yourself, good girl.</p>
                <p>Jaldi se sugar mommy banja fir main paise udaunga aur aap mehnat karna.</p>
                <p>Thank you for being mine. Thank you for letting me be yours. Happy Valentine's Day Baby girl.</p>
              </div>
              <div className="letter-sign">With all my love ♡</div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <div className="footer-hearts">♡ ♡ ♡</div>
            <p className="footer-text">Made with love · Valentine's Day 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}