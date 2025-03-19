import { Coffee, Award, Users, Leaf, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image"; 
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pt-20">
     
      <section className="relative py-24 bg-amber-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="w-full h-full bg-cover bg-fixed"
            style={{
              backgroundImage: "url('/heroabout.jpeg')",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-block mb-6">
            <Coffee className="h-12 w-12 text-amber-400 mx-auto mb-2" />
            <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white custom-serif mb-6">Our Story</h1>
          <p className="max-w-2xl mx-auto text-xl text-amber-200 italic">
            Discover the rich heritage and passion behind Tanjore Degree Coffee
          </p>
        </div>
      </section>

     
      <section className="py-20 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-amber-800 z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-amber-800 z-0"></div>
                <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/about.png"
                    alt="Tanjore Degree Coffee History"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="inline-flex items-center mb-4 bg-amber-800/10 px-4 py-1 rounded-full">
                <Coffee className="h-5 w-5 text-amber-800 mr-2" />
                <span className="text-amber-800 font-medium">Est. 1942</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-6">
                A Legacy of Authentic Flavor
              </h2>
              <div className="w-20 h-1 bg-amber-700 mb-8"></div>
              <p className="text-lg text-amber-950/80 mb-6 leading-relaxed">
                The story of Tanjore Degree Coffee begins in 1942, when our founder Krishnan Iyer started brewing coffee
                using traditional methods passed down through generations in his small shop near the Brihadeeswarar
                Temple in Thanjavur.
              </p>
              <p className="text-lg text-amber-950/80 mb-6 leading-relaxed">
                The term &quot;degree coffee&quot; originates from the Tamil word &quot;degree,&quot; which refers to the
                temperature or the process of heating milk to the right temperature before mixing it with decoction. Our
                founder perfected this technique, creating a unique flavor profile that quickly gained popularity.
              </p>
              <p className="text-lg text-amber-950/80 mb-8 leading-relaxed">
                Today, we continue this legacy by sourcing the finest coffee beans from the hills of Coorg and
                Chikmagalur, and brewing them using the same traditional methods that have delighted coffee lovers for
                generations.
              </p>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Coffee className="h-10 w-10 text-amber-800 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">
              Our Coffee Making Process
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic">
              Discover the art and science behind our perfect cup of Tanjore Degree Coffee
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Bean Selection",
                description: "We carefully select premium Arabica and Robusta beans from the hills of Western Ghats.",
                icon: <Leaf className="h-8 w-8 text-amber-50" />,
                image: "/bean.jpeg",
              },
              {
                title: "Traditional Roasting",
                description: "Our beans are slow-roasted in small batches to bring out their unique flavor profiles.",
                icon: <Coffee className="h-8 w-8 text-amber-50" />,
                image: "/roasting.jpeg",
              },
              {
                title: "Decoction Brewing",
                description: "We use traditional South Indian filter coffee makers to extract the perfect decoction.",
                icon: <Coffee className="h-8 w-8 text-amber-50" />,
                image: "/brewing.jpeg",
              },
              {
                title: "The Perfect Mix",
                description: "Fresh milk is heated to the right 'degree' and mixed with our decoction in golden ratio.",
                icon: <Coffee className="h-8 w-8 text-amber-50" />,
                image: "/perfectmix.jpeg",
              },
            ].map((step, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-800/70 to-amber-950/90 z-10"></div>
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  width={300}
                  height={300}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="relative z-20 p-8 h-full flex flex-col">
                  <div className="bg-amber-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-amber-100 mb-6">{step.description}</p>
                  <div className="mt-auto">
                    <span className="text-amber-300 flex items-center text-sm font-medium">
                      Step {index + 1} <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Award className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-4">Our Values</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              The principles that guide us in preserving and sharing our coffee heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                description:
                  "We stay true to traditional methods and recipes that have been perfected over generations.",
                icon: <Award className="h-10 w-10 text-amber-800" />,
              },
              {
                title: "Quality",
                description:
                  "We never compromise on the quality of our ingredients, from the beans we source to the milk we use.",
                icon: <Award className="h-10 w-10 text-amber-800" />,
              },
              {
                title: "Community",
                description:
                  "We support local farmers and create a welcoming space for coffee lovers to gather and connect.",
                icon: <Users className="h-10 w-10 text-amber-800" />,
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-800 to-amber-900 p-8 rounded-xl shadow-xl hover:shadow-amber-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-amber-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">{value.title}</h3>
                <p className="text-amber-200">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Users className="h-10 w-10 text-amber-800 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 custom-serif mb-4">Meet Our Team</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-800/80 italic">
              The passionate people behind your perfect cup of coffee
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Rajesh Iyer",
                role: "Master Brewer",
                bio: "With 25 years of experience, Rajesh oversees our coffee brewing process, ensuring every cup meets our high standards.",
                image: "/team1.jpeg",
              },
              {
                name: "Priya Venkatesh",
                role: "Head of Operations",
                bio: "Priya ensures that our cafe runs smoothly while maintaining the traditional values we hold dear.",
                image: "/team2.jpeg",
              },
              {
                name: "Karthik Subramanian",
                role: "Bean Sourcing Specialist",
                bio: "Karthik travels across South India to find the perfect coffee beans for our signature blends.",
                image: "/team3.jpeg",
              },
              {
                name: "Lakshmi Narayan",
                role: "Customer Experience Manager",
                bio: "Lakshmi ensures that every customer leaves with a smile and a memorable coffee experience.",
                image: "/team4.jpeg",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-1">{member.name}</h3>
                  <p className="text-amber-700 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold custom-serif mb-4">Experience Our Coffee Heritage</h2>
              <p className="text-amber-200 max-w-2xl">
                Visit our cafe to experience the authentic taste of Tanjore Degree Coffee and immerse yourself in our
                rich coffee culture.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
  <Link href="/visit" passHref>
    <Button 
      className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg"
    >
      Visit Us
    </Button>
  </Link>
  <Link href="/menu" passHref>
    <Button
      variant="outline"
      className="text-amber-800 bg-white hover:bg-amber-50 hover:text-amber-900 border-amber-400 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105"
    >
      View Menu
    </Button>
  </Link>
</div>
          </div>
        </div>
      </section>
    </div>
  );
}