// components/GallerySection.tsx
import Image from 'next/image';
import { Coffee } from 'lucide-react';

const GallerySection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-amber-900 to-amber-800 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 transition-all duration-1000 ease-out transform translate-y-0 opacity-100">
          <div className="inline-block mb-6 relative">
            <Coffee className="h-12 w-12 text-amber-400 mx-auto mb-3 animate-pulse" />
            <div className="h-1 w-20 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"></div>
          </div>
          <h2 className="text-5xl font-bold text-amber-50 custom-serif mb-6 tracking-tight drop-shadow-md">
            Coffee Gallery
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-amber-200 italic font-light leading-relaxed">
            A glimpse into our coffee-making process and ambiance
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl shadow-lg group ${
                index === 0 || index === 7 ? 'col-span-2 row-span-2' : ''
              } transition-all duration-700 ease-out`}
            >
              <Image
                src={`/placeholder.svg`}
                alt={`Gallery image ${index + 1}`}
                width={index === 0 || index === 7 ? 600 : 300}
                height={index === 0 || index === 7 ? 600 : 300}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-amber-50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <p className="text-sm font-medium">Coffee Moment #{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;