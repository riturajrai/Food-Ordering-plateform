import React from "react";
import {
  FaUtensils,
  FaHeart,
  FaUsers,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            About FoodExpress
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            We're passionate about delivering delicious meals from top restaurants to your doorstep, making every dining experience memorable and convenient.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2018, FoodExpress began with a simple mission: to connect food lovers with the best culinary experiences in their city. What started as a small startup in Mumbai has grown into a trusted platform serving thousands of customers across India.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our journey is driven by a love for food and a commitment to quality. We partner with top restaurants to ensure every order is prepared with care and delivered fresh to your door. From local favorites to international cuisines, we bring the world of flavors to you.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At FoodExpress, we believe in more than just delivery—we're about creating moments of joy, whether it's a quick lunch, a family dinner, or a late-night craving.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="FoodExpress restaurant partner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're dedicated to revolutionizing food delivery with exceptional service and quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaUtensils className="text-orange-600 text-2xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver high-quality, delicious meals from trusted restaurants to customers across India, ensuring convenience, reliability, and satisfaction with every order.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaHeart className="text-orange-600 text-2xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become India's leading food delivery platform, fostering a community of food lovers and restaurants united by a passion for great taste and seamless service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide us in delivering exceptional service every day.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Quality",
                description: "We partner with top restaurants to ensure every meal meets the highest standards.",
                icon: FaUtensils,
              },
              {
                title: "Customer First",
                description: "Your satisfaction is our priority, from order to delivery.",
                icon: FaHeart,
              },
              {
                title: "Community",
                description: "We support local businesses and build strong connections with our partners.",
                icon: FaUsers,
              },
              {
                title: "Innovation",
                description: "We leverage technology to make food delivery faster and more convenient.",
                icon: FaUtensils,
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-orange-600 text-xl" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our dedicated team works tirelessly to ensure your FoodExpress experience is exceptional.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Amit Sharma",
                role: "CEO & Founder",
                image: "https://images.unsplash.com/photo-1506794778202-6d6d6f9f6f9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              },
              {
                name: "Priya Patel",
                role: "Head of Operations",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              },
              {
                name: "Rahul Desai",
                role: "Chief Technology Officer",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              },
              {
                name: "Sneha Gupta",
                role: "Customer Success Manager",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the FoodExpress Family</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you're a customer, restaurant partner, or delivery hero, we invite you to join our mission of delivering happiness through food.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-orange-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
            aria-label="Contact us to join FoodExpress"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Follow us on social media for the latest updates, offers, and more!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition duration-300"
              aria-label="Follow us on Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://instagram.com/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-full shadow-md text-pink-600 hover:bg-pink-50 transition duration-300"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://twitter.com/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-full shadow-md text-blue-400 hover:bg-blue-50 transition duration-300"
              aria-label="Follow us on Twitter"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com/company/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-full shadow-md text-blue-700 hover:bg-blue-50 transition duration-300"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}