import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const carouselItems = [
  {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80",
    title: "Medical Records Management",
    description: "Securely store and access your medical records from multiple hospitals in one place"
  },
  {
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80",
    title: "Community Support",
    description: "Connect with others, share experiences, and find support in our health communities"
  },
  {
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80",
    title: "Medication Tracking",
    description: "Never miss a dose with our intelligent medication reminder system"
  },
  {
    image: "https://images.unsplash.com/photo-1576671081837-49b1a991dd54?auto=format&fit=crop&q=80",
    title: "AI-Powered Health Predictions",
    description: "Get instant insights about your symptoms with our advanced AI system"
  }
];

const benefits = [
  {
    title: "Centralized Health Records",
    description: "Keep all your medical records in one secure place"
  },
  {
    title: "24/7 Community Support",
    description: "Connect with others facing similar health challenges"
  },
  {
    title: "Smart Medication Management",
    description: "Never miss important medications with our reminder system"
  },
  {
    title: "AI Health Assistant",
    description: "Get quick insights about your symptoms"
  }
];

const reviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "This platform has revolutionized how I manage my health records!"
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "The community support has been invaluable during my recovery."
  },
  {
    name: "Emily Davis",
    rating: 4,
    comment: "The medication tracker has helped me stay consistent with my treatment."
  },
  // Add more reviews as needed
];

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            One Health Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Connecting Care, Community & Cure
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
          >
            {carouselItems.map((item, index) => (
              <div key={index} className="relative h-[500px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-white text-center px-4">
                    <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                    <p className="text-xl">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose One Health Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;