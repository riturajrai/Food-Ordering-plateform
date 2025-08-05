import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function AuthPanel({ isOpen, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Centralized body overflow handling
  React.useEffect(() => {
    document.body.style.overflow = isOpen || forgotPasswordOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, forgotPasswordOpen]);

  // Toggle functions
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };
  const toggleForgotPassword = () => {
    setForgotPasswordOpen(!forgotPasswordOpen);
    setErrors({});
    setForgotPasswordEmail('');
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAuth = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with an uppercase letter and a number';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!validateAuth()) return;

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        if (isLogin) {
          login(response.data.user, response.data.token);
          onClose();
          navigate('/');
        } else {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          setErrors({ form: 'Registration successful! Please log in.' });
        }
      } else {
        setErrors({ form: response.data.error });
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.error || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!forgotPasswordEmail) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Password reset link sent to your email!');
        setForgotPasswordOpen(false);
        setForgotPasswordEmail('');
      }, 1500);
    }
  };

  const renderAuthForm = (isMobile = false) => (
    <>
      {errors.form && <p className="mb-4 text-sm text-red-600">{errors.form}</p>}
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor={`name-${isMobile ? 'mobile' : 'desktop'}`} className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id={`name-${isMobile ? 'mobile' : 'desktop'}`}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200`}
                placeholder="John Doe"
                aria-label="Full Name"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        )}

        <div>
          <label htmlFor={`email-${isMobile ? 'mobile' : 'desktop'}`} className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              id={`email-${isMobile ? 'mobile' : 'desktop'}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200`}
              placeholder="your@email.com"
              aria-label="Email"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor={`password-${isMobile ? 'mobile' : 'desktop'}`} className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id={`password-${isMobile ? 'mobile' : 'desktop'}`}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200`}
              placeholder="••••••••"
              aria-label="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="text-sm text-gray-500 hover:text-gray-700">
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          {!isLogin && (
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase and number
            </p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label htmlFor={`confirmPassword-${isMobile ? 'mobile' : 'desktop'}`} className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id={`confirmPassword-${isMobile ? 'mobile' : 'desktop'}`}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200`}
                placeholder="••••••••"
                aria-label="Confirm Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <span className="text-sm text-gray-500 hover:text-gray-700">
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>
        )}

        {isLogin && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id={`remember-me-${isMobile ? 'mobile' : 'desktop'}`}
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200"
                aria-label="Remember me"
              />
              <label htmlFor={`remember-me-${isMobile ? 'mobile' : 'desktop'}`} className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <motion.button
              type="button"
              className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
              onClick={toggleForgotPassword}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Forgot password"
            >
              Forgot password?
            </motion.button>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300 flex justify-center items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={isLogin ? 'Login' : 'Sign Up'}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isLogin ? 'Logging in...' : 'Creating account...'}
            </>
          ) : isLogin ? 'Login' : 'Sign Up'}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <motion.button
          type="button"
          className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200"
          onClick={toggleAuthMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isLogin ? 'Switch to sign up' : 'Switch to login'}
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </motion.button>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for both mobile and desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => navigate('/menu')} // Updated to redirect to /menu
            aria-hidden="true"
          />

          {/* Mobile Full Screen Auth */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <h2 className="text-xl font-bold">{isLogin ? 'Login' : 'Create Account'}</h2>
              <motion.button
                onClick={() => navigate('/menu')} // Updated to redirect to /menu
                className="p-2 hover:text-gray-200 rounded-full"
                aria-label="Close authentication panel"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(100%-60px)]">
              {renderAuthForm(true)}
            </div>
          </motion.div>

          {/* Desktop Centered Dialog Auth */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <h2 className="text-xl font-bold">{isLogin ? 'Login' : 'Create Account'}</h2>
              <motion.button
                onClick={() => navigate('/menu')} // Updated to redirect to /menu
                className="p-2 hover:text-gray-200 rounded-full"
                aria-label="Close authentication panel"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="p-6">
              {renderAuthForm()}
            </div>
          </motion.div>
        </>
      )}

      {/* Forgot Password Dialog */}
      {forgotPasswordOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-60"
            onClick={toggleForgotPassword}
            aria-hidden="true"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-60"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <motion.button
                onClick={toggleForgotPassword}
                className="p-2 hover:text-gray-200 rounded-full"
                aria-label="Close forgot password dialog"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Enter your email to receive a password reset link.</p>
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200`}
                      placeholder="your@email.com"
                      aria-label="Email for password reset"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300 flex justify-center items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Send reset link"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthPanel;