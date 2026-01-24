import { useEffect, useState } from "react";
import { Sparkles, LogIn, Menu, X, ChevronDown, Mail, Headphones, Activity, Bug } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { SiGithub, SiVite, SiNextdotjs } from "react-icons/si";
import { GitHubButton } from "./github-button";

export const Navbar = () => {
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#000000] border-b border-white/10 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="OutRay Logo"
            className={`${scrolled ? "w-10" : "w-12"} transition-all`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <div 
            className="relative"
            onMouseEnter={() => setDocsOpen(true)}
            onMouseLeave={() => setDocsOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              Docs
              <ChevronDown size={14} className={`transition-transform ${docsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {docsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 min-w-[420px] shadow-2xl">
                  <div className="flex gap-8">
                    <div className="flex flex-col gap-3">
                      <Link 
                        to="/docs/$" 
                        params={{ _splat: "" }}
                        className="text-white/70 hover:text-white transition-colors text-base"
                      >
                        Getting Started
                      </Link>
                      <Link 
                        to="/docs/$" 
                        params={{ _splat: "cli-reference" }}
                        className="text-white/70 hover:text-white transition-colors text-base"
                      >
                        CLI Reference
                      </Link>
                      <Link 
                        to="/plugins"
                        className="text-white/70 hover:text-white transition-colors text-base"
                      >
                        Plugins
                      </Link>
                    </div>
                    
                    <div className="border-l border-white/10 pl-8">
                      <div className="grid grid-cols-2 gap-4">
                        <Link 
                          to="/vite" 
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                          title="Vite"
                        >
                          <SiVite className="w-6 h-6 text-white/50 group-hover:text-[#646CFF] transition-colors" />
                        </Link>
                        <Link 
                          to="/nextjs" 
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                          title="Next.js"
                        >
                          <SiNextdotjs className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/changelog" className="hover:text-white transition-colors">
            Changelog
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => setHelpOpen(true)}
            onMouseLeave={() => setHelpOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              Help
              <ChevronDown size={14} className={`transition-transform ${helpOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {helpOpen && (
              <div className="absolute top-full right-0 pt-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 min-w-[200px] shadow-2xl">
                  <div className="flex flex-col gap-1">
                    <Link 
                      to="/contact"
                      className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                    >
                      <Mail size={16} />
                      Contact
                    </Link>
                    <Link 
                      to="/contact"
                      className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                    >
                      <Headphones size={16} />
                      Support
                    </Link>
                    <a 
                      href="https://status.outray.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                    >
                      <Activity size={16} />
                      Status
                    </a>
                    <Link 
                      to="/report-bug"
                      className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                    >
                      <Bug size={16} />
                      Report a Bug
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <GitHubButton size="sm" />
          </div>
          {session ? (
            <Link
              to={organizations?.length ? "/$orgSlug" : "/select"}
              params={{
                orgSlug:
                  organizations && organizations.length
                    ? organizations[0].slug
                    : "",
              }}
              className="hidden md:flex px-5 py-2 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/15 transition-colors items-center gap-2 text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/15 transition-colors text-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          {!mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu - full height with animation */}
      <div
        className={`md:hidden fixed inset-0 bg-[#000000] z-[60] transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        {/* Mobile menu header with logo and close button */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="OutRay Logo" className="w-10" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)] px-6 pb-8">
          <div className="flex flex-col gap-2 flex-1">
            <Link
              to="/docs/$"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white transition-colors py-4 text-2xl font-medium border-b border-white/10"
            >
              Documentation
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white transition-colors py-4 text-2xl font-medium border-b border-white/10"
            >
              Pricing
            </Link>
            <a
              href="https://github.com/akinloluwami/outray"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors py-4 text-2xl font-medium border-b border-white/10"
            >
              <SiGithub size={24} />
              GitHub
            </a>
            
            {/* Help section in mobile */}
            <div className="py-4 border-b border-white/10">
              <p className="text-white/40 text-sm font-medium mb-3">Help</p>
              <div className="flex flex-col gap-2 pl-2">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors py-2 text-lg"
                >
                  <Mail size={20} />
                  Contact
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors py-2 text-lg"
                >
                  <Headphones size={20} />
                  Support
                </Link>
                <a
                  href="https://status.outray.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors py-2 text-lg"
                >
                  <Activity size={20} />
                  Status
                </a>
                <a
                  href="https://github.com/akinloluwami/outray/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors py-2 text-lg"
                >
                  <Bug size={20} />
                  Report a Bug
                </a>
              </div>
            </div>
          </div>

          {/* Dashboard/Login button at bottom */}
          <div className="mt-auto pt-6">
            {session ? (
              <Link
                to={organizations?.length ? "/$orgSlug" : "/select"}
                params={{
                  orgSlug:
                    organizations && organizations.length
                      ? organizations[0].slug
                      : "",
                }}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-6 py-4 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-6 py-4 text-white/60 hover:text-white font-medium transition-colors flex items-center justify-center text-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-6 py-4 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/15 transition-colors flex items-center justify-center text-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
