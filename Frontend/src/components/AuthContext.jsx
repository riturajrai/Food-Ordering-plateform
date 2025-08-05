import React, { useState, useEffect, createContext, useContext } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCartItems, clearCart, addItem } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const syncCart = async () => {
        try {
          // Sync guest cart to backend
          if (savedCart.length > 0) {
            for (const item of savedCart) {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart`,
                {
                  user_id: parsedUser.id,
                  product_id: item.product_id,
                  product_name: item.product_name,
                  image: item.image,
                  is_veg: item.is_veg,
                  price: Number(item.price),
                  quantity: Math.floor(Number(item.quantity)), // Ensure integer quantity
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
            localStorage.removeItem('cart'); // Clear guest cart
          }

          // Fetch backend cart
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${parsedUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            const normalizedItems = response.data.cart.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              name: item.product_name || item.name,
              image_url: item.image,
              is_veg: item.is_veg,
              price: Number(item.price),
              quantity: Math.floor(Number(item.quantity)), // Ensure integer quantity
            }));
            dispatch(setCartItems(normalizedItems));
          }
        } catch (err) {
          console.error('Error syncing cart on login:', err);
        }
      };
      syncCart();
    } else if (savedCart.length > 0) {
      // Guest user: load cart from localStorage
      const normalizedCart = savedCart.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product_name,
        image_url: item.image,
        is_veg: item.is_veg,
        price: Number(item.price),
        quantity: Math.floor(Number(item.quantity)), // Ensure integer quantity
      }));
      dispatch(setCartItems(normalizedCart));
    }
  }, [dispatch]);

  const login = async (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (savedCart.length > 0) {
        for (const item of savedCart) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/cart`,
            {
              user_id: userData.id,
              product_id: item.product_id,
              product_name: item.product_name,
              image: item.image,
              is_veg: item.is_veg,
              price: Number(item.price),
              quantity: Math.floor(Number(item.quantity)),
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        localStorage.removeItem('cart');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const normalizedItems = response.data.cart.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.product_name || item.name,
          image_url: item.image,
          is_veg: item.is_veg,
          price: Number(item.price),
          quantity: Math.floor(Number(item.quantity)),
        }));
        dispatch(setCartItems(normalizedItems));
      }
    } catch (err) {
      console.error('Error syncing cart after login:', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    dispatch(clearCart());
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }
  return children;
};

export const MenuImage = ({ src, alt, heightClass, hoverClass }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoading(false);
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