import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. Please login.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile(data.profile);
        } else {
          console.error(data.error || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600 border-b-2"></div>
      </div>
    );
  }

  // No Profile State
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-lg font-medium">No profile data found. Please login again.</p>
      </div>
    );
  }

  // Profile UI
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-orange-100"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-orange-500" size={80} />
          <h2 className="text-2xl font-bold text-gray-800 mt-3">{profile.name}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-5"></div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Name</span>
            <p className="font-semibold text-gray-800">{profile.name}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Email</span>
            <p className="font-semibold text-gray-800">{profile.email}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Member Since</span>
            <p className="font-semibold text-gray-800">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
