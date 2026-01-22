"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getAssetUrl } from "@/lib/image-loader";
const navigationLinks = [
  {
    name: "Newsletter",
    href: "/newsletter",
  },
  {
    name: "Solutions",
    href: "#solutions",
  },
  {
    name: "Resources",
    href: "#resources",
  },
] as any[];

// @component: PortfolioNavbar
export const PortfolioNavbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const handleLinkClick = (href: string) => {
    closeMobileMenu();
    // If it's a page route (starts with /), navigate to it
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    // Otherwise, treat as anchor link
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // @return
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button
              onClick={() => handleLinkClick("#home")}
              className="flex items-end gap-3 text-xl font-bold text-foreground hover:text-primary transition-colors duration-200"
            >
              <Image
                src={getAssetUrl("/icon.svg")}
                alt="CoE Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "600",
                }}
              >
                AI Center of Excellence
              </span>
            </button>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-foreground hover:text-primary px-3 py-2 text-base font-medium transition-colors duration-200 relative group"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: "400",
                  }}
                >
                  <span>{link.name}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                aria-label="View profile"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#146e96] ring-offset-2">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#146e96] flex items-center justify-center text-white font-semibold">
                      {user.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="block bg-[#f35959ff] text-white px-[18px] rounded-full text-base font-semibold hover:bg-[#f35959ff]/90 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap leading-4 py-[15px] cursor-pointer"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                <span
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "500",
                  }}
                >
                  Login
                </span>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-6 space-y-4">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="block w-full text-left text-foreground hover:text-primary py-3 text-lg font-medium transition-colors duration-200"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: "400",
                  }}
                >
                  <span>{link.name}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#146e96]">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#146e96] flex items-center justify-center text-white font-semibold">
                          {user.displayName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        className="font-medium text-foreground"
                        style={{
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                        }}
                      >
                        {user.displayName || "User"}
                      </p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={closeMobileMenu}
                    className="block w-full bg-[#f35959ff] text-white px-[18px] py-[15px] rounded-full text-base font-semibold hover:bg-[#f35959ff]/90 transition-colors duration-200 text-center cursor-pointer"
                    style={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}
                  >
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
