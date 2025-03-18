"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Coffee, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-gradient-to-r from-amber-900 to-amber-800 backdrop-blur-md shadow-lg py-3" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
         
          <Link href="/" className="flex items-center group">
            <div
              className={`p-2 rounded-full ${
                isScrolled 
                  ? "bg-amber-700 ring-2 ring-amber-500/20" 
                  : "bg-amber-800/30 ring-2 ring-amber-700/20"
              } mr-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`}
            >
              <Coffee className={`h-6 w-6 ${
                isScrolled ? "text-amber-100" : "text-amber-200"
              } transition-colors`} />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold ${
                  isScrolled ? "text-amber-100" : "text-amber-200"
                } transition-colors duration-300`}
              >
                Tanjore Degree
              </span>
              <span className={`text-sm ${
                isScrolled ? "text-amber-200" : "text-amber-300"
              } transition-colors duration-300 font-medium`}>
                Coffee
              </span>
            </div>
          </Link>

        
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-2 rounded-md ${
                  pathname === link.href
                    ? isScrolled
                      ? "text-amber-300 bg-amber-800/50"
                      : "text-amber-300 bg-amber-900/50 font-medium"
                    : isScrolled
                      ? "text-amber-100 hover:text-amber-300 hover:bg-amber-800/30"
                      : "text-amber-200 hover:text-amber-300 hover:bg-amber-900/30"
                } font-medium transition-all duration-300 overflow-hidden group`}
              >
                <span className="relative z-10">{link.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${
                  isScrolled ? "bg-amber-400" : "bg-amber-400"
                } transform origin-left transition-transform duration-300 ${
                  pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
            ))}
            <div className="flex items-center space-x-3 pl-2 border-l border-amber-700/30">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full relative ${
                  isScrolled 
                    ? "text-amber-100 hover:text-amber-300 hover:bg-amber-800/70" 
                    : "text-amber-200 hover:text-amber-300 hover:bg-amber-900/70"
                } transition-all duration-300`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  3
                </span>
              </Button>
              <Button
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 shadow-md"
                    : "bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 shadow-lg"
                }`}
              >
                Order Online
              </Button>
            </div>
          </nav>

         
          <button 
            className="md:hidden p-2 rounded-full transition-all duration-300 hover:bg-amber-800/20" 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={isScrolled ? "h-6 w-6 text-amber-100" : "h-6 w-6 text-amber-200"} />
            ) : (
              <Menu className={isScrolled ? "h-6 w-6 text-amber-100" : "h-6 w-6 text-amber-200"} />
            )}
          </button>
        </div>

      
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-6 border-t border-amber-700/30 pt-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    pathname === link.href 
                      ? "text-amber-300 bg-amber-800/50" 
                      : "text-amber-100 hover:text-amber-300 hover:bg-amber-800/30"
                  } font-medium transition-all duration-300 px-4 py-3 rounded-md flex items-center justify-between`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  {pathname === link.href && <div className="h-2 w-2 rounded-full bg-amber-400"></div>}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-amber-700/30">
                <Button 
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 w-full shadow-md"
                >
                  Order Online
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}