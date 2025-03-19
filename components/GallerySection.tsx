"use client";
import Image from 'next/image';
import { Coffee, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const GallerySection = () => {
 
  const images = [
    '/cg1.jpeg',
    '/cg2.jpeg',
    '/cg3.jpeg',
    '/cg4.jpeg',
    '/cg5.jpeg',
    '/cg6.jpeg',
    '/cg7.jpeg',
    '/cg8.jpeg',
  ];


  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);


  const openModal = (src: string, index: number) => {
    setSelectedImage(src);
    setCurrentIndex(index);
  };


  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };


  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[newIndex]);
    setCurrentIndex(newIndex);
  };

 
  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[newIndex]);
    setCurrentIndex(newIndex);
  };

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

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl shadow-lg group ${
                index === 0 || index === 7 ? 'col-span-2 row-span-2' : ''
              } transition-all duration-700 ease-out cursor-pointer`}
              onClick={() => openModal(src, index)}
            >
              <Image
                src={src}
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

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-lg">
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-700 transition-colors duration-300 z-20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-700 transition-colors duration-300 z-20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-700 transition-colors duration-300 z-20"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Selected Image */}
              <Image
                src={selectedImage}
                alt="Selected Gallery Image"
                width={800}
                height={600}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;