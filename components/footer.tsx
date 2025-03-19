import Link from "next/link";
import { Coffee, ChevronRight, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-amber-900 to-amber-950 text-white py-16 relative overflow-hidden">
    
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=300&width=300')] bg-repeat opacity-5"></div>
      
     
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-800/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-700/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
         
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6 group">
              <div className="bg-amber-800/30 p-3 rounded-full mr-3 transition-all duration-300 group-hover:rotate-12">
                <Coffee className="h-8 w-8 text-amber-300" />
              </div>
              <h3 className="text-2xl font-bold text-gradient bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Tanjore Degree Coffee
              </h3>
            </div>
            <p className="text-amber-200/80 mb-8 leading-relaxed">
              Bringing the authentic taste of traditional South Indian coffee to coffee lovers everywhere. 
              Crafted with care, served with passion since 1952.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="h-5 w-5 text-amber-200" />, name: "Facebook" },
                { icon: <Twitter className="h-5 w-5 text-amber-200" />, name: "Twitter" },
                { icon: <Instagram className="h-5 w-5 text-amber-200" />, name: "Instagram" },
                { icon: <Youtube className="h-5 w-5 text-amber-200" />, name: "Youtube" }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="bg-amber-800/30 hover:bg-amber-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-900/20"
                  aria-label={social.name}
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        
          <div>
            <h4 className="text-xl font-semibold mb-6 text-amber-100 relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-amber-500 after:left-0 after:-bottom-2 after:rounded-full">
              Quick Links
            </h4>
            <ul className="space-y-4 mt-8">
              {["Home", "About Us", "Menu", "Gallery", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-amber-300/80 hover:text-amber-100 transition-all duration-300 flex items-center group"
                  >
                    <span className="bg-amber-800/30 p-1 rounded mr-3 transition-all duration-300 group-hover:bg-amber-700/50">
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         
          <div>
  <h4 className="text-xl font-semibold mb-6 text-amber-100 relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-amber-500 after:left-0 after:-bottom-2 after:rounded-full">
    Contact Us
  </h4>
  <ul className="space-y-5 mt-8">
    <li className="flex items-start group">
      <span className="bg-amber-800/30 p-2 rounded mr-3 mt-1 transition-all duration-300 group-hover:bg-amber-700/50">
        <MapPin className="h-5 w-5 text-amber-300" />
      </span>
      <span className="text-amber-200/80 group-hover:text-amber-100 transition-colors">
        123 Temple Street, Thanjavur, Tamil Nadu, India - 613001
      </span>
    </li>
    <li className="flex items-start group">
      <span className="bg-amber-800/30 p-2 rounded mr-3 mt-1 transition-all duration-300 group-hover:bg-amber-700/50">
        <Phone className="h-5 w-5 text-amber-300" />
      </span>
      <a
        href="tel:+919876543210"
        className="text-amber-200/80 group-hover:text-amber-100 transition-colors no-underline"
      >
        +91 98765 43210
      </a>
    </li>
    <li className="flex items-start group">
      <span className="bg-amber-800/30 p-2 rounded mr-3 mt-1 transition-all duration-300 group-hover:bg-amber-700/50">
        <Mail className="h-5 w-5 text-amber-300" />
      </span>
      <a
        href="mailto:info@tanjorecoffee.com"
        className="text-amber-200/80 group-hover:text-amber-100 transition-colors no-underline"
      >
        info@tanjorecoffee.com
      </a>
    </li>
  </ul>
</div>

         
          <div>
            <h4 className="text-xl font-semibold mb-6 text-amber-100 relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-amber-500 after:left-0 after:-bottom-2 after:rounded-full">
              Opening Hours
            </h4>
            <div className="bg-amber-900/30 rounded-lg p-5 mt-8 backdrop-blur-sm border border-amber-800/20 shadow-lg">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-amber-400 mr-2" />
                <span className="text-amber-100 font-medium">We&apos;re Open</span>
              </div>
              <ul className="space-y-3 text-amber-200/80">
                <li className="flex justify-between items-center pb-2 border-b border-amber-800/20">
                  <span>Monday - Friday:</span>
                  <span className="font-medium text-amber-300">6:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-amber-800/20">
                  <span>Saturday - Sunday:</span>
                  <span className="font-medium text-amber-300">6:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Public Holidays:</span>
                  <span className="font-medium text-amber-300">7:00 AM - 9:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

       
        <div className="mt-16 pt-8 border-t border-amber-800/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-400/80 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Tanjore Degree Coffee. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-amber-300/70 hover:text-amber-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-amber-300/70 hover:text-amber-200 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;