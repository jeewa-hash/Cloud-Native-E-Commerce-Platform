import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateDeliveryProfile from "../DeliveryManagementService/CreateDeliveryProfile";
import DeliveryDashboard from "../DeliveryManagementService/DeliveryDashboard";

import config from "../config";
const DELIVERY_API = config.DELIVERY_API;

const DeliveryLandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${DELIVERY_API}/delivery-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.profile);
    } catch (error) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!profile) {
    return <CreateDeliveryProfile onProfileCreated={fetchProfile} />;
  }

  return <DeliveryDashboard profile={profile} />;
};

export default DeliveryLandingPage;