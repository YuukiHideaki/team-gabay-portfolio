import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Code2,
  Database,
  ExternalLink,
  GitBranch,
  Globe,
  Layout,
  Mail,
  Menu,
  Palette,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";

// Reused glass card style for navbar, cards, and form panels.
const glassStyle = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.13)",
};

// Data is kept here so the JSX below is shorter and easier to edit.
const navLinks = ["Home", "About", "Projects", "Contact"];
const typeWords = ["Programmers & Designers", "Web Developers", "IT Students", "Team Gabay"];

const members = [
  {
    initials: "JC",
    name: "John Rolly A. Calipusan",
    role: "Lead Programmer & Designer",
    color: "#a78bfa",
    bio: "Enjoys turning layouts into working pages and making sure the design still looks good once it becomes code. Handles most of the programming and visual direction for Team Gabay.",
  },
  {
    initials: "JA",
    name: "James Enrico Anore",
    role: "Team Leader",
    color: "#818cf8",
    bio: "Helps organize the team's tasks, checks the flow of each page, and keeps the group focused on finishing work that is clear, useful, and ready for class submission.",
  },
];

const skillGroups = [
  {
    title: "Frontend",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.2)",
    skills: [
      { label: "HTML5", icon: Code2 },
      { label: "CSS3", icon: Palette },
      { label: "JavaScript", icon: Globe },
    ],
  },
  {
    title: "Programming",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.2)",
    skills: [
      { label: "C++", icon: Code2 },
      { label: "C", icon: Code2 },
      { label: "Python", icon: Globe },
    ],
  },
  {
    title: "Data & Design",
    color: "#34d399",
    glow: "rgba(52,211,153,0.2)",
    skills: [
      { label: "Basic SQL", icon: Database },
      { label: "Figma", icon: Layout },
    ],
  },
];

const projects = [
  {
    title: "Asukal Check",
    description:
      "A Figma prototype for checking sugar-related product information with clear navigation and simple screens.",
    tags: ["Figma", "UI Prototype", "Design"],
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    link: "https://five-ruler-95982750.figma.site/",
    status: "View Prototype",
    preview: "sugar",
  },
  {
    title: "Campus Task Board",
    description: "Placeholder project: a responsive task tracker mockup for students managing school activities.",
    tags: ["HTML", "CSS", "Bootstrap"],
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    link: "",
    status: "Coming Soon",
    preview: "tasks",
  },
  {
    title: "Simple Recipe Finder",
    description: "Placeholder project: a JavaScript practice app for browsing recipe cards and filtering by category.",
    tags: ["JavaScript", "HTML", "CSS"],
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    link: "",
    status: "Coming Soon",
    preview: "recipe",
  },
];

const emptyErrors = {
  name: "",
  email: "",
  message: "",
};

// This helper keeps the reveal animation code from being repeated everywhere.
function getRevealAnimation(reducedMotion: boolean | null, visible = true) {
  return {
    initial: reducedMotion ? false : { opacity: 0, y: 45 },
    animate: visible || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 45 },
    transition: { duration: reducedMotion ? 0 : 0.6 },
  };
}

// Reveals a section once it becomes visible while scrolling.
function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;

    if (!current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// Smooth scroll for navbar and hero buttons.
function scrollToSection(id: string) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

function Logo() {
  return (
    <svg width="62" height="46" viewBox="0 0 62 46" aria-label="Team Gabay logo">
      <defs>
        <linearGradient id="tg-gradient" x1="0" x2="62" y1="0" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="52%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <filter id="tg-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        x="0"
        y="34"
        fill="url(#tg-gradient)"
        filter="url(#tg-glow)"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="40"
        fontWeight="900"
        letterSpacing="-3"
      >
        TG
      </text>
      <rect x="0" y="40" width="54" height="4" rx="2" fill="url(#tg-gradient)" />
      <circle cx="56" cy="42" r="2" fill="#a78bfa" />
      <circle cx="61" cy="42" r="2" fill="#38bdf8" />
    </svg>
  );
}

function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(135deg,#080614_0%,#120d2e_48%,#0b1530_100%)]">
      {/* Keyframes live here so this project can stay mostly inside App.tsx. */}
      <style>{`
        @keyframes orb-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(70px, 40px, 0) scale(1.15); }
        }
        @keyframes orb-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-80px, -35px, 0) scale(1.12); }
        }
        @keyframes orb-c {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(45px, -65px, 0) scale(1.2); }
        }
        @keyframes orb-d {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-55px, 55px, 0) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-orb {
            animation: none !important;
          }
        }
      `}</style>

      {/* Blurred color orbs create the soft glassmorphism background. */}
      <div
        className="motion-orb absolute -left-[8%] -top-[8%] h-[650px] w-[650px] rounded-full blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(109,40,217,0.38), transparent 65%)",
          animation: "orb-a 20s ease-in-out infinite",
        }}
      />
      <div
        className="motion-orb absolute -bottom-[12%] -right-[8%] h-[750px] w-[750px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(29,78,216,0.32), transparent 65%)",
          animation: "orb-b 25s ease-in-out infinite",
        }}
      />
      <div
        className="motion-orb absolute left-[38%] top-[35%] h-[480px] w-[480px] rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
          animation: "orb-c 17s ease-in-out infinite",
        }}
      />
      <div
        className="motion-orb absolute right-[8%] top-[8%] h-[420px] w-[420px] rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)",
          animation: "orb-d 22s ease-in-out infinite",
        }}
      />
      <div
        className="motion-orb absolute bottom-[20%] left-[15%] h-[350px] w-[350px] rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.15), transparent 72%)",
          animation: "orb-a 28s ease-in-out infinite reverse",
        }}
      />

      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,6,20,0.35)_55%,rgba(8,6,20,0.8)_100%)]" />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full transition-all duration-300"
      style={scrolled ? { ...glassStyle, borderLeft: 0, borderRight: 0, borderTop: 0 } : {}}
    >
      <nav className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-6 sm:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="flex items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
          aria-label="Go to home"
        >
          <Logo />
        </button>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => scrollToSection(link.toLowerCase())}
              className="group relative rounded-lg font-body text-[17px] font-medium text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
            >
              {link}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-[#a78bfa] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa] md:hidden"
          style={glassStyle}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-5 mb-4 rounded-2xl p-4 md:hidden"
            style={glassStyle}
          >
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => {
                  scrollToSection(link.toLowerCase());
                  setOpen(false);
                }}
                className="block w-full rounded-xl px-4 py-3 text-left font-body text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const reducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Typewriter effect for the small subtitle below the main heading.
  useEffect(() => {
    if (reducedMotion) {
      setText(typeWords[0]);
      return;
    }

    const fullWord = typeWords[wordIndex];
    let delay = deleting ? 45 : 80;

    if (!deleting && text === fullWord) {
      delay = 1800;
    }

    const timeout = window.setTimeout(() => {
      if (!deleting && text === fullWord) {
        setDeleting(true);
        return;
      }

      if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % typeWords.length);
        return;
      }

      setText(deleting ? fullWord.slice(0, text.length - 1) : fullWord.slice(0, text.length + 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, reducedMotion, text, wordIndex]);

  const heroMotion = getRevealAnimation(reducedMotion);

  return (
    <section id="home" className="flex min-h-screen items-center justify-center px-6 pb-20 pt-28 text-center">
      <div className="-mt-10">
        <div className="mx-auto max-w-4xl">
          <motion.p
            {...heroMotion}
            transition={{ delay: reducedMotion ? 0 : 0 }}
            className="mb-9 font-heading text-sm font-bold uppercase tracking-[0.25em] text-[#a78bfa] sm:text-base"
          >
            IT0043/L - Web Design & Client-Side Scripting
          </motion.p>

          <motion.h1
            {...heroMotion}
            transition={{ delay: reducedMotion ? 0 : 0.1 }}
            className="font-heading font-black leading-none tracking-[-0.05em]"
            style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
          >
            <span className="text-white">Team </span>
            <span className="text-[#a78bfa]">Gabay</span>
          </motion.h1>

          <motion.div
            {...heroMotion}
            transition={{ delay: reducedMotion ? 0 : 0.35 }}
            className="mt-8 flex min-h-10 items-center justify-center text-2xl font-medium text-white/50 sm:text-3xl"
          >
            <span>{text}</span>
            {!reducedMotion && <span className="ml-1 h-6 w-0.5 animate-pulse bg-violet-400" />}
          </motion.div>

          <motion.p
            {...heroMotion}
            transition={{ delay: reducedMotion ? 0 : 0.5 }}
            className="mx-auto mt-9 max-w-3xl text-lg leading-8 text-white/55 sm:text-xl"
          >
            We design and build web experiences that are fast, accessible, and intentional - combining strong
            visual craft with clean, maintainable code.
          </motion.p>

          <motion.div
            {...heroMotion}
            transition={{ delay: reducedMotion ? 0 : 0.65 }}
            className="mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <motion.button
              whileHover={reducedMotion ? undefined : { scale: 1.05 }}
              type="button"
              onClick={() => scrollToSection("projects")}
              className="w-full rounded-3xl bg-gradient-to-r from-[#7c6af7] to-[#3b82f6] px-10 py-4 font-heading text-lg font-bold text-white shadow-[0_18px_50px_rgba(124,106,247,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa] sm:w-auto"
            >
              View Projects
            </motion.button>

            <motion.button
              whileHover={reducedMotion ? undefined : { scale: 1.05 }}
              type="button"
              onClick={() => scrollToSection("about")}
              className="w-full rounded-3xl border border-white/15 px-10 py-4 font-heading text-lg font-bold text-white/80 transition-colors hover:border-violet-300/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa] sm:w-auto"
            >
              Meet the Team
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="mb-16 text-center">
      {label && (
        <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#a78bfa]">
          {label}
        </p>
      )}
      <h2 className="font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
        {children}
      </h2>
    </div>
  );
}

function ProjectPreview({ type, gradient, title }: { type: string; gradient: string; title: string }) {
  return (
    <div className="relative h-48 overflow-hidden" style={{ background: gradient }}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute left-6 right-6 top-6 rounded-xl border border-white/35 bg-white/20 p-3 shadow-2xl backdrop-blur-md">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
        </div>

        {/* These are simple fake screenshots so the project cards do not look empty. */}
        {type === "sugar" && (
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded-full bg-white/80" />
              <div className="h-3 w-36 rounded-full bg-white/45" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-12 rounded-lg bg-white/25" />
                <div className="h-12 rounded-lg bg-white/25" />
              </div>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-white/55 bg-white/20 font-heading text-xl font-black text-white">
              72
            </div>
          </div>
        )}

        {type === "tasks" && (
          <div className="grid grid-cols-3 gap-2">
            {["To Do", "Doing", "Done"].map((label, index) => (
              <div key={label} className="rounded-lg bg-white/20 p-2">
                <div className="mb-2 h-2 w-10 rounded-full bg-white/70" />
                <div className="space-y-2">
                  <div className="h-8 rounded-md bg-white/35" />
                  <div className={`h-8 rounded-md ${index === 1 ? "bg-white/50" : "bg-white/25"}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "recipe" && (
          <div className="grid grid-cols-[90px_1fr] gap-3">
            <div className="h-24 rounded-xl bg-white/35" />
            <div className="space-y-3">
              <div className="h-3 w-28 rounded-full bg-white/80" />
              <div className="h-3 w-40 rounded-full bg-white/45" />
              <div className="flex gap-2 pt-2">
                <div className="h-7 w-14 rounded-full bg-white/30" />
                <div className="h-7 w-16 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-5 left-6 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white/80">
        {title}
      </div>
    </div>
  );
}

function About() {
  const { ref, visible } = useScrollReveal();
  const reducedMotion = useReducedMotion();
  const sectionMotion = getRevealAnimation(reducedMotion, visible);

  return (
    <section id="about" className="px-6 py-24 sm:px-10 lg:px-16">
      <motion.div ref={ref} {...sectionMotion} className="mx-auto max-w-[1440px]">
        <SectionTitle label="Who We Are">Meet the Team</SectionTitle>

        <div className="grid gap-8 md:grid-cols-2">
          {members.map((member) => (
            <motion.div
              key={member.name}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              className="rounded-2xl p-8 sm:p-9"
              style={glassStyle}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-400/25 font-heading text-2xl font-bold text-white ring-1 ring-violet-300/25">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">{member.name}</h3>
                  <p className="mt-1 text-lg font-medium" style={{ color: member.color }}>
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="mt-7 text-lg leading-8 text-white/55">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <SkillsCard />
          <PhilosophyAndCourse />
        </div>
      </motion.div>
    </section>
  );
}

function SkillsCard() {
  return (
    <div className="rounded-2xl p-8 sm:p-10" style={glassStyle}>
      <h3 className="mb-10 font-heading text-2xl font-bold text-white">Our Skills</h3>
      <div className="space-y-9">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <div className="mb-5 flex items-center gap-4">
              <span
                className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, transparent, ${group.color})` }}
              />
              <span className="font-heading text-sm font-bold uppercase tracking-[0.2em]" style={{ color: group.color }}>
                {group.title}
              </span>
              <span
                className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, ${group.color}, transparent)` }}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill) => {
                const Icon = skill.icon;

                return (
                  <motion.span
                    key={skill.label}
                    whileHover={{ scale: 1.07 }}
                    className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 font-heading font-semibold text-white/80"
                    style={{ background: group.glow, borderColor: `${group.color}55` }}
                  >
                    <Icon size={17} style={{ color: group.color }} />
                    {skill.label}
                  </motion.span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhilosophyAndCourse() {
  return (
    <div className="grid gap-8">
      <div className="rounded-2xl p-8 sm:p-10" style={glassStyle}>
        <h3 className="mb-6 font-heading text-2xl font-bold text-white">Our Philosophy</h3>
        <p className="text-lg leading-8 text-white/55">
          We believe that good design is more than aesthetics - it is about creating experiences that feel natural
          and work for everyone. Even as beginners, we approach every project with care and curiosity.
        </p>
        <p className="mt-6 text-lg leading-8 text-white/55">
          We are still learning and improving, so we keep our designs simple, readable, and responsive before
          adding extra effects.
        </p>
      </div>

      <div className="rounded-2xl p-8 sm:p-10" style={glassStyle}>
        <h3 className="mb-6 font-heading text-2xl font-bold text-white">Course Info</h3>
        <div className="space-y-2 text-lg font-medium text-white/55">
          <p>Subject: Web Design with Client-Side Scripting (IT0043/L)</p>
          <p>Instructor: John Benedic R. Enriquez</p>
          <p>Year &amp; Term: 1st Year - 3rd Term</p>
          <p>Semester: 2025-2026</p>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const { ref, visible } = useScrollReveal();
  const reducedMotion = useReducedMotion();
  const sectionMotion = getRevealAnimation(reducedMotion, visible);

  return (
    <section id="projects" className="px-6 py-24 sm:px-10 lg:px-16">
      <motion.div ref={ref} {...sectionMotion} className="mx-auto max-w-[1440px]">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            Our <span className="gradient-title">Projects</span>
          </h2>
          <p className="mt-7 text-lg font-medium text-white/55">A collection of our work from this semester</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={reducedMotion ? false : { opacity: 0, y: 35 }}
              animate={visible || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{ delay: reducedMotion ? 0 : 0.15 * index, duration: reducedMotion ? 0 : 0.5 }}
              whileHover={reducedMotion ? undefined : { y: -8, boxShadow: "0 20px 60px rgba(124,106,247,0.25)" }}
              className="overflow-hidden rounded-2xl"
              style={glassStyle}
            >
              <ProjectPreview type={project.preview} gradient={project.gradient} title={project.title} />

              <div className="p-7">
                <h3 className="font-heading text-2xl font-bold text-white">{project.title}</h3>
                <p className="mt-5 min-h-32 text-lg leading-8 text-white/55">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-violet-300/25 bg-violet-400/15 px-4 py-1.5 font-heading text-sm font-medium text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link ? (
                  <motion.a
                    whileHover={reducedMotion ? undefined : { x: 4 }}
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg font-heading text-lg font-medium text-[#a78bfa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
                  >
                    {project.status} <ExternalLink size={17} />
                  </motion.a>
                ) : (
                  <span className="mt-8 inline-flex items-center gap-2 rounded-lg font-heading text-lg font-medium text-white/45">
                    {project.status}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Contact() {
  const { ref, visible } = useScrollReveal();
  const reducedMotion = useReducedMotion();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

  const sectionMotion = getRevealAnimation(reducedMotion, visible);

  function validateForm() {
    return {
      name: name.trim() ? "" : "Please enter your name.",
      email: email.trim()
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? ""
          : "Please enter a valid email address."
        : "Please enter your email.",
      message: message.trim() ? "" : "Please write a short message.",
    };
  }

  function focusFirstError(nextErrors: typeof emptyErrors) {
    if (nextErrors.name) {
      nameRef.current?.focus();
    } else if (nextErrors.email) {
      emailRef.current?.focus();
    } else if (nextErrors.message) {
      messageRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email || nextErrors.message) {
      focusFirstError(nextErrors);
      toast.error("Please check the highlighted fields.");
      return;
    }

    // Fake delay so the user can see the sending state.
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      setMessage("");
      setErrors(emptyErrors);
      toast.success("Message sent! We'll get back to you soon.");
    }, 1200);
  }

  return (
    <section id="contact" className="px-6 py-24 sm:px-10 lg:px-16">
      <motion.div ref={ref} {...sectionMotion} className="mx-auto max-w-[1280px]">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            Get In <span className="gradient-title">Touch</span>
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <ContactInfo reducedMotion={reducedMotion} />

          <form onSubmit={handleSubmit} noValidate className="rounded-2xl p-8 sm:p-10" style={glassStyle}>
            <TextField
              id="contact-name"
              label="Name"
              value={name}
              setValue={setName}
              placeholder="Your name"
              error={errors.name}
              inputRef={nameRef}
              autoComplete="name"
            />

            <TextField
              id="contact-email"
              label="Email"
              value={email}
              setValue={setEmail}
              placeholder="your.email@example.com"
              error={errors.email}
              inputRef={emailRef}
              type="email"
              autoComplete="email"
            />

            <div className="mb-6">
              <label htmlFor="contact-message" className="mb-2 block font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/70">
                Message
              </label>
              <textarea
                ref={messageRef}
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write a short message"
                rows={5}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : "message-help"}
                className="w-full resize-none rounded-2xl border border-white/[0.12] bg-white/[0.06] px-6 py-5 text-lg font-medium text-white outline-none transition placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/50"
              />
              {errors.message ? (
                <p id="message-error" className="mt-2 text-sm font-medium text-red-300" role="alert">
                  {errors.message}
                </p>
              ) : (
                <p id="message-help" className="mt-2 text-sm text-white/45">
                  This demo form shows validation and success feedback for the final project.
                </p>
              )}
            </div>

            <motion.button
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              type="submit"
              disabled={sending}
              className="w-full rounded-2xl bg-gradient-to-r from-[#7c6af7] to-[#3b82f6] px-8 py-5 font-heading text-lg font-bold text-white shadow-[0_18px_50px_rgba(124,106,247,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

function ContactInfo({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <div className="rounded-2xl p-8 sm:p-10" style={glassStyle}>
      <h3 className="font-heading text-2xl font-bold text-white">Contact Info</h3>
      <p className="mt-6 max-w-md text-lg leading-8 text-white/55">
        Feel free to reach out to us through the form or any of the channels below.
      </p>

      <a href="mailto:jacalipusan@fit.edu.ph" className="mt-10 flex items-center gap-4 text-lg font-bold text-white/70">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-400/20 text-[#a78bfa]">
          <Mail size={22} />
        </span>
        jacalipusan@fit.edu.ph
      </a>

      <div className="mt-14 flex flex-wrap gap-4">
        <motion.a
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          href="https://github.com/YuukiHideaki"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center gap-3 rounded-full border border-violet-300/25 bg-violet-400/15 px-5 font-heading font-bold text-[#a78bfa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
        >
          <GitBranch size={21} />
          GitHub
        </motion.a>

        <motion.a
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          href="mailto:jacalipusan@fit.edu.ph"
          className="inline-flex min-h-12 items-center gap-3 rounded-full border border-violet-300/25 bg-violet-400/15 px-5 font-heading font-bold text-[#a78bfa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
        >
          <Mail size={21} />
          Email Us
        </motion.a>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  setValue,
  placeholder,
  error,
  inputRef,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  error: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-2 block font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/70">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-2xl border border-white/[0.12] bg-white/[0.06] px-6 py-5 text-lg font-medium text-white outline-none transition placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/50"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] px-6 py-10 text-center">
      <p className="font-heading text-lg font-bold text-white/35">
        &copy; 2026 Team Gabay - John Rolly A. Calipusan &amp; James Enrico Anore. IT0043/L Final Project.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Background />
      <div className="relative z-[1] min-h-screen overflow-hidden">
        <Toaster richColors position="top-right" theme="dark" />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
