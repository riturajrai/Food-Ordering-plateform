import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './Navbar';
import { MenuImage } from './Navbar';

const OrderHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your order history');
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/orders/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error('Error fetching order history:', err);
        const errorMessage = err.response?.data?.error || 'Failed to load order history. Please try again.';
        setError(errorMessage);
        
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate, logout]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <FaArrowLeft className="text-lg" />
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Order History</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-400 mb-4">
              <FaCheckCircle className="inline-block text-5xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/menu"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition duration-150"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Order #{order.order_id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h4>
                    <p className="text-gray-800">{order.address}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 flex-shrink-0">
                          <MenuImage src={item.image} alt={item.name} heightClass="h-20" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-orange-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            {item.is_veg ? 'Veg' : 'Non-Veg'} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-gray-900">₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;