"use client";
import { Coffee, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Import the Link component

export default function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-amber-50 to-amber-100/90 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-100/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>

      {/* Content Container */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            {/* Floating Borders */}
            <div className="absolute -top-8 -left-8 w-32 h-32 border-t-2 border-l-2 border-amber-800 z-0 rounded-tl-lg animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-b-2 border-r-2 border-amber-800 z-0 rounded-br-lg animate-float-delay"></div>

            {/* Image with Overlay */}
            <div className="absolute top-0 left-0 w-full h-full p-4 -m-4 border border-amber-700/20 rounded-lg transform rotate-3 z-0"></div>
            <div className="relative rounded-lg shadow-2xl overflow-hidden z-10 hover:shadow-amber-900/40 transition-shadow duration-300">
              <Image
                src="/aboutsection.jpeg"
                alt="Traditional coffee preparation"
                width={800}
                height={600}
                className="transition-transform duration-700 hover:scale-110 rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent"></div>

              {/* Image Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-amber-900/80 to-amber-900/0">
                <p className="text-amber-50 text-sm font-medium">Traditional coffee preparation in Thanjavur, Tamil Nadu</p>
              </div>
            </div>

            {/* Location Badge */}
            <div className="absolute -bottom-4 -right-4 bg-amber-800 text-amber-50 px-6 py-3 rounded-full shadow-lg z-20 flex items-center hover:scale-105 transition-transform duration-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="font-medium">Thanjavur, India</span>
            </div>
          </div>

          {/* Text Section */}
          <div className="md:w-1/2">
            {/* Established Badge */}
            <div className="inline-flex items-center mb-6 bg-amber-800/10 px-4 py-2 rounded-full shadow-sm hover:bg-amber-800/20 transition-colors duration-300">
              <Coffee className="h-5 w-5 text-amber-800 mr-2" />
              <span className="text-amber-800 font-medium">Established 1942</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-bold text-amber-900 mb-3">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mb-8 rounded-full"></div>

            {/* Description */}
            <div className="space-y-6 text-lg text-amber-950/80 leading-relaxed">
              <p>
                Tanjore Degree Coffee is a celebration of South India&apos;s rich coffee heritage. The term &quot;degree coffee&quot;
                originates from Thanjavur (Tanjore), where coffee was traditionally brewed to a specific temperature or &quot;degree.&quot;
              </p>

              {/* Blockquote */}
              <blockquote className="border-l-4 border-amber-500 pl-6 italic text-amber-900 my-8 transform transition-transform duration-300 hover:translate-x-2">
                &quot;The perfect cup of coffee is made with passion, precision, and a deep respect for tradition.&quot;
              </blockquote>

              <p>
                Our coffee is made from the finest Arabica and Robusta beans, sourced directly from plantations in the
                Western Ghats. We follow the traditional method of decoction brewing, using a traditional filter and
                adding farm-fresh milk.
              </p>
            </div>

            {/* Buttons and Community Section */}
            <div className="flex items-center mt-10 space-x-4">
              {/* Learn More Button with Link */}
              <Link href="/about" passHref>
                <Button className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-amber-900/20 transition-all duration-300 group">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Community Section */}
              <div className="flex items-center space-x-2 text-amber-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-amber-800 font-bold text-xs hover:scale-110 transition-transform duration-300"
                    >
                      TD
                    </div>
                  ))}
                </div>
                <span className="font-medium text-sm">Join our community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 4s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
}