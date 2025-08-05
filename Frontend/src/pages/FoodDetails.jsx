// src/components/FoodDetails.js
import React, { useState, useEffect } from 'react';
import { FaStar, FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { useAuth , MenuImage } from '../components/AuthContext';
import axios from 'axios';


const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [dish, setDish] = useState(null);
  const [relatedDishes, setRelatedDishes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishAndRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        const dishResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes/${id}`);
        const dishData = dishResponse.data.dish || dishResponse.data;
        const formattedDish = {
          ...dishData,
          image_url: dishData.image_url || dishData.image,
          is_veg: dishData.is_veg !== undefined ? dishData.is_veg : dishData.isVeg,
          price: Number(dishData.price),
          description: dishData.description || 'No description available.',
          category: dishData.category || 'all',
          nutrition: dishData.nutrition || { calories: 'N/A', protein: 'N/A', fat: 'N/A', carbs: 'N/A' },
        };
        setDish(formattedDish);

        const dishesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes`);
        const dishesArray = Array.isArray(dishesResponse.data) ? dishesResponse.data : dishesResponse.data.dishes || [];
        const related = dishesArray
          .filter(item => item.id !== formattedDish.id && item.category === formattedDish.category)
          .map(item => ({
            ...item,
            image_url: item.image_url || item.image,
            is_veg: item.is_veg !== undefined ? item.is_veg : item.isVeg,
            price: Number(item.price),
            description: item.description || '',
            category: item.category || 'all',
          }))
          .slice(0, 3);
        setRelatedDishes(related);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dish details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDishAndRelated();
  }, [id]);

  const handleAddToCart = async () => {
    if (!dish) return;

    const cartItem = {
      id: `temp_${Date.now()}`,
      product_id: dish.id,
      name: dish.name,
      image_url: dish.image_url,
      is_veg: dish.is_veg,
      price: dish.price,
      quantity,
    };

    if (user) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to add items to cart.');
          navigate('/login');
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
            quantity,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          cartItem.id = response.data.item.id;
          dispatch(addItem(cartItem));
          navigate('/cart');
        } else {
          setError(response.data.error || 'Failed to add to cart');
        }
      } catch (err) {
        console.error('Error adding to cart:', err);
        setError(err.response?.data?.error || 'Failed to add to cart');
      }
    } else {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = savedCart.find(item => item.product_id === dish.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        savedCart.push({
          id: cartItem.id,
          product_id: dish.id,
          product_name: dish.name,
          image: dish.image_url,
          is_veg: dish.is_veg,
          price: dish.price,
          quantity,
        });
      }
      localStorage.setItem('cart', JSON.stringify(savedCart));
      dispatch(addItem(cartItem));
      navigate('/cart');
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes/${id}`);
      const dishData = response.data.dish || response.data;
      setDish({
        ...dishData,
        image_url: dishData.image_url || dishData.image,
        is_veg: dishData.is_veg !== undefined ? dishData.is_veg : dishData.isVeg,
        price: Number(dishData.price),
        description: dishData.description || 'No description available.',
        category: dishData.category || 'all',
        nutrition: dishData.nutrition || { calories: 'N/A', protein: 'N/A', fat: 'N/A', carbs: 'N/A' },
      });
      const dishesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/dishes`);
      const dishesArray = Array.isArray(dishesResponse.data) ? dishesResponse.data : dishesResponse.data.dishes || [];
      const related = dishesArray
        .filter(item => item.id !== dishData.id && item.category === dishData.category)
        .map(item => ({
          ...item,
          image_url: item.image_url || item.image,
          is_veg: item.is_veg !== undefined ? item.is_veg : item.isVeg,
          price: Number(item.price),
          description: item.description || '',
          category: item.category || 'all',
        }))
        .slice(0, 3);
      setRelatedDishes(related);
    } catch (err) {
      console.error('Error retrying:', err);
      setError('Failed to load dish details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error || 'Dish not found'}</p>
          <motion.button
            onClick={handleRetry}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            aria-label="Retry loading dish"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-xs sm:text-sm md:text-base">
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          <div className="relative">
            <MenuImage 
              src={dish.image_url} 
              alt={dish.name} 
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800">{dish.name}</h1>
            <p className="text-gray-600 leading-relaxed">{dish.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-orange-600 font-bold text-lg sm:text-xl md:text-2xl">₹{dish.price.toFixed(2)}</span>
              <span className="text-xs sm:text-sm font-semibold">
                {dish.is_veg ? (
                  <span className="text-green-600">● VEG</span>
                ) : (
                  <span className="text-red-600">● NON-VEG</span>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Category:</span>
              <span className="text-gray-800 font-semibold capitalize">{dish.category}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rating:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-orange-600" size={14} aria-hidden="true" />
                ))}
                <span className="ml-1 text-gray-600">(4.5/5)</span>
              </div>
            </div>
            <div className="pt-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Nutritional Information</h3>
              <ul className="mt-1 text-gray-600 space-y-1">
                <li>Calories: {dish.nutrition.calories}</li>
                <li>Protein: {dish.nutrition.protein}</li>
                <li>Fat: {dish.nutrition.fat}</li>
                <li>Carbohydrates: {dish.nutrition.carbs}</li>
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 sm:p-2"
                  aria-label="Decrease quantity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaMinus size={10} />
                </motion.button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <motion.button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-1 sm:p-2"
                  aria-label="Increase quantity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaPlus size={10} />
                </motion.button>
              </div>
              <motion.button
                onClick={handleAddToCart}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg flex items-center transition duration-300"
                aria-label={`Add ${dish.name} to cart`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus className="mr-1 sm:mr-2" size={10} />
                Add to Cart
              </motion.button>
              <motion.button
                onClick={() => navigate('/menu')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300"
                aria-label="Back to menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Menu
              </motion.button>
            </div>
            {error && <p className="text-red-600 text-xs sm:text-sm mt-2">{error}</p>}
          </div>
        </motion.div>

        {relatedDishes.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Related Dishes</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedDishes.map((relatedDish, index) => (
                <motion.div
                  key={relatedDish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-gray-100 group"
                >
                  <button
                    onClick={() => navigate(`/food/${relatedDish.id}`)}
                    className="block w-full text-left"
                    aria-label={`View details for ${relatedDish.name}`}
                  >
                    <div className="relative">
                      <MenuImage 
                        src={relatedDish.image_url} 
                        alt={relatedDish.name} 
                        className="w-full h-32 sm:h-40 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center">
                        {relatedDish.is_veg ? (
                          <span className="text-green-600 mr-1">●</span>
                        ) : (
                          <span className="text-red-600 mr-1">●</span>
                        )}
                        {relatedDish.is_veg ? 'VEG' : 'NON-VEG'}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold truncate group-hover:text-orange-600 transition duration-300">{relatedDish.name}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mt-1">{relatedDish.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-gray-800">
                          ₹{typeof relatedDish.price === 'number' && !isNaN(relatedDish.price) ? relatedDish.price.toFixed(2) : 'N/A'}
                        </span>
                        <button 
                          className="text-orange-600 text-xs font-semibold hover:text-orange-700"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/food/${relatedDish.id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default FoodDetails;