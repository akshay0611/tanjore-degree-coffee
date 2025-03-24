"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Camera, ImageOff, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

const collections = [
  {
    slug: "art-of-coffee-making",
    title: "The Art of Coffee Making",
    description: "A step-by-step visual journey through our traditional coffee brewing process.",
    count: 12,
    accent: "from-amber-400 to-amber-600",
  },
  {
    slug: "cafe-seasons",
    title: "Our Cafe Through the Seasons",
    description: "Experience the changing ambiance of our cafe throughout the year.",
    count: 18,
    accent: "from-amber-500 to-amber-700",
  },
  {
    slug: "coffee-farm-to-cup",
    title: "Coffee Farm to Cup",
    description: "Follow the journey of our coffee beans from the plantations to your cup.",
    count: 15,
    accent: "from-amber-600 to-amber-800",
  },
];

export default function CollectionPage() {
  const { collection } = useParams();
  const [selectedCollection, setSelectedCollection] = useState<(typeof collections[0] & { images: string[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCollectionData = async () => {
      setLoading(true);
      setError(null);

      const foundCollection = collections.find((c) => c.slug === collection);
      if (!foundCollection) {
        setSelectedCollection(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.storage
          .from("gallery")
          .list(foundCollection.slug, {
            limit: foundCollection.count,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;

        const imageUrls = data?.map((file) =>
          supabase.storage
            .from("gallery")
            .getPublicUrl(`${foundCollection.slug}/${file.name}`).data.publicUrl
        ) || [];

        setSelectedCollection({
          ...foundCollection,
          images: imageUrls,
        });
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collection]);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedCollection?.images &&
      selectedImageIndex < selectedCollection.images.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-amber-900">Loading Collection...</h1>
        </div>
      </div>
    );
  }

  if (!selectedCollection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Collection Not Found</h1>
          <Link href="/gallery">
            <Button className="bg-amber-700 text-white hover:bg-amber-800">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Error</h1>
          <p className="text-amber-800 mb-4">{error}</p>
          <Link href="/gallery">
            <Button className="bg-amber-700 text-white hover:bg-amber-800">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayItems = Array.from({ length: selectedCollection.count }, (_, index) => {
    return index < selectedCollection.images.length ? selectedCollection.images[index] : null;
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300 rounded-full opacity-20 blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10 py-24">
        <div className="text-center mb-12">
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
          <h1 className="text-3xl md:text-5xl font-bold text-amber-900 mb-4">{selectedCollection.title}</h1>
          <p className="max-w-2xl mx-auto text-lg text-amber-800/80">{selectedCollection.description}</p>
          <div className="mt-6">
            <Link href="/gallery">
              <Button className="bg-white text-amber-800 border-2 border-amber-700 rounded-full shadow-md hover:shadow-lg hover:bg-amber-50 transition-all duration-300">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Gallery
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayItems.map((image, index) =>
            image ? (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img
                  src={image}
                  alt={`${selectedCollection.title} - Photo ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-white text-amber-900 px-3 py-1 rounded-full text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Photo {index + 1}
                </div>
                <div className={`absolute top-2 right-2 w-6 h-6 bg-gradient-to-br ${selectedCollection.accent} rounded-bl-lg`}></div>
              </div>
            ) : (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden bg-amber-100/50 border-2 border-amber-200/50 flex items-center justify-center h-64"
              >
                <ImageOff className="h-12 w-12 text-amber-400" />
                <span className="absolute bottom-4 left-4 bg-white text-amber-900 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                  Photo {index + 1}
                </span>
              </div>
            )
          )}
        </div>

        {/* Modal */}
        {modalOpen && selectedImageIndex !== null && selectedCollection.images[selectedImageIndex] && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation Arrows */}
              {selectedCollection.images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    disabled={selectedImageIndex === 0}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors ${
                      selectedImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={selectedImageIndex === selectedCollection.images.length - 1}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors ${
                      selectedImageIndex === selectedCollection.images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image */}
              <img
                src={selectedCollection.images[selectedImageIndex]}
                alt={`${selectedCollection.title} - Photo ${selectedImageIndex + 1}`}
                className="w-full h-[70vh] object-contain"
              />

              {/* Caption */}
              <div className="p-4 text-center bg-amber-50">
                <p className="text-amber-900 font-medium">
                  {selectedCollection.title} - Photo {selectedImageIndex + 1} of {selectedCollection.images.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}