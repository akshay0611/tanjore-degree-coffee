import { Code, Github, Linkedin, Mail, Coffee, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DeveloperPage() {
  const techStack = [
    { name: "Next.js", category: "Framework" },
    { name: "React", category: "Library" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Supabase", category: "Backend" },
    { name: "Gemini AI", category: "AI Integration" },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-amber-950">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-950" />
        </div>
        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-block mb-6">
            <Code className="h-12 w-12 text-amber-400 mx-auto mb-2" />
            <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white custom-serif mb-6">
            Meet the Developer
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-amber-200 italic">
            The person behind this digital experience
          </p>
        </div>
      </section>

      {/* About Developer Section */}
      <section className="py-20 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-amber-800 z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-amber-800 z-0"></div>
                <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/akshayheadshot.jpg"
                    alt="Akshay"
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="inline-flex items-center mb-4 bg-amber-800/10 px-4 py-1 rounded-full">
                <Sparkles className="h-5 w-5 text-amber-800 mr-2" />
                <span className="text-amber-800 font-medium">Full Stack Developer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-6">
                Hi, I&apos;m Akshay
              </h2>
              <div className="w-20 h-1 bg-amber-700 mb-8"></div>
              <p className="text-lg text-amber-950/80 mb-6 leading-relaxed">
                I&apos;m a passionate developer who loves building beautiful, functional web applications. 
                This project showcases my skills in modern web development, combining elegant design 
                with powerful functionality.
              </p>
              <p className="text-lg text-amber-950/80 mb-8 leading-relaxed">
                I built this website to demonstrate my expertise in creating immersive digital experiences 
                that blend aesthetics with performance. From the responsive design to the AI-powered chatbot, 
                every element has been crafted with attention to detail.
              </p>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-900 text-white px-6 py-3 rounded-full hover:bg-amber-800 transition-all duration-300"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
                <a
                  href="mailto:your.email@example.com"
                  className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-6 py-3 rounded-full hover:bg-amber-200 transition-all duration-300"
                >
                  <Mail className="h-5 w-5" />
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Code className="h-10 w-10 text-amber-800 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">
              Tech Stack Used
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic">
              The technologies powering this project
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <h3 className="text-lg font-bold text-amber-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-amber-700">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Coffee className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-4">Project Highlights</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              Key features implemented in this project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Responsive Design",
                description: "Fully responsive layout that looks great on all devices, from mobile to desktop.",
              },
              {
                title: "AI Chatbot",
                description: "Integrated Gemini AI-powered chatbot for interactive customer support.",
              },
              {
                title: "Modern UI/UX",
                description: "Clean, modern interface with smooth animations and intuitive navigation.",
              },
              {
                title: "Authentication",
                description: "Secure user authentication system powered by Supabase.",
              },
              {
                title: "Performance Optimized",
                description: "Built with Next.js for optimal performance and SEO.",
              },
              {
                title: "Accessibility",
                description: "Designed with accessibility in mind for an inclusive experience.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-800 to-amber-900 p-8 rounded-xl shadow-xl hover:shadow-amber-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-amber-100 mb-4">{feature.title}</h3>
                <p className="text-amber-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold custom-serif mb-4">Interested in Working Together?</h2>
              <p className="text-amber-200 max-w-2xl">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:your.email@example.com">
                <Button className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg">
                  Get in Touch
                </Button>
              </a>
              <Link href="/">
                <Button
                  variant="outline"
                  className="text-amber-800 bg-white hover:bg-amber-50 hover:text-amber-900 border-amber-400 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
