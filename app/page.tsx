import { Coffee, MapPin, Clock, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section*/}
     <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Decorative Divider */}
      <div className="relative h-24 bg-amber-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=2000')] bg-repeat-x opacity-10"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Coffee className="h-12 w-12 text-amber-800/30" />
        </div>
      </div>

      {/* Menu Section */}
      <MenuSection />

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-amber-900 to-amber-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-repeat opacity-5"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Star className="h-10 w-10 text-amber-400 fill-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-4xl font-bold custom-serif mb-4">What Our Customers Say</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              Join the thousands of coffee lovers who have experienced our authentic brews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The most authentic degree coffee I&apos;ve had outside of Thanjavur. The aroma and taste take me back to my childhood.",
                name: "Ramesh Kumar",
                location: "Chennai",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                text: "Their filter coffee is exceptional! The perfect balance of strong decoction and creamy milk. I visit every weekend.",
                name: "Priya Venkatesh",
                location: "Bangalore",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                text: "Not just the coffee, their traditional snacks are amazing too. The perfect place to experience South Indian coffee culture.",
                name: "Arun Nair",
                location: "Mumbai",
                image: "/placeholder.svg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-800 to-amber-900 p-8 rounded-xl shadow-xl hover:shadow-amber-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 italic text-amber-100">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center">
  <div className="mr-4">
    <Image
      src={testimonial.image || "/placeholder.svg"}
      alt={testimonial.name}
      width={48} 
      height={48}
      className="h-12 w-12 rounded-full object-cover border-2 border-amber-400"
    />
  </div>
  <div>
    <div className="font-semibold text-amber-100">{testimonial.name}</div>
    <div className="text-amber-300 text-sm">{testimonial.location}</div>
  </div>
</div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Location & Contact */}
<section className="py-24 bg-amber-50">
  <div className="container px-4 mx-auto">
    <div className="text-center mb-16">
      <div className="inline-block mb-4">
        <MapPin className="h-10 w-10 text-amber-800 mx-auto mb-2" />
        <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
      </div>
      <h2 className="text-4xl font-bold text-amber-900 custom-serif mb-4">Visit Us</h2>
      <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic">
        Come experience the authentic taste of Tanjore Degree Coffee at our location
      </p>
    </div>

    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-xl">
        <h3 className="text-2xl font-semibold text-amber-900 mb-6 custom-serif">Our Location</h3>

        <div className="mb-8 aspect-video bg-amber-100 rounded-lg overflow-hidden relative group">
          {/* Google Map Embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6304190077656!2d79.13149731480196!3d10.786999992311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baab89e7d8b1d4f%3A0xe2e8b8e72a9e4e55!2sThanjavur%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sus!4v1677654321987!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>

        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Address</h4>
              <p className="text-amber-700">123 Temple Street, Thanjavur, Tamil Nadu, India - 613001</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Opening Hours</h4>
              <p className="text-amber-700">Monday - Sunday: 6:00 AM - 10:00 PM</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <Phone className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Contact</h4>
              <p>
                <a 
                  href="tel:+919876543210" 
                  className="text-amber-700 hover:text-amber-600 transition-colors duration-200"
                >
                  +91 98765 43210
                </a>
              </p>
              <p>
                <a 
                  href="mailto:info@tanjorecoffee.com" 
                  className="text-amber-700 hover:text-amber-600 transition-colors duration-200"
                >
                  info@tanjorecoffee.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-xl">
        <h3 className="text-2xl font-semibold text-amber-900 mb-6 custom-serif">Send Us a Message</h3>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-amber-800 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-amber-800 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
              placeholder="Your message here..."
            ></textarea>
          </div>

          <Button className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50 py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-900/20">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  </div>
</section>

      {/* Gallery Section */}
      <section className="py-24 bg-amber-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Coffee className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-4xl font-bold text-amber-50 custom-serif mb-4">Coffee Gallery</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              A glimpse into our coffee-making process and ambiance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[...Array(8)].map((_, index) => (
    <div
      key={index}
      className={`overflow-hidden rounded-lg ${
        index === 0 || index === 7 ? "col-span-2 row-span-2" : ""
      }`}
    >
      <Image
        src={`/placeholder.svg`}
        alt={`Gallery image ${index + 1}`}
        width={index === 0 || index === 7 ? 600 : 300}
        height={index === 0 || index === 7 ? 600 : 300}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-800 to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 custom-serif">Experience the Perfect Cup Today</h2>
            <p className="text-xl text-amber-200 mb-10 italic">
              Join us for a traditional South Indian coffee experience that will awaken your senses
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg"
              >
                Order Online
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-amber-800 bg-white hover:bg-amber-50 hover:text-amber-900 border-amber-400 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105"
              >
                Book a Table
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}