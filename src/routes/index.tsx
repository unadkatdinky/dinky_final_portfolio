import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import portrait from "@/assets/my-photo.png";
import coffee from "@/assets/coffee-cup.png";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap",
      },
    ],
    meta: [
      { title: "Dinky — Full Stack Developer Portfolio" },
      {
        name: "description",
        content:
          "Scrapbook-style portfolio of Dinky, a full stack developer who ships clean, thoughtful products.",
      },
      { property: "og:title", content: "Dinky — Full Stack Developer" },
      {
        property: "og:description",
        content:
          "Full stack developer portfolio. Projects, skills, experience, and a bit of personality.",
      },
    ],
  }),
  component: Index,
});

/* -------------------- Font loader (guarantees Google Fonts load) -------------------- */
function FontLoader() {
  useEffect(() => {
    const id = "cormorant-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

/* -------------------- Sparkle / Star element -------------------- */
function Sparkle({ size = 24, className = "" }: { size?: number; className?: string }) {
  // Elegant 4-pointed star — thin curved needles like the reference images
  const h = size / 2;
  const ctrl = size * 0.055; // tighter control point = sharper, more dramatic points
  const d = `M${h},0 C${h},${h - ctrl} ${h + ctrl},${h} ${size},${h} C${h + ctrl},${h} ${h},${h + ctrl} ${h},${size} C${h},${h + ctrl} ${h - ctrl},${h} 0,${h} C${h - ctrl},${h} ${h},${h - ctrl} ${h},0Z`;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  );
}

/* ── SparkleHeading: wraps any Typewriter with floating star decorations ── */
function SparkleRow({ children, stars = true }: { children: React.ReactNode; stars?: boolean }) {
  return (
    <div className="relative inline-flex items-center gap-3 justify-center w-full">
      {stars && (
        <span className="sparkle" style={{ color: "var(--accent-blue)", opacity: 0.75 }}>
          <Sparkle size={40} />
        </span>
      )}
      <span>{children}</span>
      {stars && (
        <span className="sparkle-alt" style={{ color: "var(--accent-blue)", opacity: 0.5 }}>
          <Sparkle size={24} />
        </span>
      )}
    </div>
  );
}

/* -------------------- Typewriter heading -------------------- */
function Typewriter({
  text,
  className = "",
  delay = 0,
  speed = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  // once:false so the animation replays every time the element enters the viewport
  const inView = useInView(ref, { once: false, margin: "-10% 0px" });
  const [key, setKey] = useState(0);

  // Reset the animation key whenever the section scrolls back into view
  useEffect(() => {
    if (inView) setKey((k) => k + 1);
  }, [inView]);

  const letters = Array.from(text);

  return (
    <h2 ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={inView ? "caret" : ""}>
        {inView &&
          letters.map((c, i) => (
            <motion.span
              key={`${key}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + i * speed, duration: 0.01 }}
            >
              {c}
            </motion.span>
          ))}
      </span>
    </h2>
  );
}

/* -------------------- Rotating Typewriter -------------------- */
function RotatingTypewriter({ words, className = "" }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    // Pause at the end of the word before deleting
    if (subIndex === currentWord.length && !isDeleting) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(pauseTimer);
    }

    // Move to the next word after deleting finishes
    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    // Adjust typing (100ms) and deleting (40ms) speeds here
    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      isDeleting ? 40 : 100,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  return (
    <h2 className={className}>
      {words[index].substring(0, subIndex)}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block ml-[2px] -translate-y-[2px]"
      >
        |
      </motion.span>
    </h2>
  );
}

/* -------------------- Folder -------------------- */
function Folder({
  label,
  href,
  download,
  color = "var(--accent-blue)",
}: {
  label: string;
  href: string;
  download?: boolean;
  color?: string;
}) {
  return (
    <motion.a
      href={href}
      download={download}
      whileHover={{ y: -6, rotate: -2 }}
      whileTap={{ scale: 0.96 }}
      className="group flex flex-col items-center gap-2"
    >
      <div className="relative w-24 h-20">
        <div
          className="absolute top-0 left-2 w-12 h-3 rounded-t-md"
          style={{ background: color }}
        />
        <div
          className="absolute top-2 left-0 right-0 bottom-0 rounded-md shadow-[3px_3px_0_rgba(0,0,0,0.15)]"
          style={{ background: `color-mix(in oklab, ${color} 65%, white)` }}
        />
        <div
          className="absolute top-3 left-1 right-1 bottom-1 rounded-md border-2"
          style={{ background: `color-mix(in oklab, ${color} 35%, white)`, borderColor: color }}
        />
      </div>
      <span className="font-note text-base group-hover:text-[var(--accent-blue)]">{label}</span>
    </motion.a>
  );
}

/* -------------------- Project Card with parallax zoom -------------------- */
type Project = {
  n: number;
  src: string;
  t: string;
  d: string;
  long: string;
  stack: string[];
  color: string;
};

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // gentle parallax while scrolling
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <>
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <div className="relative overflow-hidden rounded-sm">
          <motion.img
            src={p.src}
            alt={`${p.t} project mockup`}
            width={768}
            height={1024}
            loading="lazy"
            style={{ y, scale }}
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute bottom-0 right-2 font-block text-[6rem] sm:text-[8rem] leading-none text-white/90 drop-shadow pointer-events-none">
            {p.n}
          </span>
        </div>
        <div className="pt-3">
          <h3 className="font-display text-xl italic">{p.t}</h3>
          <p className="font-note text-base opacity-70 leading-tight">{p.d}</p>
        </div>
      </motion.article>

      {/* Parallax expanded view */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotateX: -20 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="relative w-full max-w-5xl m-4 bg-paper text-ink rounded-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ background: p.color }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-black font-display text-lg hover:scale-110 transition"
                aria-label="Close"
              >
                ×
              </button>
              <div className="relative h-[55vh] overflow-hidden">
                <motion.img
                  src={p.src}
                  alt=""
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.25 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-6 left-6 right-6 text-white"
                >
                  <p className="font-note opacity-80">case study · 0{p.n}</p>
                  <h3 className="font-display text-5xl sm:text-7xl italic">{p.t}</h3>
                </motion.div>
              </div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-8 sm:p-12 bg-paper text-ink"
              >
                <p className="font-display text-2xl italic leading-relaxed mb-6">
                  {p.long}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="font-note px-3 py-1 bg-ink text-paper rounded-full text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------- Hero with parallax -------------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yPortrait = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scalePortrait = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
        <div className="hero-dreamy min-h-[90vh] px-6 sm:px-12 py-16 sm:py-24 relative">
          <div className="max-w-7xl mx-auto relative">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-5xl sm:text-7xl text-[var(--accent-blue)] text-center leading-tight"
            >
              <span className="sparkle-lg inline-block mr-3" style={{color:"var(--accent-blue)",opacity:0.75}}><Sparkle size={48}/></span>
              Hi, I'm <span className="font-hand not-italic">Dinky</span>
              <span className="sparkle inline-block ml-3" style={{color:"var(--accent-blue)",opacity:0.5}}><Sparkle size={28}/></span>
            </motion.h1>
          <RotatingTypewriter
  words={[
    "Full Stack",
    "UI/UX Enthusiast",
    "Part Time Artist",
    "Data Analyst"
  ]}
  className="block text-center mt-3 font-note text-lg sm:text-2xl text-ink-soft h-[32px]"
/>

            <div className="relative mt-10 grid grid-cols-12 gap-6 items-start">
              <motion.div style={{ y: yLeft }} className="col-span-12 md:col-span-4 relative md:-rotate-3 z-10">
                <div className="note-card">
                  <span className="tape-strip -top-2 left-4 -rotate-6" />
                  <span className="tape-strip -top-2 right-4 rotate-6" />
                  <p className="font-marker text-[var(--accent-blue)] text-lg leading-snug">
                    <strong>Hi! I'm Dinky</strong> — a full stack developer who builds web apps end-to-end, from database schema to the pixel-perfect button you just clicked.
                  </p>
                </div>
              </motion.div>

              <motion.div
                style={{ y: yPortrait, scale: scalePortrait }}
                className="col-span-12 md:col-span-4 flex justify-center relative"
              >
                {/* ── Live Photo polaroid frame ── */}
                <div className="relative group">
                  <motion.div
                    animate={{ rotate: [-1, 1, -1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                    style={{
                      background: "white",
                      padding: "10px 10px 36px 10px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Live Photo shimmer overlay */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-10 rounded-[2px]"
                      animate={{ opacity: [0, 0.12, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.9) 0%, transparent 70%)",
                      }}
                    />
                    {/* Photo container — replace portrait src with your real photo */}
                    <div className="relative overflow-hidden" style={{ width: 220, height: 280 }}>
                      <img
                        src={portrait}
                        alt="Portrait of Dinky"
                        className="w-full h-full object-cover object-top"
                        style={{ display: "block" }}
                      />
                      {/* Subtle vignette */}
                      <div
                        className="absolute inset-0"
                        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)" }}
                      />
                    </div>

                    {/* Live Photo badge */}
                    <motion.div
                      className="absolute top-4 left-4 flex items-center gap-1 z-20"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="4" fill="white"/>
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
                        <circle cx="12" cy="12" r="12" stroke="white" strokeWidth="1" fill="none" opacity="0.25"/>
                      </svg>
                      <span style={{ color: "white", fontSize: 9, fontFamily: "Arial, sans-serif", fontWeight: 600, letterSpacing: "0.05em", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>LIVE</span>
                    </motion.div>

                    {/* Polaroid caption */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: 36 }}>
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "#555", letterSpacing: "0.04em" }}>Dinky ✦</span>
                    </div>
                  </motion.div>

                  {/* Tape strip on top */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded-sm rotate-1"
                    style={{ background: "rgba(180,210,255,0.55)", border: "1px solid rgba(100,160,255,0.3)" }}
                  />
                </div>
              </motion.div>

              <motion.div style={{ y: yRight }} className="col-span-12 md:col-span-4 relative md:rotate-2 z-10">
                <div className="note-card">
                  <span className="tape-strip -top-2 left-6 -rotate-3" />
                  <p className="font-marker text-[var(--accent-blue)] text-lg leading-snug">
                    I love TypeScript, React, Node, and a well-typed API. The best software feels invisible — it just works.
                  </p>
                </div>
                <span className="absolute -bottom-6 -left-4 font-hand text-3xl text-[var(--accent-blue)] -rotate-12">{`</>`}</span>
              </motion.div>

              <div className="col-span-12 md:col-span-5 relative md:-rotate-2">
                <div className="note-card">
                  <span className="tape-strip -top-2 left-4 -rotate-6" />
                  <ul className="font-marker text-[var(--accent-blue)] text-lg space-y-1 list-disc pl-5">
                    <li>I ship full-stack apps end to end.</li>
                    <li>Currently obsessed with edge functions.</li>
                    <li>Dark mode by default. Always.</li>
                    <li>I write tests. Sometimes even before the code.</li>
                    <li>Big introvert, bigger nerd.</li>
                  </ul>
                </div>
              </div>

              <div className="col-span-12 md:col-span-2 flex justify-center">
                <motion.img
                  src={coffee}
                  alt=""
                  animate={{ rotate: [12, 18, 12] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24"
                />
              </div>

              <div className="col-span-12 md:col-span-5">
                <p className="font-marker text-[var(--accent-blue)] text-lg leading-snug text-center">
                  When I'm not pushing commits you'll find me with a sketchbook of architecture diagrams, debugging at cafes, and pretending I'll finally finish that side project this weekend.
                </p>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}

/* -------------------- Page -------------------- */
function Index() {
  const projects: Project[] = [
    { n: 1, src: p1, t: "SHOPLY", d: "Headless commerce storefront.", long: "A headless commerce storefront with Stripe + Next.js, optimized for sub-100ms TTFB across the globe via edge rendering.", stack: ["Next.js", "Stripe", "Postgres", "Edge"], color: "oklch(0.92 0.08 25)" },
    { n: 2, src: p2, t: "PULSE", d: "SaaS analytics dashboard.", long: "A SaaS analytics dashboard for indie founders — track activations, retention and revenue without an analytics team.", stack: ["React", "tRPC", "ClickHouse"], color: "oklch(0.9 0.1 145)" },
    { n: 3, src: p3, t: "DEVKIT", d: "Mobile-first snippet manager.", long: "Mobile-first code snippet manager with fuzzy search, syntax highlighting and offline sync via service workers.", stack: ["PWA", "IndexedDB", "Tailwind"], color: "oklch(0.9 0.1 230)" },
    { n: 4, src: p4, t: "WANDR", d: "Travel booking redesign.", long: "A complete redesign of a legacy travel booking flow — cut booking time from 9 minutes to 90 seconds.", stack: ["Figma", "Next.js", "GraphQL"], color: "oklch(0.92 0.1 60)" },
    { n: 5, src: p5, t: "STREAK", d: "Calm habit tracker.", long: "Habit tracker with calm, minimalist UI focused on the chain-don't-break method. Local-first, syncs over CRDTs.", stack: ["SwiftUI", "Y.js", "Supabase"], color: "oklch(0.88 0.08 320)" },
  ];

  return (
    <main className="min-h-screen bg-paper text-ink overflow-x-clip">
      <FontLoader />
      {/* Font + whimsy overrides */}
      <style>{`
        .font-display, .font-display * { font-family: 'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif !important; letter-spacing: 0.02em; }
        .font-note, .font-marker, p, li, a { font-family: 'DM Sans', 'Inter', Arial, sans-serif !important; }
        .font-hand { font-family: 'DM Sans', Arial, sans-serif !important; font-weight: 600 !important; }
        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-7px) rotate(6deg); }
        }
        @keyframes sparkle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.75; }
          50% { transform: scale(1.25) rotate(18deg); opacity: 1; }
        }
        .sparkle { display: inline-block; animation: sparkle-float 3.5s ease-in-out infinite; }
        .sparkle-alt { display: inline-block; animation: sparkle-float 4.5s ease-in-out infinite reverse; }
        .sparkle-lg { display: inline-block; animation: sparkle-pulse 5s ease-in-out infinite; }
        .hero-dreamy {
          background:
            radial-gradient(ellipse at 15% 40%, rgba(186,210,255,0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 82% 18%, rgba(220,190,255,0.42) 0%, transparent 50%),
            radial-gradient(ellipse at 58% 82%, rgba(185,230,210,0.32) 0%, transparent 48%),
            #f8f6f2;
        }
        .section-dreamy {
          background:
            radial-gradient(ellipse at 25% 55%, rgba(220,190,255,0.1) 0%, transparent 60%),
            radial-gradient(ellipse at 78% 15%, rgba(186,210,255,0.1) 0%, transparent 50%);
        }
        .heading-rule { display:block; width:100%; height:1px; background:currentColor; opacity:0.18; margin-top:8px; }
      `}</style>
      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#top" className="font-hand text-2xl font-bold text-[var(--accent-blue)]">dinky.dev</a>
          <div className="hidden md:flex gap-6 font-note text-lg text-ink-soft">
            <a href="#about" className="hover:text-[var(--accent-blue)]">about</a>
            <a href="#projects" className="hover:text-[var(--accent-blue)]">projects</a>
            <a href="#skills" className="hover:text-[var(--accent-blue)]">skills</a>
            <a href="#experience" className="hover:text-[var(--accent-blue)]">experience</a>
            <a href="#contact" className="hover:text-[var(--accent-blue)]">contact</a>
          </div>
        </div>
      </nav>

      {/* HERO (light) */}
      <Hero />

      {/* ABOUT (light) */}
      <section id="about" className="px-6 sm:px-12 py-20 bg-grid section-dreamy">
        <div className="max-w-7xl mx-auto">
          <SparkleRow>
            <Typewriter
              text="about me."
              className="font-display italic text-5xl sm:text-6xl text-center"
            />
          </SparkleRow>
          <span className="heading-rule max-w-xs mx-auto block mb-3" />
          <p className="text-center font-note text-xl text-ink-soft max-w-2xl mx-auto mb-12">
            Click a folder to open. Yes, the resume one actually downloads.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-wrap gap-8 justify-center mb-12"
          >
            <Folder label="resume.pdf" href="/dinky-resume.pdf" download color="var(--accent-blue)" />
            <Folder label="projects" href="#projects" color="var(--accent-orange)" />
            <Folder label="experience" href="#experience" color="var(--accent-green)" />
            <Folder label="education" href="#education" color="var(--accent-pink)" />
            <Folder label="contact" href="#contact" color="var(--accent-yellow)" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto note-card"
          >
            <span className="tape-strip -top-2 left-1/2 -translate-x-1/2 -rotate-3" />
            <p className="font-display italic text-xl text-ink leading-relaxed text-center">
              I'm a full stack developer with a soft spot for <span className="highlight-yellow">clean APIs</span>,
              <span className="highlight-yellow"> snappy UIs</span>, and side projects that probably won't ever launch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS (DARK) */}
      <section id="projects" className="section-dark px-6 sm:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-16 text-center">
            <SparkleRow>
              <Typewriter
                text="selected work."
                className="font-display italic text-5xl sm:text-7xl"
              />
            </SparkleRow>
            <span className="heading-rule max-w-sm mx-auto block" />
            <p className="font-note text-lg opacity-60 mt-3">click any card to dive in →</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.n} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS (light) */}
      <section id="skills" className="px-6 sm:px-12 py-24 section-dreamy">
        <div className="max-w-7xl mx-auto">
          <SparkleRow>
            <Typewriter
              text="skills & tools."
              className="font-display italic text-4xl sm:text-5xl text-center"
            />
          </SparkleRow>
          <span className="heading-rule max-w-xs mx-auto block mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {["TypeScript","React","Next.js","Node.js","Postgres","Tailwind","Python","Docker","AWS","Supabase","tRPC","Prisma"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="note-card text-center"
              >
                <span className="tape-strip -top-2 left-1/2 -translate-x-1/2 -rotate-3" />
                <p className="font-note text-lg">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE (DARK) */}
      <section id="experience" className="section-dark px-6 sm:px-12 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <SparkleRow stars={false}>
              <Typewriter text="experience." className="font-display italic text-4xl sm:text-5xl" />
            </SparkleRow>
            <span className="heading-rule block mb-8" />
            <div className="space-y-6">
              {[
                { r: "Senior Full Stack Developer", c: "Acme Labs", y: "2023 — present" },
                { r: "Full Stack Engineer", c: "Northwind Co.", y: "2021 — 2023" },
                { r: "Frontend Developer", c: "Pixel Studio", y: "2019 — 2021" },
                { r: "Freelance Developer", c: "Self-employed", y: "2018 — 2019" },
              ].map((e, i) => (
                <motion.div
                  key={e.r}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-2 border-[var(--accent-yellow)] pl-4"
                >
                  <p className="font-display italic text-xl">{e.r}</p>
                  <p className="font-note text-base opacity-80">{e.c}</p>
                  <p className="font-note text-sm opacity-60">{e.y}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div id="education">
            <SparkleRow stars={false}>
              <Typewriter text="education." className="font-display italic text-4xl sm:text-5xl" />
            </SparkleRow>
            <span className="heading-rule block mb-8" />
            <div className="space-y-6">
              {[
                { r: "B.Tech, Computer Science", c: "Tech University", y: "2015 — 2019" },
                { r: "Full Stack Bootcamp", c: "CodeAcademy Pro", y: "2019" },
                { r: "AWS Certified Developer", c: "Amazon Web Services", y: "2022" },
              ].map((e, i) => (
                <motion.div
                  key={e.r}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-2 border-[var(--accent-orange)] pl-4"
                >
                  <p className="font-display italic text-xl">{e.r}</p>
                  <p className="font-note text-base opacity-80">{e.c}</p>
                  <p className="font-note text-sm opacity-60">{e.y}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="font-display italic text-2xl mt-10 mb-4">fun facts</h3>
            <ul className="font-marker text-[var(--accent-yellow)] text-lg space-y-1 list-disc pl-5">
              <li>500+ GitHub contributions last year.</li>
              <li>Once shipped a bug fix from a moving train.</li>
              <li>Daily Wordle streak: 200+.</li>
              <li>Will fight you over tabs vs spaces. (Spaces.)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT (light) */}
      <section id="contact" className="px-6 sm:px-12 py-24 section-dreamy">
        <div className="max-w-4xl mx-auto text-center">
          <SparkleRow>
            <Typewriter
              text="let's build something."
              className="font-display italic text-4xl sm:text-6xl text-[var(--accent-blue)]"
            />
          </SparkleRow>
          <span className="heading-rule max-w-md mx-auto block mb-4" />
          <p className="font-note text-xl text-ink-soft mb-8">
            Got a project, an idea, or just want to nerd out about stack choices? My inbox is open.
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="sparkle" style={{color:"var(--accent-blue)",opacity:0.55}}><Sparkle size={28}/></span>
            <span className="sparkle-lg" style={{color:"var(--accent-blue)",opacity:0.75}}><Sparkle size={52}/></span>
            <span className="sparkle-alt" style={{color:"var(--accent-blue)",opacity:0.4}}><Sparkle size={20}/></span>
          </div>
          <motion.a
            href="mailto:hello@dinky.dev"
            whileHover={{ rotate: 0, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block font-hand text-3xl text-paper bg-[var(--accent-blue)] px-8 py-3 rounded-full -rotate-2 shadow-[6px_6px_0_oklch(0.85_0.18_95)]"
          >
            hello@dinky.dev →
          </motion.a>
          <div className="mt-10 flex justify-center gap-6 font-note text-lg text-ink-soft">
            <a href="#" className="hover:text-[var(--accent-blue)]">GitHub</a>
            <a href="#" className="hover:text-[var(--accent-blue)]">LinkedIn</a>
            <a href="#" className="hover:text-[var(--accent-blue)]">Twitter</a>
            <a href="/dinky-resume.pdf" download className="hover:text-[var(--accent-blue)]">Resume</a>
          </div>
        </div>
      </section>

      <footer className="section-dark py-10 text-center font-note">
        © {new Date().getFullYear()} dinky.dev — made with coffee, commits & care.
      </footer>
    </main>
  );
}