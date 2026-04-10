import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Truck, AlertCircle } from "lucide-react";
import CreateDeliveryProfile from "../DeliveryManagementService/CreateDeliveryProfile";
import DeliveryHome from "./DeliveryHome";

import config from "../config";
const DELIVERY_API_URL = config.DELIVERY_API;


const DeliveryLandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(`${DELIVERY_API_URL}/delivery-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success && res.data.person) {
        setProfile(res.data.person);
        setHasProfile(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setHasProfile(false);
      } else {
        console.error("Fetch delivery profile error:", err);
        setError(err.response?.data?.message || "Failed to load delivery profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileCreated = (createdProfile) => {
    setProfile(createdProfile);
    setHasProfile(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Loading delivery profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return <CreateDeliveryProfile onCreated={handleProfileCreated} />;
  }

  return <DeliveryHome profile={profile} />;
};

export default DeliveryLandingPage;