"use client"

import { Button } from "@/components/ui/button"
import { Coffee, Star, Leaf } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translateY(${scrolled ? "5%" : "0"})`,
        }}
      >
        <div className="relative w-full h-full bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
         
          <Image
            src="/test.jpeg" 
            alt="Tanjore Degree Coffee Background"
            fill
            className="object-cover opacity-10"
          />
        </div>
      </div>

      <div className="absolute top-24 left-10 opacity-30 hidden md:block">
        <Coffee className="h-12 w-12 text-amber-600 transform rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-30 hidden md:block">
        <Coffee className="h-12 w-12 text-amber-600 transform -rotate-12" />
      </div>
      <div className="absolute top-1/3 right-16 opacity-20 hidden lg:block">
        <Leaf className="h-10 w-10 text-green-600 transform rotate-45" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <div className="inline-block mb-8 relative">
          <div className="p-3 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 shadow-lg">
            <Coffee className="h-16 w-16 text-amber-400 mx-auto" />
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-75"></div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="absolute top-1/4 left-1/4 hidden md:block">
          <Star className="h-4 w-4 text-amber-300/40" fill="currentColor" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
  <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">Tanjore</span> Degree Coffee
</h1>

        <div className="flex items-center justify-center gap-2 my-4">
          <div className="h-[1px] w-12 bg-amber-500/50"></div>
          <div className="h-1 w-1 rounded-full bg-amber-400"></div>
          <div className="h-[1px] w-12 bg-amber-500/50"></div>
        </div>

        <p className="max-w-2xl mx-auto mt-4 text-xl text-amber-100 italic font-light leading-relaxed">
          Experience the authentic taste of traditional South Indian coffee,
          <br className="hidden md:block" /> brewed to perfection since 1942.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <Link href="/menu" passHref>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 hover:scale-105 font-medium"
            >
              View Menu
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button
              size="lg"
              variant="outline"
              className="text-amber-800 bg-white hover:bg-amber-50 hover:text-amber-900 border-amber-400 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105"
            >
              Our Story
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-40 opacity-20 pointer-events-none">
        <div className="w-8 h-32 mx-auto bg-gradient-to-t from-amber-100/0 to-amber-100/40 rounded-full blur-xl animate-steam-1"></div>
        <div className="w-6 h-28 mx-auto mt-[-20px] bg-gradient-to-t from-amber-100/0 to-amber-100/40 rounded-full blur-xl animate-steam-2"></div>
      </div>
    </section>
  )
}