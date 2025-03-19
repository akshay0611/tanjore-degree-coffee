import { Coffee, MapPin, Clock, Phone, Mail, MessageSquare, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';


export default function ContactPage() {
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
            <MessageSquare className="h-12 w-12 text-amber-400 mx-auto mb-2" />
            <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white custom-serif mb-6">Contact Us</h1>
          <p className="max-w-2xl mx-auto text-xl text-amber-200 italic">
            We&apos;d love to hear from you. Reach out to us with any questions or feedback.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Visit Us",
                description: "123 Temple Street, Thanjavur, Tamil Nadu, India - 613001",
                icon: <MapPin className="h-8 w-8 text-amber-800" />,
              },
              {
                title: "Opening Hours",
                description: "Monday - Sunday: 6:00 AM - 10:00 PM\nPublic Holidays: 7:00 AM - 9:00 PM",
                icon: <Clock className="h-8 w-8 text-amber-800" />,
              },
              {
                title: "Get in Touch",
                description: "Phone: +91 98765 43210\nEmail: info@tanjorecoffee.com",
                icon: <Phone className="h-8 w-8 text-amber-800" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-amber-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Contact Form */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="text-left mb-10">
                <div className="inline-flex items-center mb-4 bg-amber-800/10 px-4 py-1 rounded-full">
                  <MapPin className="h-5 w-5 text-amber-800 mr-2" />
                  <span className="text-amber-800 font-medium">Find Us</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">Our Location</h2>
                <p className="text-lg text-amber-800/80">
                  We&apos;re located in the heart of Thanjavur, near the historic Brihadeeswarar Temple.
                </p>
              </div>

              <div className="aspect-square md:aspect-video lg:aspect-square bg-amber-100 rounded-xl overflow-hidden relative shadow-xl mb-8">
                {/* Map placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-800">
                  <MapPin className="h-12 w-12 mr-2" />
                  Interactive Map
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Getting Here</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-amber-200 rounded-full p-1 mr-3 mt-1">
                      <span className="block h-2 w-2 bg-amber-800 rounded-full"></span>
                    </div>
                    <span className="text-gray-700">5 minute walk from Brihadeeswarar Temple</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-200 rounded-full p-1 mr-3 mt-1">
                      <span className="block h-2 w-2 bg-amber-800 rounded-full"></span>
                    </div>
                    <span className="text-gray-700">10 minute drive from Thanjavur Railway Station</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-200 rounded-full p-1 mr-3 mt-1">
                      <span className="block h-2 w-2 bg-amber-800 rounded-full"></span>
                    </div>
                    <span className="text-gray-700">Ample parking available for customers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="text-left mb-10">
                <div className="inline-flex items-center mb-4 bg-amber-800/10 px-4 py-1 rounded-full">
                  <Mail className="h-5 w-5 text-amber-800 mr-2" />
                  <span className="text-amber-800 font-medium">Get in Touch</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">Send Us a Message</h2>
                <p className="text-lg text-amber-800/80">Have questions or feedback? We&apos;d love to hear from you.</p>
              </div>

              <form className="bg-white p-8 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-amber-800 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-amber-800 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                    placeholder="Tell us what you'd like to know..."
                  ></textarea>
                </div>

                <Button className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50 py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-900/20 text-lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <MessageSquare className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-4">Frequently Asked Questions</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              Find answers to common questions about our coffee and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "What makes Tanjore Degree Coffee special?",
                answer:
                  "Tanjore Degree Coffee is special because of its traditional brewing method where fresh milk is heated to a specific 'degree' before being mixed with coffee decoction. We use high-quality Arabica and Robusta beans sourced from the Western Ghats, and follow time-honored techniques passed down through generations.",
              },
              {
                question: "Do you offer coffee beans for home brewing?",
                answer:
                  "Yes, we sell our signature coffee bean blends in our cafe. You can purchase them in various quantities, and we also offer coffee brewing equipment like traditional South Indian coffee filters.",
              },
              {
                question: "Can I book your space for private events?",
                answer:
                  "We offer our space for private events such as coffee tastings, small gatherings, and corporate meetings. Please contact us at least two weeks in advance to check availability and discuss your requirements.",
              },
              {
                question: "Do you offer vegetarian and vegan food options?",
                answer:
                  "We have a wide range of vegetarian South Indian snacks and desserts. We also offer some vegan options and are happy to accommodate dietary restrictions when possible. Just ask our staff for recommendations.",
              },
              {
                question: "Is there Wi-Fi available at your cafe?",
                answer:
                  "Yes, we provide complimentary high-speed Wi-Fi for all our customers. Simply ask our staff for the password when you visit.",
              },
            ].map((faq, index) => (
              <div key={index} className="mb-6 bg-amber-800/50 rounded-xl overflow-hidden">
                <div className="p-6 flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-bold text-amber-100">{faq.question}</h3>
                  <ChevronDown className="h-6 w-6 text-amber-400" />
                </div>
                <div className="px-6 pb-6">
                  <p className="text-amber-200">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-amber-50">
  <div className="container px-4 mx-auto">
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-800 to-amber-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="p-12 text-center">
       
        <Coffee className="h-12 w-12 text-amber-400 mx-auto mb-6 animate-bounce" />
       
        <h2 className="text-3xl font-bold text-white custom-serif mb-4">
          Subscribe to Our Newsletter
        </h2>
       
        <p className="text-amber-200 mb-8 max-w-2xl mx-auto">
          Stay updated with our latest offerings, events, and coffee tips. We promise not to spam your inbox!
        </p>
       
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto items-center">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/10 backdrop-blur-sm text-white placeholder-amber-200 transition-all duration-300 hover:bg-white/20"
          />
          <div className="mt-1 sm:mt-0">
            <Button className="bg-amber-400 hover:bg-amber-300 text-amber-900 px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105">
              Subscribe
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
  <div className="container px-4 mx-auto">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <h2 className="text-3xl font-bold custom-serif mb-4">Connect With Us on Social Media</h2>
        <p className="text-amber-200 max-w-2xl">
          Follow us on social media to stay updated with our latest offerings and events.
        </p>
      </div>
      <div className="flex gap-4">
        {[
          { name: "facebook", icon: <Facebook className="h-6 w-6 text-amber-200" /> },
          { name: "twitter", icon: <Twitter className="h-6 w-6 text-amber-200" /> },
          { name: "instagram", icon: <Instagram className="h-6 w-6 text-amber-200" /> },
          { name: "youtube", icon: <Youtube className="h-6 w-6 text-amber-200" /> }
        ].map((social) => (
          <a
            key={social.name}
            href="#"
            className="bg-amber-800/50 hover:bg-amber-700 p-3 rounded-full transition-colors duration-300"
          >
            <span className="sr-only">{social.name}</span>
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

