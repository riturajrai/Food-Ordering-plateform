import React, { useMemo, useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useAuth } from '../components/Navbar';
import { setCartItems, incrementQuantity, decrementQuantity, removeItem, clearCart } from '../redux/cartSlice';

const MenuImage = ({ src, alt, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      )}
      {hasError ? (
        <img
          src="https://via.placeholder.com/150?text=Image+Not+Found"
          alt="Placeholder"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = useSelector((state) => state.cart.count);
  const [actionLoading, setActionLoading] = useState({});
  const [cartError, setCartError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
          const normalizedItems = response.data.cart.map(item => ({
            id: item.id,
            product_id: item.product_id,
            name: item.name,
            image_url: item.image,
            is_veg: item.is_veg,
            price: Number(item.price),
            quantity: Number(item.quantity),
          }));
          dispatch(setCartItems(normalizedItems));
          setCartError(null);
        } else {
          setCartError(response.data.error || 'Failed to fetch cart');
        }
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data || err.message);
        setCartError(err.response?.data?.error || 'Failed to fetch cart');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [user, dispatch]);

  // Re-fetch cart to sync state with backend
  const syncCart = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        const normalizedItems = response.data.cart.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          image_url: item.image,
          is_veg: item.is_veg,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }));
        dispatch(setCartItems(normalizedItems));
      }
    } catch (err) {
      console.error('Error syncing cart:', err.response?.data || err.message);
      setCartError('Failed to sync cart');
    }
  };

  const handleIncrementQuantity = async (id) => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setActionLoading((prev) => ({ ...prev, [id]: 'increment' }));
    const item = cartItems.find((item) => item.id === id);
    if (!item) {
      setCartError('Item not found');
      setActionLoading((prev) => ({ ...prev, [id]: null }));
      return;
    }

    // Optimistic update
    dispatch(incrementQuantity({ id }));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/${id}`,
        { quantity: item.quantity + 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!response.data.success) {
        console.error('Increment failed:', response.data.error);
        dispatch(decrementQuantity({ id })); // Rollback
        setCartError(response.data.error || 'Failed to update quantity');
        await syncCart(); // Sync with backend
      }
    } catch (err) {
      console.error('Error incrementing quantity:', err.response?.data || err.message);
      dispatch(decrementQuantity({ id }));
      setCartError(err.response?.data?.error || 'Failed to update quantity');
      await syncCart();
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleDecrementQuantity = async (id) => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setActionLoading((prev) => ({ ...prev, [id]: 'decrement' }));
    const item = cartItems.find((item) => item.id === id);
    if (!item) {
      setCartError('Item not found');
      setActionLoading((prev) => ({ ...prev, [id]: null }));
      return;
    }

    if (item.quantity <= 1) {
      handleRemoveItem(id);
      return;
    }

    // Optimistic update
    dispatch(decrementQuantity({ id }));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/${id}`,
        { quantity: item.quantity - 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!response.data.success) {
        console.error('Decrement failed:', response.data.error);
        dispatch(incrementQuantity({ id })); // Rollback
        setCartError(response.data.error || 'Failed to update quantity');
        await syncCart(); // Sync with backend
      }
    } catch (err) {
      console.error('Error decrementing quantity:', err.response?.data || err.message);
      dispatch(incrementQuantity({ id })); // Rollback
      setCartError(err.response?.data?.error || 'Failed to update quantity');
      await syncCart(); // Sync with backend
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleRemoveItem = async (id) => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) return;
    setActionLoading((prev) => ({ ...prev, [id]: 'remove' }));

    // Optimistic update
    dispatch(removeItem(id));

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.data.success) {
        console.error('Remove failed:', response.data.error);
        setCartError(response.data.error || 'Failed to remove item');
        await syncCart(); // Sync with backend
      }
    } catch (err) {
      console.error('Error removing item:', err.response?.data || err.message);
      setCartError(err.response?.data?.error || 'Failed to remove item');
      await syncCart(); // Sync with backend
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleClearCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/all/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        dispatch(clearCart());
      } else {
        console.error('Clear cart failed:', response.data.error);
        setCartError(response.data.error || 'Failed to clear cart');
        await syncCart(); // Sync with backend
      }
    } catch (err) {
      console.error('Error clearing cart:', err.response?.data || err.message);
      setCartError(err.response?.data?.error || 'Failed to clear cart');
      await syncCart(); // Sync with backend
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const tax = useMemo(() => (subtotal * 0.05).toFixed(2), [subtotal]);
  const deliveryFee = 50;
  const total = useMemo(() => (subtotal + parseFloat(tax) + deliveryFee).toFixed(2), [subtotal, tax]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-xs sm:text-sm">
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight"
            >
              Your Cart
            </motion.h1>
            <Link
              to="/menu"
              className="flex items-center text-white hover:text-gray-200 transition duration-300"
              aria-label="Back to menu"
            >
              <FaArrowLeft className="mr-1 sm:mr-2" size={12} />
              <span className="hidden xs:inline">Back to Menu</span>
            </Link>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-1 sm:mt-2 leading-relaxed text-center mx-auto max-w-2xl"
          >
            Review your selected items before proceeding to checkout
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading cart...</p>
          </div>
        ) : cartError ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-600">{cartError}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="mt-3 inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                aria-label="Explore menu"
              >
                Explore Menu
              </Link>
            </motion.div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm"
          >
            <div className="text-gray-400 mb-3">
              <FaCheckCircle className="inline-block text-3xl sm:text-4xl" aria-hidden="true" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500 mb-4">
              Add some delicious items to your cart!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                aria-label="Explore menu"
              >
                Explore Menu
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center">
                  <FaCheckCircle className="text-orange-600 mr-2" size={14} />
                  <span>Cart Items ({cartCount} items)</span>
                </h2>
                <motion.button
                  onClick={handleClearCart}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition duration-300"
                  aria-label="Clear entire cart"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading || Object.values(actionLoading).some((v) => v)}
                >
                  Clear Cart
                </motion.button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col xs:flex-row gap-3 sm:gap-4 border border-gray-100"
                  >
                    <div className="w-full xs:w-20 sm:w-24 flex-shrink-0">
                      <MenuImage src={item.image_url} alt={item.name || 'Item'} className="h-16 sm:h-20" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold line-clamp-2">{item.name || 'Unknown Item'}</span>
                        <span className="text-orange-600 font-bold whitespace-nowrap ml-2">
                          ₹{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1 sm:mb-2">
                        {item.is_veg ? (
                          <span className="text-green-600">● VEG</span>
                        ) : (
                          <span className="text-red-600">● NON-VEG</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleDecrementQuantity(item.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition duration-300 disabled:opacity-50"
                          aria-label={`Decrease quantity of ${item.name || 'item'}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={actionLoading[item.id] || isLoading}
                        >
                          {actionLoading[item.id] === 'decrement' ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-700"></div>
                          ) : (
                            <FaMinus size={8} />
                          )}
                        </motion.button>
                        <span className="font-semibold min-w-[20px] text-center">{item.quantity}</span>
                        <motion.button
                          onClick={() => handleIncrementQuantity(item.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-1 transition duration-300 disabled:opacity-50"
                          aria-label={`Increase quantity of ${item.name || 'item'}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={actionLoading[item.id] || isLoading}
                        >
                          {actionLoading[item.id] === 'increment' ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <FaPlus size={8} />
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleRemoveItem(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition duration-300 disabled:opacity-50"
                          aria-label={`Remove ${item.name || 'item'} from cart`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={actionLoading[item.id] || isLoading}
                        >
                          {actionLoading[item.id] === 'remove' ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <FaTrash size={8} />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Cart Summary</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-3 sm:pt-4">
                    <span>Grand Total</span>
                    <span>₹{total}</span>
                  </div>
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-300"
                    aria-label="Proceed to checkout"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading || Object.values(actionLoading).some((v) => v)}
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;