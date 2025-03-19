import { Coffee, ImageIcon, Play, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function GalleryPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-amber-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="w-full h-full bg-cover bg-fixed"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
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

      {/* Gallery Filter */}
      <section className="sticky top-20 z-30 bg-amber-900 shadow-md">
        <div className="container px-4 mx-auto">
          <div className="flex overflow-x-auto py-4 gap-4 no-scrollbar">
            {["All", "Coffee Making", "Cafe Ambiance", "Traditional Methods", "Our Team", "Customer Moments"].map(
              (category, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 ${index === 0 ? "bg-amber-700" : "bg-amber-800"} hover:bg-amber-700 text-amber-100 rounded-full whitespace-nowrap transition-colors duration-300 flex-shrink-0`}
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="py-20 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(16)].map((_, index) => {
              // Determine if this should be a featured image (larger size)
              const isFeatured = [0, 7, 10, 15].includes(index)
              // Determine if this should be a video thumbnail
              const isVideo = [3, 11].includes(index)

              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
                    isFeatured ? "col-span-2 row-span-2" : ""
                  }`}
                >
                 <Image
  src="/placeholder.svg"
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
                        {isVideo ? "Coffee Making Process" : "Tanjore Degree Coffee"}
                      </h3>
                      <p className="text-amber-200 text-sm">
                        {isVideo ? "Watch our traditional brewing method" : "Experience the authentic taste"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <ImageIcon className="h-10 w-10 text-amber-800 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">Featured Collections</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic">
              Explore our curated photo collections showcasing different aspects of our coffee journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "The Art of Coffee Making",
                description: "A step-by-step visual journey through our traditional coffee brewing process.",
                count: 12,
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Our Cafe Through the Seasons",
                description: "Experience the changing ambiance of our cafe throughout the year.",
                count: 18,
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Coffee Farm to Cup",
                description: "Follow the journey of our coffee beans from the plantations to your cup.",
                count: 15,
                image: "/placeholder.svg?height=400&width=600",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="bg-amber-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden group">
  <Image
    src={collection.image || "/placeholder.svg"}
    alt={collection.title}
    layout="fill"
    objectFit="cover"
    className="transition-transform duration-700 group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent"></div>
  <div className="absolute bottom-4 left-4 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-medium">
    {collection.count} Photos
  </div>
</div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">{collection.title}</h3>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <Button variant="ghost" className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 p-0 h-auto">
                    View Collection <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Play className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-4">Video Gallery</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              Watch our coffee making process and cafe experiences come to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "The Art of Brewing Tanjore Degree Coffee",
                duration: "3:45",
                views: "12K",
                image: "/placeholder.svg?height=400&width=700",
              },
              {
                title: "Behind the Scenes: Our Coffee Roasting Process",
                duration: "5:20",
                views: "8.5K",
                image: "/placeholder.svg?height=400&width=700",
              },
              {
                title: "Meet Our Master Brewer: An Interview",
                duration: "7:15",
                views: "6.2K",
                image: "/placeholder.svg?height=400&width=700",
              },
              {
                title: "A Day at Tanjore Degree Coffee",
                duration: "4:30",
                views: "9.8K",
                image: "/placeholder.svg?height=400&width=700",
              },
            ].map((video, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
               <div className="relative aspect-video overflow-hidden group">
  <Image
    src={video.image || "/placeholder.svg"}
    alt={video.title}
    layout="fill"
    objectFit="cover"
    className="transition-transform duration-700 group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-amber-950 to-transparent opacity-70"></div>

  {/* Play button */}
  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-500 text-white rounded-full p-5 transition-transform duration-300 group-hover:scale-110">
    <Play className="h-8 w-8" />
  </button>

  {/* Video details */}
  <div className="absolute bottom-4 left-4 right-4">
    <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
    <div className="flex items-center text-amber-300 text-sm">
      <span className="mr-4">{video.duration}</span>
      <span>{video.views} views</span>
    </div>
  </div>
</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Coffee className="h-10 w-10 text-amber-800 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">Follow Us on Instagram</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic">@TanjoreDegreeCoffee</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
               <Image
  src="/placeholder.svg"
  alt={`Instagram post ${index + 1}`}
  width={300}
  height={300}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-amber-100 text-sm">#TanjoreCoffee #CoffeeLovers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20">
              Follow Us on Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Submit Your Photos */}
      <section className="py-20 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <ImageIcon className="h-12 w-12 text-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-6">Share Your Coffee Moments</h2>
            <p className="text-xl text-amber-200 mb-10 italic">
              Tag us in your photos or use #TanjoreDegreeCoffee for a chance to be featured in our gallery
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg">
                Upload Your Photo
              </Button>
              <Button
                variant="outline"
                className="text-amber-200 border-amber-400 hover:bg-amber-800 px-8 py-6 text-lg rounded-full transition-all duration-300"
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

