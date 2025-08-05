import React, { useState, useEffect } from 'react';
import { 
  FaFire, 
  FaPercent, 
  FaClock, 
  FaTag, 
  FaStar, 
  FaShoppingCart,
  FaSearch,
  FaChevronRight,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../components/AuthContext';
import { addItem, incrementQuantity, decrementQuantity } from '../redux/cartSlice';

// MenuImage Component
const MenuImage = ({ src, alt, heightClass, hoverClass }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      )}
      {hasError ? (
        <img
          src="https://via.placeholder.com/150?text=Image+Not+Found"
          alt="Placeholder"
          className={`w-full ${heightClass} object-cover`}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full ${heightClass} object-cover ${hoverClass}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

const Offers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = useSelector(state => state.cart.items);

  // Fetch offers and dishes from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch offers
        const offersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers`);
        const offersData = Array.isArray(offersResponse.data) ? offersResponse.data : offersResponse.data.offers || [];
        if (!Array.isArray(offersData)) {
          throw new Error('Offers data is not an array');
        }
        setOffers(offersData.map(item => ({
          id: item.id,
          title: item.title || 'Untitled Offer',
          description: item.description || '',
          image: item.image || item.image_url || 'https://via.placeholder.com/150?text=Offer+Image',
          discount: item.discount || 'N/A',
          expiry: item.expiry || new Date().toISOString(),
          category: item.category || 'all',
          isFeatured: item.isFeatured !== undefined ? item.isFeatured : false,
          terms: item.terms || 'No terms provided',
          product_id: item.product_id // Optional: link to a specific dish
        })));

        // Fetch dishes (for adding to cart)
        const dishesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes`);
        const dishesArray = Array.isArray(dishesResponse.data) ? dishesResponse.data : dishesResponse.data.dishes || [];
        if (!Array.isArray(dishesArray)) {
          throw new Error('Dishes data is not an array');
        }
        setDishes(dishesArray.map(item => ({
          id: item.id,
          name: item.name,
          image_url: item.image_url || item.image,
          is_veg: item.is_veg !== undefined ? item.is_veg : item.isVeg,
          price: Number(item.price),
          description: item.description || '',
          category: item.category || 'all'
        })));
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load offers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (offer) => {
    // If the offer is linked to a specific dish
    const dish = offer.product_id ? dishes.find(d => d.id === offer.product_id) : null;
    if (!dish) {
      setError('No associated dish found for this offer');
      return;
    }

    const cartItem = cartItems.find(item => item.product_id === dish.id);
    if (cartItem) {
      // If item exists in cart, increment quantity
      if (user) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No authentication token found. Please log in.');
            navigate('/login', { state: { from: '/offers' } });
            return;
          }
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/cart/${cartItem.id}`,
            { quantity: cartItem.quantity + 1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            dispatch(incrementQuantity({ id: cartItem.id }));
          } else {
            setError(response.data.error || 'Failed to update quantity');
          }
        } catch (err) {
          console.error('Error updating cart:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to update cart');
        }
      } else {
        // For unauthenticated users, increment local cart
        dispatch(incrementQuantity({ id: cartItem.id }));
      }
      return;
    }

    // Add new item to cart
    if (user) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/login', { state: { from: '/offers' } });
          return;
        }
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cart`,
          {
            user_id: user.id,
            product_id: dish.id,
            product_name: dish.name,
            image: dish.image_url,
            is_veg: dish.is_veg,
            price: dish.price,
            quantity: 1,
            offer_id: offer.id // Include offer ID for discount application
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          dispatch(addItem({
            id: response.data.item.id,
            product_id: dish.id,
            name: dish.name,
            image_url: dish.image_url,
            is_veg: dish.is_veg,
            price: dish.price,
            quantity: 1,
            offer_id: offer.id
          }));
        } else {
          setError(response.data.error || 'Failed to add to cart');
        }
      } catch (err) {
        console.error('Error adding to cart:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to add to cart');
      }
    } else {
      // Add to local cart for unauthenticated users
      dispatch(addItem({
        id: `temp_${Date.now()}`,
        product_id: dish.id,
        name: dish.name,
        image_url: dish.image_url,
        is_veg: dish.is_veg,
        price: dish.price,
        quantity: 1,
        offer_id: offer.id
      }));
    }
  };

  const handleIncrementQuantity = async (productId) => {
    const cartItem = cartItems.find(item => item.product_id === productId);
    if (!cartItem) {
      setError('Item not found in cart');
      return;
    }
    if (user) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/login', { state: { from: '/offers' } });
          return;
        }
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cart/${cartItem.id}`,
          { quantity: cartItem.quantity + 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          dispatch(incrementQuantity({ id: cartItem.id }));
        } else {
          setError(response.data.error || 'Failed to update quantity');
        }
      } catch (err) {
        console.error('Error incrementing quantity:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to update quantity');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { state: { from: '/offers' } });
        }
      }
    } else {
      // Increment quantity in local cart
      dispatch(incrementQuantity({ id: cartItem.id }));
    }
  };

  const handleDecrementQuantity = async (productId) => {
    const cartItem = cartItems.find(item => item.product_id === productId);
    if (!cartItem) {
      setError('Item not found in cart');
      return;
    }
    if (user) {
      if (cartItem.quantity <= 1) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No authentication token found. Please log in.');
            navigate('/login', { state: { from: '/offers' } });
            return;
          }
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${cartItem.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            dispatch(decrementQuantity({ id: cartItem.id }));
          } else {
            setError(response.data.error || 'Failed to remove item');
          }
        } catch (err) {
          console.error('Error removing item:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to remove item');
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: '/offers' } });
          }
        }
      } else {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No authentication token found. Please log in.');
            navigate('/login', { state: { from: '/offers' } });
            return;
          }
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/cart/${cartItem.id}`,
            { quantity: cartItem.quantity - 1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            dispatch(decrementQuantity({ id: cartItem.id }));
          } else {
            setError(response.data.error || 'Failed to update quantity');
          }
        } catch (err) {
          console.error('Error decrementing quantity:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to update quantity');
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: '/offers' } });
          }
        }
      }
    } else {
      // Decrement quantity in local cart
      dispatch(decrementQuantity({ id: cartItem.id }));
    }
  };

  const categories = [
    { id: 'all', name: 'All Offers', icon: <FaFire /> },
    { id: 'new', name: 'New User', icon: <FaStar /> },
    { id: 'delivery', name: 'Free Delivery', icon: <FaShoppingCart /> },
    { id: 'combo', name: 'Combo Deals', icon: <FaPercent /> },
    { id: 'happyhour', name: 'Happy Hour', icon: <FaClock /> },
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesCategory = activeTab === 'all' || offer.category === activeTab;
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredOffers = offers.filter(offer => offer.isFeatured);

  const toggleExpand = (id) => {
    setExpandedOffer(expandedOffer === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600">Error</h3>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight"
          >
            Exclusive Offers & Deals
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90"
          >
            Save big on your favorite meals with our limited-time offers
          </motion.p>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg')] bg-cover bg-center"></div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="container mx-auto px-6 -mt-8 mb-8 relative z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-4 max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search offers..."
              className="w-full pl-12 pr-4 py-3 border-0 focus:ring-2 focus:ring-orange-500 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* Featured Offers */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaFire className="text-orange-600 mr-2" /> Featured Deals
          </h2>
          <Link to="/menu" className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
            View Menu <FaChevronRight className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOffers.map((offer) => {
              const dish = offer.product_id ? dishes.find(d => d.id === offer.product_id) : null;
              const cartItem = dish ? cartItems.find(item => item.product_id === dish.id) : null;
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100"
                >
                  <MenuImage 
                    src={offer.image} 
                    alt={offer.title} 
                    heightClass="h-48" 
                    hoverClass="transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
                    <FaTag className="mr-1" /> {offer.discount}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <FaClock className="mr-2" />
                      <span>Valid until: {formatDate(offer.expiry)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      {dish && cartItem ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleDecrementQuantity(dish.id)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1.5 transition duration-300"
                            aria-label={`Decrease quantity of ${dish.name}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaMinus size={10} />
                          </motion.button>
                          <span className="text-sm font-semibold">{cartItem.quantity}</span>
                          <motion.button
                            onClick={() => handleIncrementQuantity(dish.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-1.5 transition duration-300"
                            aria-label={`Increase quantity of ${dish.name}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaPlus size={10} />
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => handleAddToCart(offer)}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                          disabled={!dish}
                          aria-label={`Add ${offer.title} to cart`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Cart
                        </motion.button>
                      )}
                      <button 
                        onClick={() => toggleExpand(offer.id)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        {expandedOffer === offer.id ? 'Hide Details' : 'View Terms'}
                      </button>
                    </div>
                    <AnimatePresence>
                      {expandedOffer === offer.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-100"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions:</h4>
                          <p className="text-sm text-gray-600">{offer.terms}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* All Offers */}
      <section className="container mx-auto px-6 py-8 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold flex items-center">
            <FaPercent className="text-orange-600 mr-2" /> All Offers
          </h2>
          <div className="flex overflow-x-auto pb-2 scrollbar-hide w-full sm:w-auto">
            <div className="flex space-x-2 bg-gray-200 rounded-lg p-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap transition-colors ${
                    activeTab === category.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOffers.map((offer) => {
              const dish = offer.product_id ? dishes.find(d => d.id === offer.product_id) : null;
              const cartItem = dish ? cartItems.find(item => item.product_id === dish.id) : null;
              return (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <MenuImage 
                    src={offer.image} 
                    alt={offer.title} 
                    heightClass="h-40" 
                    hoverClass="transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                    {offer.discount}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <FaClock className="mr-1" />
                        <span>Expires: {formatDate(offer.expiry)}</span>
                      </div>
                      {dish && cartItem ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleDecrementQuantity(dish.id)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1.5 transition duration-300"
                            aria-label={`Decrease quantity of ${dish.name}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaMinus size={10} />
                          </motion.button>
                          <span className="text-sm font-semibold">{cartItem.quantity}</span>
                          <motion.button
                            onClick={() => handleIncrementQuantity(dish.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-1.5 transition duration-300"
                            aria-label={`Increase quantity of ${dish.name}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaPlus size={10} />
                          </motion.button>
                        </div>
                      ) : (
                        <Link
                          to={dish ? `/food/${dish.id}` : '/menu'}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
                        >
                          Order <FaChevronRight className="ml-1" size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <FaSearch className="inline-block text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">No offers found</h3>
            <p className="text-gray-500 mt-2 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Special Promo Banner */}
      <section className="bg-orange-100 border-t border-b border-orange-200 py-12">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">Weekend Special!</h2>
                  <p className="text-lg max-w-lg">
                    Get flat ₹100 off on all orders above ₹499. Use code WEEKEND100 at checkout.
                  </p>
                </div>
                <Link
                  to="/menu"
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 whitespace-nowrap"
                >
                  Order Now
                </Link>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* How to Redeem */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">How to Redeem Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Browse Offers",
              description: "Explore all available offers and select the one you want to use",
              icon: <FaSearch className="text-orange-600 text-2xl" />
            },
            {
              step: "2",
              title: "Add to Cart",
              description: "Add qualifying items to your cart and proceed to checkout",
              icon: <FaShoppingCart className="text-orange-600 text-2xl" />
            },
            {
              step: "3",
              title: "Apply Code",
              description: "Enter the promo code if required and enjoy your discount!",
              icon: <FaTag className="text-orange-600 text-2xl" />
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-300"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto -mt-11 mb-2 text-sm font-bold">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Offers;