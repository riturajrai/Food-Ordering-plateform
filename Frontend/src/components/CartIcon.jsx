import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const CartIcon = () => {
  const cartCount = useSelector(state => state.cart.count);
  return (
    <Link
      to="/cart"
      className="fixed bottom-4 right-4 z-50 bg-orange-600 text-white rounded-full p-3 shadow-lg hover:bg-orange-700 transition duration-300"
      aria-label={`Go to cart with ${cartCount} items`}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaShoppingCart size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </motion.div>
    </Link>
  );
};

export default CartIcon;