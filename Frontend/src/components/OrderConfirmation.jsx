import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from './Navbar';
import { MenuImage } from './Navbar';

const OrderConfirmation = () => {
  const { user, logout } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your order');
          navigate('/login');
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart/orders/${user.id}/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(response.data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        const errorMessage = err.response?.data?.error || 'Failed to load order details. Please try again.';
        setError(errorMessage);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          logout();
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Order not found.');
        } else if (err.response?.data?.error.includes('table does not exist')) {
          setError('Unable to load order due to a server issue. Please contact support.');
        }
      }
    };
    fetchOrder();
  }, [user, orderId, navigate, logout]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            >
              Order Confirmation
            </motion.h1>
            <Link
              to="/menu"
              className="flex items-center text-white hover:text-gray-200 transition duration-300 text-sm sm:text-base"
              aria-label="Back to menu"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Back to Menu
            </Link>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base max-w-2xl mt-2 leading-relaxed text-center mx-auto"
          >
            Thank you for your order!
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
        {!order ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-xl shadow-md"
          >
            <div className="text-gray-400 mb-4">
              <FaCheckCircle className="inline-block text-4xl" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Order Details</h3>
            <p className="text-gray-500 mb-4 text-sm">
              Please wait while we fetch your order details.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
              <span
                className={`text-sm font-semibold ${
                  order.status === 'Delivered' ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Placed on: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">Delivery Address: {order.address}</p>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 flex-shrink-0">
                    <MenuImage src={item.image} alt={item.name} heightClass="h-20 sm:h-24" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-base font-semibold">{item.name}</span>
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
                </div>
              ))}
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-4 mt-4">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
            <motion.div
              className="mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/order-history"
                className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                aria-label="View order history"
              >
                View Order History
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default OrderConfirmation;