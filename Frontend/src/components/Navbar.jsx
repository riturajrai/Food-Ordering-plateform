import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useAuth, MenuImage } from './AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const cartCount = useSelector((state) => state.cart.count);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes`);
        console.log('Navbar fetched dishes:', response.data);
        const dishesArray = Array.isArray(response.data) ? response.data : response.data.dishes || [];
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
        console.error('Error fetching dishes in Navbar:', err);
        setSearchError('Failed to load dishes');
        setDishes([]);
      }
    };
    fetchDishes();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || searchOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen, searchOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const filteredDishes = Array.isArray(dishes) ? dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/offers', label: 'Offers' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/profile', label: 'Profile', protected: true },
    { path: '/order-history', label: 'Order History', protected: true },
    { path: '/cart', label: 'Cart' },
  ];

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-6 py-4">
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3">
                <div className="relative flex items-center">
                  <input
                    id="mobile-search-input"
                    type="text"
                    placeholder="Search for dishes..."
                    className="w-full px-4 py-2 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search for dishes"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <motion.button
                    onClick={toggleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600"
                    aria-label="Close search"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="h-4 w-4" />
                  </motion.button>
                </div>
                {searchError ? (
                  <div className="mt-2 text-sm text-red-600">{searchError}</div>
                ) : searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-white rounded-lg shadow-md max-h-48 overflow-y-auto"
                  >
                    {filteredDishes.length > 0 ? (
                      filteredDishes.map((dish) => (
                        <Link
                          key={dish.id}
                          to={`/food/${dish.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setSearchOpen(false)}
                        >
                          {dish.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No dishes found</div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`flex justify-between items-center h-16 sm:h-20 ${searchOpen ? 'hidden md:flex' : ''}`}>
          <motion.div className="flex items-center flex-shrink-0" whileHover={{ scale: 1.05 }}>
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-extrabold text-orange-600 hover:text-orange-700 transition duration-300"
              aria-label="FoodExpress Home"
            >
              <span className="hidden sm:inline">FoodExpress</span>
              <span className="sm:hidden">FE</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3">
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <motion.div key={link.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ${
                      location.pathname === link.path
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                    aria-label={`Go to ${link.label} page`}
                    onClick={(e) => {
                      if (link.protected && !user) {
                        e.preventDefault();
                        navigate('/login');
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleSearch}
              className="flex items-center justify-center p-2 text-gray-600 hover:text-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-600 rounded"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {searchOpen ? <FaTimes className="h-5 w-5" /> : <FaSearch className="h-5 w-5" />}
            </motion.button>

            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/profile"
                    className="hidden md:flex items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                    aria-label="View dashboard"
                  >
                    <FaUser className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>{user.name}</span>
                  </Link>
                </motion.div>
                <motion.button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="hidden md:flex items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                  aria-label="Log out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                aria-label="Log in or register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="h-4 w-4 mr-2" aria-hidden="true" />
                <span>Login</span>
              </motion.button>
            )}

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/cart"
                className="relative flex items-center p-2 text-gray-600 hover:text-orange-600 transition duration-300"
                aria-label={`View your cart with ${cartCount} items`}
              >
                <FaShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </motion.div>

            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 rounded transition duration-300"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block overflow-hidden"
            >
              <div className="pb-4">
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search for dishes, restaurants..."
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search for dishes or restaurants"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                </div>
                {searchError ? (
                  <div className="mt-2 text-sm text-red-600">{searchError}</div>
                ) : searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-white rounded-lg shadow-md max-h-48 overflow-y-auto"
                  >
                    {filteredDishes.length > 0 ? (
                      filteredDishes.map((dish) => (
                        <Link
                          key={dish.id}
                          to={`/food/${dish.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setSearchOpen(false)}
                        >
                          {dish.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No dishes found</div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/10 z-30"
                onClick={toggleMenu}
                aria-hidden="true"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-40"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <Link
                    to="/"
                    className="text-xl font-bold hover:text-gray-200 transition duration-300"
                    onClick={toggleMenu}
                    aria-label="FoodExpress Home"
                  >
                    FoodExpress
                  </Link>
                  <motion.button
                    onClick={toggleMenu}
                    className="p-2 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-600 rounded transition duration-300"
                    aria-label="Close menu"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="p-4">
                  <nav className="space-y-2">
                    {navLinks.map((link) => (
                      (!link.protected || user) && (
                        <motion.div key={link.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to={link.path}
                            className={`block px-4 py-2 rounded-lg text-base font-semibold transition duration-300 ${
                              location.pathname === link.path
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                            onClick={() => {
                              toggleMenu();
                              if (link.protected && !user) {
                                navigate('/login');
                              }
                            }}
                            aria-label={`Go to ${link.label} page`}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      )
                    ))}
                  </nav>
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                    {user ? (
                      <>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                            onClick={toggleMenu}
                            aria-label="View dashboard"
                          >
                            <FaUser className="h-4 w-4 mr-2" aria-hidden="true" />
                            <span>{user.name}</span>
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to="/order-history"
                            className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                            onClick={toggleMenu}
                            aria-label="View order history"
                          >
                            <FaUser className="h-4 w-4 mr-2" aria-hidden="true" />
                            <span>Order History</span>
                          </Link>
                        </motion.div>
                        <motion.button
                          onClick={() => {
                            toggleMenu();
                            logout();
                            navigate('/');
                          }}
                          className="flex w-full items-center px-4 py-2 text-base font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                          aria-label="Log out"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaSignOutAlt className="h-4 w-4 mr-2" aria-hidden="true" />
                          <span>Logout</span>
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => {
                          toggleMenu();
                          navigate('/login');
                        }}
                        className="flex w-full items-center px-4 py-2 text-base font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                        aria-label="Log in or register"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaUser className="h-4 w-4 mr-2" aria-hidden="true" />
                        <span>Login / Register</span>
                      </motion.button>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/cart"
                        className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition duration-300"
                        onClick={toggleMenu}
                        aria-label={`View your cart with ${cartCount} items`}
                      >
                        <FaShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;