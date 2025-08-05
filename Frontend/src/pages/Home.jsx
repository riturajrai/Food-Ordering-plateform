import React, { useState, useMemo, useEffect } from 'react';
import { FaPizzaSlice, FaHamburger, FaIceCream, FaLeaf, FaStar } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { GiChickenOven, GiFullPizza } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FoodDelivery from '../assets/b4e9b621-6790-4195-8f03-33b97d14e2be_Upto607.avif';
import DiscountImage from '../assets/file_000000004634620aa4b181644ff04115.png';

const MenuImage = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full h-48 sm:h-64">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      )}
      {hasError ? (
        <img
          src="https://via.placeholder.com/150?text=Image+Not+Found"
          alt="Placeholder"
          className="w-full h-48 sm:h-64 object-cover rounded-t-xl"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-48 sm:h-64 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

const categories = [
  { name: 'Pizza', icon: <FaPizzaSlice size={28} />, color: 'bg-red-100' },
  { name: 'Burgers', icon: <FaHamburger size={28} />, color: 'bg-yellow-100' },
  { name: 'Desserts', icon: <FaIceCream size={28} />, color: 'bg-pink-100' },
  { name: 'Healthy', icon: <FaLeaf size={28} />, color: 'bg-green-100' },
  { name: 'Indian', icon: <GiChickenOven size={28} />, color: 'bg-orange-100' },
  { name: 'Italian', icon: <GiFullPizza size={28} />, color: 'bg-blue-100' },
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    comment: 'The food was delicious and delivered right on time! Will definitely order again.',
    rating: 5,
    date: '12 May 2025',
  },
  {
    name: 'Priya Patel',
    comment: 'Amazing variety and quality. The pizza was just perfect!',
    rating: 4,
    date: '28 April 2025',
  },
  {
    name: 'Vikram Singh',
    comment: 'Fast delivery and fresh food. Highly recommended!',
    rating: 5,
    date: '5 May 2025',
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dishesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes`);
        console.log('Fetched dishes:', dishesResponse.data);
        const dishesArray = Array.isArray(dishesResponse.data) ? dishesResponse.data : dishesResponse.data.dishes || [];
        if (!Array.isArray(dishesArray)) {
          throw new Error('Dishes data is not an array');
        }
        setDishes(dishesArray.map(item => ({
          ...item,
          image_url: item.image_url || item.image,
          is_veg: item.is_veg !== undefined ? item.is_veg : item.isVeg,
          price: Number(item.price),
          description: item.description || '',
          category: item.category || 'all',
        })));
      } catch (err) {
        console.error('Error fetching dishes:', err.response?.data || err.message);
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      return activeCategory === 'All' || (dish.category && dish.category.toLowerCase() === activeCategory.toLowerCase());
    });
  }, [activeCategory, dishes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600">Error</h3>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-24 sm:py-32">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight"
            >
              Delicious Food <br /> Delivered Fast
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl max-w-lg leading-relaxed mb-8 mx-auto md:mx-0"
            >
              Order your favorite meals from top restaurants anytime, anywhere. Enjoy fast delivery and exclusive offers!
            </motion.p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="inline-block bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition duration-300"
                aria-label="Explore our menu"
              >
                Explore Menu
              </Link>
            </motion.div>
          </div>
          <div className="flex-1">
            <motion.img
              src={FoodDelivery}
              alt="Food delivery"
              className="rounded-2xl shadow-xl w-full object-cover max-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </section>
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '500+', label: 'Restaurant Partners' },
              { value: '50+', label: 'Cities' },
              { value: '1M+', label: 'Deliveries' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-orange-600 text-3xl font-bold">{stat.value}</div>
                <div className="text-gray-600 mt-2 text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Explore Our Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Discover a wide variety of cuisines to satisfy your cravings
            </p>
          </div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
            <motion.div
              onClick={() => setActiveCategory('All')}
              className={`flex flex-col items-center flex-shrink-0 w-32 md:w-auto p-4 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition duration-300 ${
                activeCategory === 'All' ? 'bg-orange-100 border-2 border-orange-600' : 'bg-white'
              }`}
              role="button"
              aria-label="Select All categories"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <MdDeliveryDining size={28} className="text-orange-600" aria-hidden="true" />
              </div>
              <span className="mt-2 font-semibold text-sm sm:text-base">All</span>
            </motion.div>
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center flex-shrink-0 w-32 md:w-auto p-4 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition duration-300 ${
                  activeCategory === cat.name ? 'bg-orange-100 border-2 border-orange-600' : cat.color
                }`}
                role="button"
                aria-label={`Select ${cat.name} category`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-3 rounded-full">{cat.icon}</div>
                <span className="mt-2 font-semibold text-sm sm:text-base">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Featured Dishes</h2>
              <p className="text-gray-600 text-base sm:text-lg">Our top picks for you</p>
            </div>
            <Link
              to="/menu"
              className="text-orange-600 font-semibold hover:underline text-base sm:text-lg"
              aria-label="View all dishes"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredDishes.slice(0, 4).map((dish, i) => (
              <motion.div
                key={dish.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/food/${dish.id}`} className="block">
                  <div className="relative">
                    <MenuImage src={dish.image_url} alt={dish.name} />
                    <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      {dish.is_veg ? (
                        <span className="text-green-600 mr-1">●</span>
                      ) : (
                        <span className="text-red-600 mr-1">●</span>
                      )}
                      {dish.is_veg ? 'VEG' : 'NON-VEG'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg sm:text-xl tracking-tight group-hover:text-orange-600 transition duration-300">{dish.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-2">{dish.description}</p>
                    <div className="flex items-center mt-3">
                      <p className="text-orange-600 font-bold text-lg sm:text-xl">₹{typeof dish.price === 'number' && !isNaN(dish.price) ? dish.price.toFixed(2) : 'N/A'}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 md:p-12 rounded-2xl shadow-lg bg-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-4 rounded-xl shadow-lg flex justify-center items-center">
              <img
                src={DiscountImage}
                alt="Discount Offer"
                className="max-w-xs md:max-w-md rounded-lg"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition duration-300"
                aria-label="Order now to get discount"
              >
                Order Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Get your favorite food in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Food',
                description: 'Browse our menu and select your favorite dishes',
              },
              {
                step: '2',
                title: 'Delivery or Pickup',
                description: 'Choose delivery to your door or pickup at the restaurant',
              },
              {
                step: '3',
                title: 'Enjoy Your Meal',
                description: 'Receive and enjoy your delicious food!',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Hear from people who love our services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-sm sm:text-base leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">{testimonial.name}</span>
                  <span className="text-gray-500 text-xs sm:text-sm">{testimonial.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-orange-600 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Download Our Mobile App</h2>
              <p className="text-lg sm:text-xl max-w-lg mb-6 leading-relaxed mx-auto md:mx-0">
                Enjoy exclusive app-only offers and seamless ordering with just a few taps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center transition duration-300"
                  aria-label="Download FoodExpress app on the App Store"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.24 1.83-.93 2.76-.9 1.17.03 2.27.49 3.08 1.42-2.7 1.64-2.04 5.62.42 6.84-.5 1.07-.78 2.19-.95 3.36-.32 2.1-1.39 2.99-2.39 2.85zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center transition duration-300"
                  aria-label="Download FoodExpress app on Google Play"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.3-2.3 2.3-2.29 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.29-8.49-8.51z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://source.unsplash.com/400x600/?mobile,app"
                alt="FoodExpress Mobile App"
                className="rounded-2xl shadow-xl max-h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}