// src/components/Menu.js
import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFilter, FaPizzaSlice, FaHamburger, FaIceCream, FaLeaf } from 'react-icons/fa';
import { GiChickenOven, GiFullPizza } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
  { id: 'all', name: 'All Items', icon: <FaFilter className="mr-1" size={14} /> },
  { id: 'pizza', name: 'Pizza', icon: <FaPizzaSlice className="mr-1" size={14} /> },
  { id: 'burger', name: 'Burgers', icon: <FaHamburger className="mr-1" size={14} /> },
  { id: 'healthy', name: 'Healthy', icon: <FaLeaf className="mr-1" size={14} /> },
  { id: 'dessert', name: 'Desserts', icon: <FaIceCream className="mr-1" size={14} /> },
  { id: 'indian', name: 'Indian', icon: <GiChickenOven className="mr-1" size={14} /> },
  { id: 'italian', name: 'Italian', icon: <GiFullPizza className="mr-1" size={14} /> },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dishesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes`);
        const dishesArray = Array.isArray(dishesResponse.data) ? dishesResponse.data : dishesResponse.data.dishes || [];
        if (!Array.isArray(dishesArray)) {
          throw new Error('Dishes data is not an array');
        }
        setDishes(
          dishesArray.map((item) => ({
            ...item,
            image_url: item.image_url || item.image,
            is_veg: item.is_veg !== undefined ? item.is_veg : item.isVeg,
            price: Number(item.price),
            description: item.description || '',
            category: item.category || 'all',
          }))
        );

        const offersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers`);
        setOffers(offersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return dishes.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (item.category && item.category.toLowerCase() === activeCategory.toLowerCase());
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, dishes]);

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
    <div className="min-h-screen bg-gray-100 font-sans">
      <section className="py-12 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Our Menu</h1>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dishes..."
                  className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  aria-label="Search for dishes"
                  id="search-input"
                />
              </div>
              <motion.button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
              >
                <FaFilter className="mr-2" />
                Filters
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8 sm:hidden"
              >
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setIsFilterOpen(false);
                      }}
                      className={`px-2 py-1.5 text-xs font-medium rounded flex items-center ${
                        activeCategory === category.id
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      role="tab"
                      aria-label={`Filter by ${category.name}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.icon}
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden sm:flex overflow-x-auto gap-2 bg-gray-200 rounded-lg p-1 snap-x snap-mandatory scrollbar-hide mb-8">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="tab"
                aria-label={`Filter by ${category.name}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </div>
          {offers && (
            <motion.div
              className="mb-8 p-6 bg-orange-50 rounded-2xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-orange-600 mb-2">
                {offers.title || 'Special Combo Deals!'}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {offers.message || `Save up to ${offers.discount || 30}% on our curated meal combos`}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/offers"
                  className="inline-block mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300 text-sm"
                  aria-label="View special offers"
                >
                  View Offers
                </Link>
              </motion.div>
            </motion.div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100 group"
                >
                  <Link to={`/food/${item.id}`} className="block">
                    <div className="relative">
                      <MenuImage src={item.image_url} alt={item.name} />
                      <div className="absolute top-2 left-2 bg-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center">
                        {item.is_veg ? (
                          <span className="text-green-600 mr-1">●</span>
                        ) : (
                          <span className="text-red-600 mr-1">●</span>
                        )}
                        {item.is_veg ? 'VEG' : 'NON-VEG'}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-semibold truncate group-hover:text-orange-600 transition duration-300">{item.name}</h3>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
                      <div className="p-3 pt-0 flex items-center justify-end">
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{typeof item.price === 'number' && !isNaN(item.price) ? item.price.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="col-span-2 sm:col-span-2 md:col-span-3 xl:col-span-4 text-center py-8"
              >
                <div className="text-gray-400 mb-2">
                  <FaSearch className="inline-block text-3xl" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">No items found</h3>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 text-orange-600 hover:text-orange-700 text-xs font-semibold"
                  aria-label="Clear all filters"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}