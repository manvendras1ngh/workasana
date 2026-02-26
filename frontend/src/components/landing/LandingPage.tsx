import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Mail,
  Menu,
  Sparkles,
  Tags,
  Users,
  X,
} from "lucide-react";
import dashboardPreview from "../../assets/dashboard-preview.png";

const FEATURES = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description:
      "Create, assign, and track tasks with real-time status updates, priorities, and due dates.",
  },
  {
    icon: FolderKanban,
    title: "Project Organization",
    description:
      "Organize work into focused projects with clear goals, milestones, and team assignments.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Bring your team together with shared workspaces, role-based access, and live updates.",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Get a bird\u2019s-eye view of all your projects and tasks in one unified command center.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Track progress with detailed reports, visual charts, and actionable team insights.",
  },
  {
    icon: Tags,
    title: "Tags & Filtering",
    description:
      "Categorize and surface work instantly with powerful tagging, search, and filter tools.",
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const targets = el.querySelectorAll(".landing-reveal");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const revealRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={revealRef}
      className="font-outfit min-h-screen bg-[#07070e] text-[#eeeef0] overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ---- Atmosphere ---- */}
      <div className="landing-grid-bg fixed inset-0 pointer-events-none" />
      <div
        className="fixed pointer-events-none top-[-300px] left-1/2 -translate-x-1/2 w-[1100px] h-[850px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ========================================= */}
      {/* NAVBAR                                    */}
      {/* ========================================= */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#07070e]/80 backdrop-blur-2xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-syne text-xl font-bold tracking-tight text-white"
          >
            Workasana
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-[#7a7a92] hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-sm text-[#7a7a92] hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-[#7a7a92] hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="group px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0b0b14]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-5 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#7a7a92] hover:text-white py-1"
            >
              Features
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#7a7a92] hover:text-white py-1"
            >
              Contact
            </a>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
              <Link
                to="/login"
                className="px-4 py-2.5 text-sm text-center text-[#7a7a92] border border-white/[0.08] rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2.5 text-sm text-center font-medium bg-blue-600 text-white rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================= */}
      {/* HERO                                      */}
      {/* ========================================= */}
      <section className="relative pt-32 md:pt-44 pb-8">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="landing-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/[0.06] text-blue-400 text-xs font-medium tracking-wide uppercase">
            <Sparkles className="size-3.5" />
            Project Management, Reimagined
          </div>

          {/* Headline */}
          <h1
            className="landing-fade-up font-syne mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.06] tracking-tight"
            style={{ animationDelay: "150ms" }}
          >
            Work smarter.
            <br />
            Ship faster.
            <br />
            <span className="landing-gradient-text">Together.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="landing-fade-up mt-6 md:mt-8 text-base md:text-lg text-[#6b6b80] max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: "300ms" }}
          >
            Workasana brings your tasks, projects, and teams into one intuitive
            workspace. Stop juggling tools and start delivering results.
          </p>

          {/* CTAs */}
          <div
            className="landing-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: "450ms" }}
          >
            <Link
              to="/signup"
              className="group w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.35)]"
            >
              Get Started Free
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-center text-[#8888a0] hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all duration-200"
            >
              Explore Features
            </a>
          </div>

          {/* Dashboard Preview */}
          <div
            className="landing-fade-up relative mt-20 md:mt-28 max-w-5xl mx-auto"
            style={{ animationDelay: "650ms" }}
          >
            {/* Glow behind image */}
            <div
              className="absolute -inset-6 md:-inset-10 landing-glow-pulse pointer-events-none blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 65%)",
              }}
            />

            {/* Image */}
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_25px_100px_rgba(0,0,0,0.55)]">
              <img
                src={dashboardPreview}
                alt="Workasana Dashboard — projects, tasks, and team overview"
                className="w-full block"
                loading="eager"
              />
              {/* Bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070e]/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FEATURES                                  */}
      {/* ========================================= */}
      <section id="features" className="relative py-28 md:py-40">
        {/* Subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center landing-reveal">
            <h2 className="font-syne text-3xl md:text-5xl font-bold tracking-tight">
              Everything you need to
              <br />
              <span className="landing-gradient-text">
                manage work effectively
              </span>
            </h2>
            <p className="mt-5 text-[#6b6b80] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Powerful features designed for modern teams who want to move fast
              without losing sight of the big picture.
            </p>
          </div>

          {/* Cards grid */}
          <div className="mt-16 md:mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="landing-reveal group relative p-6 md:p-7 rounded-2xl bg-[#0b0b15] border border-white/[0.05] hover:border-blue-500/20 transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.06),transparent_60%)]" />

                <div className="relative">
                  <div className="size-12 rounded-xl bg-blue-500/[0.08] border border-blue-500/[0.08] flex items-center justify-center group-hover:bg-blue-500/[0.12] group-hover:border-blue-500/15 transition-colors duration-500">
                    <feature.icon className="size-5 text-blue-400" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6b6b80] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CTA                                       */}
      {/* ========================================= */}
      <section id="contact" className="relative py-24 md:py-36">
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="landing-reveal relative rounded-3xl overflow-hidden">
            {/* Gradient border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/25 via-blue-500/[0.04] to-transparent" />

            <div className="relative m-px rounded-3xl bg-[#090912] px-8 py-16 md:px-16 md:py-20 text-center">
              {/* Top glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)",
                }}
              />

              <div className="relative">
                <h2 className="font-syne text-3xl md:text-5xl font-bold tracking-tight">
                  Ready to transform
                  <br />
                  how your team works?
                </h2>

                <p className="mt-5 text-[#6b6b80] text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                  Join teams already shipping faster with Workasana. Free to get
                  started, no credit card required.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/signup"
                    className="group w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.35)]"
                  >
                    Sign Up Now
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <a
                    href="#features"
                    className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-center text-[#8888a0] hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all duration-200"
                  >
                    Explore Features
                  </a>
                </div>

                {/* Contact divider */}
                <div className="mt-14 pt-8 border-t border-white/[0.06]">
                  <p className="text-sm text-[#6b6b80]">
                    Have custom requirements? Let&apos;s talk.
                  </p>
                  <a
                    href="mailto:hello@manavsingh.in"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    <Mail className="size-4" />
                    hello@manavsingh.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FOOTER                                    */}
      {/* ========================================= */}
      <footer className="relative border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <span className="font-syne font-bold text-white text-base">
                Workasana
              </span>
              <span className="text-xs text-[#444458]">
                Modern project management for modern teams
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#444458]">
              <a
                href="#features"
                className="hover:text-white transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#contact"
                className="hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
              <Link
                to="/login"
                className="hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hover:text-white transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#333344]">
              &copy; {new Date().getFullYear()} Workasana. All rights reserved.
            </p>
            <a
              href="mailto:hello@manavsingh.in"
              className="text-xs text-[#333344] hover:text-blue-400 transition-colors duration-200"
            >
              hello@manavsingh.in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
