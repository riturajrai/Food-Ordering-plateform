import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaChevronDown,
} from "react-icons/fa";

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(Array(5).fill(false));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const toggleFAQ = (index) => {
    setIsOpen((prev) => {
      const newOpenState = [...prev];
      newOpenState[index] = !newOpenState[index];
      return newOpenState;
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = "Valid email is required";
    if (!formData.phone.match(/^\+?\d{10,12}$/))
      errors.phone = "Valid phone number is required";
    if (!formData.subject) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      console.log("Form submitted:", formData);
      // Add API call or form submission logic here
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            We're here to assist you! Get in touch with any questions, feedback, or inquiries.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaPhoneAlt className="text-orange-600 text-2xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our friendly support team</p>
              <a
                href="tel:+919876543210"
                className="text-orange-600 font-semibold hover:underline text-lg"
                aria-label="Call us at +91 9876543210"
              >
                +91 9876543210
              </a>
              <p className="text-sm text-gray-500 mt-3">Mon-Sun, 8AM-10PM IST</p>
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaEnvelope className="text-orange-600 text-2xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us an email, and we'll get back to you promptly</p>
              <a
                href="mailto:support@foodexpress.com"
                className="text-orange-600 font-semibold hover:underline text-lg"
                aria-label="Email us at support@foodexpress.com"
              >
                support@foodexpress.com
              </a>
              <p className="text-sm text-gray-500 mt-3">Replies within 24 hours</p>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaMapMarkerAlt className="text-orange-600 text-2xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visit Us</h3>
              <p className="text-gray-600 mb-4">Come see us at our headquarters</p>
              <address className="text-orange-600 font-semibold not-italic text-lg">
                123 Food Street, Mumbai, India
              </address>
              <p className="text-sm text-gray-500 mt-3">Mon-Fri, 9AM-6PM IST</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your name"
                    aria-invalid={formErrors.name ? "true" : "false"}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    aria-invalid={formErrors.email ? "true" : "false"}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                    aria-invalid={formErrors.phone ? "true" : "false"}
                    aria-describedby={formErrors.phone ? "phone-error" : undefined}
                  />
                  {formErrors.phone && (
                    <p id="phone-error" className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      formErrors.subject ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={formErrors.subject ? "true" : "false"}
                    aria-describedby={formErrors.subject ? "subject-error" : undefined}
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Issue</option>
                    <option value="delivery">Delivery Problem</option>
                    <option value="payment">Payment Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.subject && (
                    <p id="subject-error" className="text-red-500 text-sm mt-1">
                      {formErrors.subject}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      formErrors.message ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Type your message here..."
                    aria-invalid={formErrors.message ? "true" : "false"}
                    aria-describedby={formErrors.message ? "message-error" : undefined}
                  ></textarea>
                  {formErrors.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Map and Hours */}
            <div>
              {/* Map */}
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">Our Location</h2>
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.755837355226!2d72.8338643153776!3d19.03355825822733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cee7a7f54f0d%3A0x6f612e391b758f1e!2sFood%20Street%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="FoodExpress Location"
                  ></iframe>
                </div>
                <div className="mt-4 flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-orange-600 mr-3" aria-hidden="true" />
                  <span>123 Food Street, Mumbai, Maharashtra 400001</span>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
                <div className="space-y-4">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 10:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
                    { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaClock className="text-orange-600 mr-3" aria-hidden="true" />
                        <span className="text-gray-600">{item.day}</span>
                      </div>
                      <span className="text-gray-600 font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I place an order?",
                answer:
                  "You can place an order through our website or mobile app. Simply browse the menu, add items to your cart, and proceed to checkout.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept credit/debit cards, UPI payments, net banking, and cash on delivery.",
              },
              {
                question: "How long does delivery take?",
                answer:
                  "Delivery times vary by location but typically range between 30-45 minutes from the time of order confirmation.",
              },
              {
                question: "Can I modify or cancel my order?",
                answer:
                  "You can modify or cancel your order within 5 minutes of placing it by calling our customer support.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "Yes, we offer refunds for orders that are canceled or in case of any issues with your order. Please contact our support team for assistance.",
              },
            ].map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full text-left font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-orange-600 rounded"
                  aria-expanded={isOpen[index]}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown
                    className={`text-orange-600 transition-transform duration-200 ${
                      isOpen[index] ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`mt-2 text-gray-600 transition-all duration-200 ${
                    isOpen[index] ? "block" : "hidden"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Follow us on social media for the latest updates, offers, and more!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition duration-300"
              aria-label="Follow us on Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://instagram.com/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-full shadow-md text-pink-600 hover:bg-pink-50 transition duration-300"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://twitter.com/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-full shadow-md text-blue-400 hover:bg-blue-50 transition duration-300"
              aria-label="Follow us on Twitter"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com/company/foodexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-full shadow-md text-blue-700 hover:bg-blue-50 transition duration-300"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}