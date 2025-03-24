"use client";

import { Coffee, ImageIcon, Play, ChevronRight, Instagram, ArrowRight, Eye, Clock, Camera, Images, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import Link from 'next/link'

export default function GalleryPage() {

  const images = [
    '/mg1.jpeg',
    '/mg2.jpeg',
    '/mg3.jpeg',
    '/mg4.jpeg',
    '/mg5.jpeg',
    '/mg6.jpeg',
    '/mg7.jpeg',
    '/mg8.jpeg',
    '/mg9.jpeg',
    '/mg10.jpeg',
    '/mg11.jpeg',
    '/mg12.jpeg',
    '/mg13.jpeg',
    '/mg14.jpeg',
    '/mg15.jpeg',
    '/mg16.jpeg',
  ];


  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
 
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  const openModal = (src: string, index: number) => {
    setSelectedMedia(src);
    setCurrentIndex(index);
  };

  
  const closeModal = () => {
    setSelectedMedia(null);
    setCurrentIndex(0);
  };

  
  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedMedia(images[newIndex]);
    setCurrentIndex(newIndex);
  };

 
  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setSelectedMedia(images[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-amber-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="w-full h-full bg-cover bg-fixed"
            style={{
              backgroundImage: "url('/herogallery.jpeg')",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-block mb-6">
            <ImageIcon className="h-12 w-12 text-amber-400 mx-auto mb-2" />
            <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white custom-serif mb-6">Our Gallery</h1>
          <p className="max-w-2xl mx-auto text-xl text-amber-200 italic">
            A visual journey through our coffee heritage and cafe experience
          </p>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="py-20 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((src, index) => {
              const isFeatured = [0, 7, 10, 15].includes(index);
              const isVideo = [3, 11].includes(index);

              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
                    isFeatured ? 'col-span-2 row-span-2' : ''
                  }`}
                  onClick={() => openModal(src, index)}
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    width={isFeatured ? 600 : 300}
                    height={isFeatured ? 600 : 300}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      {isVideo ? (
                        <button className="bg-amber-600 text-white rounded-full p-4 mb-4">
                          <Play className="h-8 w-8" />
                        </button>
                      ) : (
                        <button className="bg-amber-600 text-white rounded-full p-4 mb-4">
                          <ImageIcon className="h-8 w-8" />
                        </button>
                      )}
                      <h3 className="text-white font-bold text-lg mb-1">
                        {isVideo ? 'Coffee Making Process' : 'Tanjore Degree Coffee'}
                      </h3>
                      <p className="text-amber-200 text-sm">
                        {isVideo ? 'Watch our traditional brewing method' : 'Experience the authentic taste'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMedia && (
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

            {/* Selected Media */}
            {[3, 11].includes(currentIndex) ? (
              <video
                src={selectedMedia}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={selectedMedia}
                alt="Selected Gallery Image"
                width={800}
                height={600}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
{/* Featured Collections */}
<section className="py-24 bg-gradient-to-b from-amber-50 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300 rounded-full opacity-20 blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10 text-center">
          <div className="inline-flex flex-col items-center mb-6">
            <div className="p-3 bg-white rounded-full shadow-md shadow-amber-200/50 mb-3">
              <Camera className="h-10 w-10 text-amber-700" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
              <div className="h-2 w-2 rounded-full bg-amber-700 animate-pulse"></div>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-amber-900 mb-4">
              Featured Collections
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-800/80 mb-6">
              Explore our curated photo collections showcasing different aspects of our coffee journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                slug: "art-of-coffee-making",
                title: "The Art of Coffee Making",
                description: "A step-by-step visual journey through our traditional coffee brewing process.",
                count: 12,
                image: "/fc1.jpeg",
                accent: "from-amber-400 to-amber-600",
              },
              {
                slug: "cafe-seasons",
                title: "Our Cafe Through the Seasons",
                description: "Experience the changing ambiance of our cafe throughout the year.",
                count: 18,
                image: "/fc2.jpeg",
                accent: "from-amber-500 to-amber-700",
              },
              {
                slug: "coffee-farm-to-cup",
                title: "Coffee Farm to Cup",
                description: "Follow the journey of our coffee beans from the plantations to your cup.",
                count: 15,
                image: "/fc3.jpeg",
                accent: "from-amber-600 to-amber-800",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-800/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 bg-white text-amber-900 px-4 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center space-x-2 transform group-hover:translate-y-0 translate-y-12 transition-transform duration-300 delay-100">
                    <Camera className="h-4 w-4 text-amber-700 mr-1" />
                    <span>{collection.count} Photos</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <Images className="h-8 w-8 text-amber-700" />
                  </div>
                </div>

                <div className="p-6 relative">
                  <div className="group/title mb-3">
                    <h3 className="text-xl font-bold text-amber-900 inline-block">
                      {collection.title}
                    </h3>
                    <div className={`h-0.5 w-0 group-hover/title:w-full bg-gradient-to-r ${collection.accent} transition-all duration-500`}></div>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2">{collection.description}</p>
                  <Link href={`/gallery/${collection.slug}`}>
                    <button className="flex items-center text-amber-700 font-medium hover:text-amber-900 transition-colors group/btn">
                      <span>View Collection</span>
                      <div className="ml-2 w-6 h-6 rounded-full flex items-center justify-center bg-amber-100 group-hover/btn:bg-amber-200 transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </button>
                  </Link>
                  <div className="absolute top-0 right-0 w-12 h-12">
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-transparent border-r-white"></div>
                    <div className={`absolute top-0 right-0 w-6 h-6 bg-gradient-to-br ${collection.accent} rounded-bl-lg`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white text-amber-800 border-2 border-amber-700 rounded-full shadow-md hover:shadow-lg hover:bg-amber-50 transition-all duration-300 hover:scale-105 flex items-center mx-auto">
              <span>Browse All Collections</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

{/* Video Gallery */}
<section className="py-24 bg-gradient-to-b from-amber-900 to-amber-950 text-white relative overflow-hidden">
 
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-amber-400 blur-3xl"></div>
    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-amber-600 blur-3xl"></div>
  </div>
  

  <div className="absolute inset-0 opacity-5 bg-repeat" 
       style={{ backgroundImage: "url('/placeholder.svg?height=100&width=100')" }}></div>
  
  <div className="container px-4 mx-auto relative z-10">
    <div className="text-center mb-16">

      <div className="inline-block mb-6">
      <div className="p-3 bg-gradient-to-br from-amber-800 to-amber-900 rounded-full shadow-lg mb-3 flex items-center justify-center">
  <Play className="h-10 w-10 text-amber-400" />
</div>

        <div className="flex items-center justify-center gap-2">
          <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-amber-400"></div>
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
          <div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>
      </div>
      
      <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
        Experience Our Coffee Journey
      </h2>
      
      <p className="max-w-2xl mx-auto text-lg text-amber-200 mb-8">
        Watch our coffee making process and cafe experiences come to life through our curated video collection
      </p>
    </div>

  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      {[
        {
          title: "The Art of Brewing Tanjore Degree Coffee",
          duration: "3:45",
          views: "12K",
          image: "/cj1.jpeg",
        },
        {
          title: "Behind the Scenes: Our Coffee Roasting Process",
          duration: "5:20",
          views: "8.5K",
          image: "/cj2.jpeg",
        },
        {
          title: "Meet Our Master Brewer: An Interview",
          duration: "7:15",
          views: "6.2K",
          image: "/cj3.jpeg",
        },
        {
          title: "A Day at Tanjore Degree Coffee",
          duration: "4:30",
          views: "9.8K",
          image: "/cj4.jpeg",
        },
      ].map((video, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
        >
          <div className="relative aspect-video overflow-hidden">
        
            <img
              src={video.image}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
           
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-900/70 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>

         
            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-500 text-white rounded-full p-4 transition-all duration-300 group-hover:scale-125 shadow-lg group-hover:shadow-amber-500/50">
              <Play className="h-8 w-8" />
              <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></span>
            </button>

          
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors duration-300">{video.title}</h3>
              <div className="flex items-center text-amber-300 text-sm">
                <span className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1 opacity-70" />
                  {video.duration}
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 opacity-70" />
                  {video.views} views
                </span>
              </div>
            </div>
            
           
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      ))}
    </div>
    
   
    <div className="mt-12 text-center">
      <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-full text-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-amber-900">
        <span className="flex items-center justify-center">
          View More Videos
          <ArrowRight className="ml-2 h-5 w-5" />
        </span>
      </button>
    </div>
  </div>
  

  <div className="absolute top-0 left-0 w-full overflow-hidden">
    <svg className="relative block w-full h-12 text-amber-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-amber-900"></path>
    </svg>
  </div>
  
  
  <div className="absolute bottom-0 left-0 w-full overflow-hidden">
    <svg className="relative block w-full h-12 text-amber-950" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,214.34,115.3,287.11,93.81,342.79,70.29,401.28,56.44Z" className="fill-amber-950"></path>
    </svg>
  </div>
</section>

{/* Instagram Feed */}
<section className="py-20 bg-gradient-to-b from-amber-50 to-amber-100">
  <div className="container px-4 mx-auto">
    <div className="text-center mb-16">
      <div className="inline-block mb-4 transform transition-transform duration-500 hover:scale-110">
        <Coffee className="h-10 w-10 text-amber-800 mx-auto mb-2" />
        <div className="h-1 w-16 bg-amber-800 mx-auto rounded-full"></div>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4 animate-fade-in">
        Follow Us on Instagram
      </h2>
      <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic animate-fade-in delay-100">
        @TanjoreDegreeCoffee
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[
        '/insta1.jpeg',
        '/insta2.jpeg',
        '/insta3.jpeg',
        '/insta4.jpeg',
        '/insta5.jpeg',
        '/insta6.jpeg',
      ].map((src, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
        >
          <Image
            src={src}
            alt={`Instagram post ${index + 1}`}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
            <p className="text-amber-100 text-sm text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              #TanjoreCoffee #CoffeeLovers
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-10 animate-fade-in delay-200">
      <a
        href="https://www.instagram.com/TanjoreDegreeCoffee/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-amber-50 px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/30 transform hover:scale-105"
      >
        <Instagram className="h-6 w-6 text-amber-50" />
        Follow Us on Instagram
      </a>
    </div>
  </div>
</section>

{/* Submit Your Photos */}
<section className="py-20 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
  <div className="container px-4 mx-auto">
    <div className="max-w-4xl mx-auto text-center">
     
      <div className="inline-block mb-6 animate-bounce">
        <ImageIcon className="h-12 w-12 text-amber-400 mx-auto mb-2" />
        <div className="h-1 w-16 bg-amber-400 mx-auto rounded-full" />
      </div>

     
      <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-6 animate-fade-in-up">
        Share Your Coffee Moments
      </h2>

   
      <p className="text-xl text-amber-200 mb-10 italic animate-fade-in-up delay-100">
        Tag us in your photos or use #TanjoreDegreeCoffee for a chance to be featured in our gallery
      </p>

      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105">
          Upload Your Photo
        </Button>
        <Button
          variant="outline"
          className="text-amber-800 bg-white hover:bg-amber-50 hover:text-amber-900 border-amber-400 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105"
        >
          Learn More
        </Button>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

