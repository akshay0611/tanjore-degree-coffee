"use client";
import { Coffee, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MenuSection() {
  const menuItems = [
    {
      name: "Classic Degree Coffee",
      description: "Traditional decoction with farm-fresh milk",
      price: "₹60",
      image: "/menu1.jpeg", 
      popular: true,
    },
    {
      name: "Filter Coffee",
      description: "Strong decoction served in traditional davara-tumbler",
      price: "₹50",
      image: "/menu2.jpeg",
    },
    {
      name: "Mysore Coffee",
      description: "Lighter brew with a hint of chicory",
      price: "₹65",
      image: "/menu3.jpeg",
    },
    {
      name: "Chukku Kaapi",
      description: "Coffee with dry ginger and spices",
      price: "₹75",
      image: "/menu4.jpeg",
      popular: true,
    },
    {
      name: "Bella Coffee",
      description: "Coffee sweetened with jaggery instead of sugar",
      price: "₹70",
      image: "/menu5.jpeg",
    },
    {
      name: "Sukku Coffee",
      description: "Medicinal coffee with dry ginger and pepper",
      price: "₹80",
      image: "/menu6.jpeg",
    },
  ];

  return (
    <section className="py-24 bg-amber-950 text-amber-50 relative overflow-hidden">
   
      <div className="absolute inset-0 bg-[url('/coffee-pattern.svg')] bg-repeat opacity-10"></div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 animate-float">
            <Coffee className="h-10 w-10 text-amber-400 mx-auto mb-2" />
            <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
          </div>
          <h2 className="text-4xl font-bold text-amber-50 custom-serif mb-4">Our Menu</h2>
          <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
            Discover our selection of traditional and contemporary coffee preparations, along with authentic South
            Indian snacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group bg-amber-900/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-amber-900/50 hover:-translate-y-1 relative"
            >
             
              {item.popular && (
                <div className="absolute top-4 right-4 bg-amber-600 text-amber-50 px-3 py-1 rounded-full text-sm font-medium z-20">
                  Popular
                </div>
              )}

             
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={224}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 to-transparent"></div>
              </div>

             
              <div className="p-6 relative">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-amber-100">{item.name}</h3>
                  <span className="text-lg font-bold text-amber-400">{item.price}</span>
                </div>
                <p className="text-amber-200 mb-4">{item.description}</p>
                <Button
                  variant="ghost"
                  className="mt-4 text-amber-400 hover:text-amber-300 hover:bg-amber-800/50 p-0 h-auto flex items-center group"
                >
                  Order Now{" "}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

      
        <div className="text-center mt-16">
  <Link href="/menu" passHref>
    <Button
      size="lg"
      className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 animate-pulse"
    >
      View Full Menu
    </Button>
  </Link>
</div>
      </div>

     
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
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}