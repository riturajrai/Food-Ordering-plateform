import React, { useState, useEffect, useMemo } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaCheckCircle, FaPlus, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CartIcon from '../components/CartIcon';
import { useAuth , MenuImage } from '../components/AuthContext';


const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = useSelector((state) => state.cart.count);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [addressError, setAddressError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch addresses from backend
  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Please log in to view addresses');
            navigate('/login');
            return;
          }
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAddresses(response.data.addresses || []);
          setSelectedAddress(response.data.addresses[0] || null);
        } catch (err) {
          console.error('Error fetching addresses:', err);
          setError(err.response?.data?.error || 'Failed to load addresses. Please try again.');
          if (err.response?.status === 401) {
            setError('Session expired. Please log in again.');
            logout();
            navigate('/login');
          }
        }
      };
      fetchAddresses();
    }
  }, [user, navigate, logout]);

  // Handle adding a new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address) {
      setAddressError('Please fill in both label and address');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAddressError('Please log in to add an address');
        navigate('/login');
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addresses`,
        { user_id: user.id, label: newAddress.label, address: newAddress.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses([...addresses, response.data.address]);
      setSelectedAddress(response.data.address);
      setNewAddress({ label: '', address: '' });
      setIsAddAddressOpen(false);
      setAddressError(null);
    } catch (err) {
      console.error('Error adding address:', err);
      setAddressError(err.response?.data?.error || 'Failed to add address. Please try again.');
      if (err.response?.status === 401) {
        setAddressError('Session expired. Please log in again.');
        logout();
        navigate('/login');
      }
    }
  };

  // Memoized calculations
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

  // Generate a random order ID
  const generateOrderId = () => {
    return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to place an order');
        navigate('/login');
        return;
      }
      const orderId = generateOrderId();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/orders`,
        {
          user_id: user.id,
          order_id: orderId,
          items: cartItems,
          total,
          address: selectedAddress.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({
        type: 'PLACE_ORDER',
        payload: {
          orderId,
          items: cartItems,
          total,
          address: selectedAddress.address,
        },
      });
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = err.response?.data?.error || 'Failed to place order. Please try again.';
      setError(errorMessage);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else if (err.response?.data?.error.includes('table does not exist')) {
        setError('Unable to place order due to a server issue. Please contact support.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <CartIcon />
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            >
              Checkout
            </motion.h1>
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="flex items-center text-white hover:text-gray-200 transition duration-300 text-sm sm:text-base"
                aria-label="Back to cart"
              >
                <FaArrowLeft className="mr-2" size={14} />
                Back to Cart
              </Link>
              <Link
                to="/menu"
                className="flex items-center text-white hover:text-gray-200 transition duration-300 text-sm sm:text-base"
                aria-label="Back to menu"
              >
                <FaArrowLeft className="mr-2" size={14} />
                Back to Menu
              </Link>
            </div>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base max-w-2xl mt-2 leading-relaxed text-center mx-auto"
          >
            Review your order and select delivery details
          </motion.p>
        </div>
      </section>
      <section className="container mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-red-600 text-sm bg-red-50 p-4 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-xl shadow-md"
          >
            <div className="text-gray-400 mb-4">
              <FaCheckCircle className="inline-block text-4xl" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items to Checkout</h3>
            <p className="text-gray-500 mb-4 text-sm">
              Add items to your cart to proceed with checkout.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 text-sm"
                aria-label="Explore menu"
              >
                Explore Menu
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center">
                <FaCheckCircle className="text-orange-600 mr-2" />
                Order Summary ({cartCount} items)
              </h2>
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 border border-gray-100"
                  >
                    <div className="w-full sm:w-24 flex-shrink-0">
                      <MenuImage src={item.image} alt={item.name} heightClass="h-20 sm:h-24" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-semibold">{item.name || 'Unknown Item'}</span>
                        <span className="text-orange-600 font-bold text-sm">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.is_veg ? (
                          <span className="text-green-600">● VEG</span>
                        ) : (
                          <span className="text-red-600">● NON-VEG</span>
                        )}
                      </p>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-orange-600 mr-2" />
                  Delivery Address
                </h2>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select Address</h3>
                    <motion.button
                      onClick={() => setIsAddAddressOpen(true)}
                      className="flex items-center text-orange-600 hover:text-orange-700 text-sm font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Add new address"
                    >
                      <FaPlus className="mr-2" size={14} />
                      Add Address
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <p className="text-sm text-gray-600">No addresses found. Please add an address.</p>
                    ) : (
                      addresses.map((addr) => (
                        <motion.div
                          key={addr.id}
                          className={`p-4 border rounded-lg cursor-pointer transition duration-300 ${
                            selectedAddress?.id === addr.id
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedAddress(addr)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{addr.label}</p>
                              <p className="text-sm text-gray-600">{addr.address}</p>
                            </div>
                            {selectedAddress?.id === addr.id && (
                              <FaCheckCircle className="text-orange-600" />
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {isAddAddressOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 bg-black/50 z-50"
                      onClick={() => setIsAddAddressOpen(false)}
                      aria-hidden="true"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add New Address</h3>
                        <motion.button
                          onClick={() => setIsAddAddressOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Close add address modal"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTimes size={20} />
                        </motion.button>
                      </div>
                      {addressError && (
                        <div className="mb-4 text-red-600 text-sm">{addressError}</div>
                      )}
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div>
                          <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                            Label (e.g., Home, Work)
                          </label>
                          <input
                            id="label"
                            type="text"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                            placeholder="Enter label"
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <textarea
                            id="address"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                            placeholder="Enter full address"
                            rows="4"
                            aria-required="true"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <motion.button
                            type="button"
                            onClick={() => setIsAddAddressOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold rounded-lg transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Cancel"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Save address"
                          >
                            Save Address
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Bill Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-4">
                    <span>Grand Total</span>
                    <span>₹{total}</span>
                  </div>
                  <motion.button
                    onClick={handlePlaceOrder}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                    aria-label="Place order"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Place Order
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

export default Checkout;