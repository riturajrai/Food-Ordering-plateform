import React from 'react'
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin,
  FaChevronDown
} from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <div>
        {/* Footer - Same as Home Page */}
              <footer className="bg-gray-900 text-white pt-12 pb-6">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">FoodExpress</h3>
                      <p className="text-gray-400 mb-4">
                        Delivering happiness to your doorstep with the best food from top restaurants.
                      </p>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">
                          <FaFacebook size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                          <FaInstagram size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                          <FaTwitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                          <FaYoutube size={20} />
                        </a>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Menu</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Offers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Help & Info</h4>
                      <ul className="space-y-2">
                        <li><Link to='/faq' className="text-gray-400 hover:text-white">FAQs</Link></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Refund Policy</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaPhoneAlt className="text-gray-400 mr-2" />
                          <span className="text-gray-400">+91 9876543210</span>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          <span className="text-gray-400">support@foodexpress.com</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-2" />
                          <span className="text-gray-400">123 Food Street, Mumbai, India</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-800 pt-6 text-center">
                    <p className="text-gray-400">
                      © 2023 FoodExpress. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
      
    </div>
  )
}

export default Footer
