import React, { useState } from 'react';
import { 
  FaSearch, 
  FaChevronDown, 
  FaChevronUp, 
  FaShippingFast, 
  FaUtensils,
  FaMoneyBillWave,
  FaUserCircle,
  FaMobileAlt,
  FaQuestionCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from "react-icons/fa";

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: <FaQuestionCircle className="mr-2" /> },
    { id: 'delivery', name: 'Delivery', icon: <FaShippingFast className="mr-2" /> },
    { id: 'orders', name: 'Orders', icon: <FaUtensils className="mr-2" /> },
    { id: 'payments', name: 'Payments', icon: <FaMoneyBillWave className="mr-2" /> },
    { id: 'account', name: 'Account', icon: <FaUserCircle className="mr-2" /> },
    { id: 'app', name: 'App', icon: <FaMobileAlt className="mr-2" /> },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How long does delivery usually take?',
      answer: 'Our standard delivery time is 30-45 minutes from the time your order is confirmed. Delivery times may vary depending on your location and current order volume. During peak hours, delivery may take up to 60 minutes.',
      category: 'delivery',
      popular: true
    },
    {
      id: 2,
      question: 'What areas do you deliver to?',
      answer: 'We currently deliver within a 10km radius of our restaurant locations. You can check if we deliver to your area by entering your postal code on our delivery page. We\'re constantly expanding our delivery zones!',
      category: 'delivery',
      popular: false
    },
    {
      id: 3,
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 5 minutes of placing it by calling our customer support at +91 9876543210. After this window, your order will already be in preparation and cannot be changed.',
      category: 'orders',
      popular: true
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI payments (Google Pay, PhonePe, Paytm), net banking, and cash on delivery. Some payment methods may not be available for all order types.',
      category: 'payments',
      popular: true
    },
    {
      id: 5,
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time through our app or website. Once your order is out for delivery, you\'ll receive a notification with a link to track your delivery partner on the map.',
      category: 'orders',
      popular: false
    },
    {
      id: 6,
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer refunds for orders that are canceled or in case of any issues with your order. Refunds are processed within 3-5 business days and will be credited to your original payment method.',
      category: 'payments',
      popular: false
    },
    {
      id: 7,
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on "Forgot Password" on the login page. You\'ll receive an email with instructions to create a new password. Make sure to check your spam folder if you don\'t see the email.',
      category: 'account',
      popular: false
    },
    {
      id: 8,
      question: 'Is there a minimum order value?',
      answer: 'Yes, we have a minimum order value of ₹149 for delivery orders. This helps us maintain quality service while keeping delivery charges affordable for our customers.',
      category: 'orders',
      popular: true
    },
    {
      id: 9,
      question: 'How do I use promo codes?',
      answer: 'You can apply promo codes during checkout before payment. Enter the code in the "Promo Code" field and click "Apply". Valid codes will automatically adjust your order total. Some codes may have restrictions.',
      category: 'payments',
      popular: false
    },
    {
      id: 10,
      question: 'Why is the app asking for location permission?',
      answer: 'We request location access to show you restaurants near you and provide accurate delivery estimates. Your location data is only used for these purposes and is never shared with third parties.',
      category: 'app',
      popular: false
    },
  ];

  const toggleItem = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFaqs = faqs.filter(faq => faq.popular);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl">
            Find answers to common questions about ordering, delivery, payments and more
          </p>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Popular Questions */}
        {activeCategory === 'all' && searchQuery === '' && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaStar className="text-orange-500 mr-2" /> Popular Questions
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {popularFaqs.map(faq => (
                <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {expandedItems.includes(faq.id) ? (
                      <FaChevronUp className="text-orange-500" />
                    ) : (
                      <FaChevronDown className="text-orange-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(faq.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Questions */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {activeCategory === 'all' ? 'All Questions' : `${categories.find(c => c.id === activeCategory)?.name} Questions`}
          </h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {expandedItems.includes(faq.id) ? (
                      <FaChevronUp className="text-orange-500" />
                    ) : (
                      <FaChevronDown className="text-orange-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(faq.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-gray-400 mb-4">
                <FaSearch className="inline-block text-4xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">No questions found</h3>
              <p className="text-gray-500 mt-2 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-orange-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is happy to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Call Support
            </a>
            <a
              href="mailto:support@foodexpress.com"
              className="bg-white hover:bg-gray-100 text-orange-500 font-medium py-3 px-6 rounded-lg border border-orange-500 transition duration-300"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;