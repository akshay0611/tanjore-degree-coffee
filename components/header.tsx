"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Menu, X, Coffee, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { AuthModal } from "@/components/auth-modal";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming you have a Tooltip component

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Menu", href: "/menu" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact", href: "/contact" },
    ],
    []
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
      if (event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push("/");
  };

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 
    bg-gradient-to-r from-amber-900 to-amber-800 backdrop-blur-md shadow-lg 
    ${isScrolled ? "py-3" : "py-4"}`;

  const logoIconClasses = `p-2 rounded-full 
    ${isScrolled 
      ? "bg-amber-700 ring-2 ring-amber-500/20" 
      : "bg-amber-800/30 ring-2 ring-amber-700/20"
    } mr-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`;

  const logoTextClasses = `text-xl font-bold 
    ${isScrolled ? "text-amber-100" : "text-amber-200"} 
    transition-colors duration-300`;

  const logoSubtextClasses = `text-sm 
    ${isScrolled ? "text-amber-200" : "text-amber-300"} 
    transition-colors duration-300 font-medium`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className={logoIconClasses}>
              <Coffee className={`h-6 w-6 ${isScrolled ? "text-amber-100" : "text-amber-200"} transition-colors`} />
            </div>
            <div className="flex flex-col">
              <span className={logoTextClasses}>Tanjore Degree</span>
              <span className={logoSubtextClasses}>Coffee</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md 
                    ${isActive
                      ? isScrolled
                        ? "text-amber-300 bg-amber-800/50"
                        : "text-amber-300 bg-amber-900/50 font-medium"
                      : isScrolled
                        ? "text-amber-100 hover:text-amber-300 hover:bg-amber-800/30"
                        : "text-amber-200 hover:text-amber-300 hover:bg-amber-900/30"
                    } font-medium transition-all duration-300 overflow-hidden group`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-400
                      transform origin-left transition-transform duration-300
                      ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  ></span>
                </Link>
              );
            })}
            <div className="flex items-center space-x-4 pl-4 border-l border-amber-700/30">
              {isAuthenticated ? (
                <TooltipProvider>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-sm font-medium truncate max-w-[150px] ${
                        isScrolled ? "text-amber-100" : "text-amber-200"
                      }`}
                      title={userEmail || ""}
                    >
                      Hi, {userEmail?.split("@")[0] || userEmail} {/* Show "Hi, [username]" */}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full 
                            ${isScrolled 
                              ? "text-amber-100 hover:text-amber-300 hover:bg-amber-800/70" 
                              : "text-amber-200 hover:text-amber-300 hover:bg-amber-900/70"
                            } transition-all duration-300`}
                          aria-label="Profile"
                          asChild
                        >
                          <Link href="/auth">
                            <User className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Profile</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full 
                            ${isScrolled 
                              ? "text-amber-100 hover:text-amber-300 hover:bg-amber-800/70" 
                              : "text-amber-200 hover:text-amber-300 hover:bg-amber-900/70"
                            } transition-all duration-300`}
                          onClick={handleLogout}
                          aria-label="Logout"
                        >
                          <LogOut className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Logout</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              ) : (
                <AuthModal />
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full transition-all duration-300 hover:bg-amber-800/50 active:bg-amber-800/70"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? "text-amber-100" : "text-amber-200"} transition-transform duration-300 rotate-90`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? "text-amber-100" : "text-amber-200"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-6 border-t border-amber-700/30 pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${
                      isActive
                        ? "text-amber-300 bg-amber-800/50"
                        : "text-amber-100 hover:text-amber-300 hover:bg-amber-800/30"
                    } font-medium transition-all duration-300 px-4 py-3 rounded-md flex items-center justify-between`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-amber-700/30 flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3 items-start">
                    <span
                      className="text-sm font-medium text-amber-100 truncate max-w-[200px]"
                      title={userEmail || ""}
                    >
                      Hi, {userEmail?.split("@")[0] || userEmail}
                    </span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-100 hover:text-amber-300 hover:bg-amber-800/70 rounded-full"
                        aria-label="Profile"
                        asChild
                      >
                        <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-100 hover:text-amber-300 hover:bg-amber-800/70 rounded-full"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        aria-label="Logout"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <AuthModal onClose={() => setIsMenuOpen(false)} />
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}