import React, { useState } from "react";
import axios from "axios";
import { Truck } from "lucide-react";

import config from "../config";
const DELIVERY_API = config.DELIVERY_API;

const CreateDeliveryProfile = ({ onProfileCreated }) => {
  const [formData, setFormData] = useState({
    phone: "",
    zipCode: "",
    city: "",
    vehicleType: "bike",
    vehicleNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${DELIVERY_API}/delivery-persons`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onProfileCreated();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Failed to create delivery profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-600 p-3 rounded-xl">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Delivery Profile</h1>
            <p className="text-gray-500 text-sm">
              Complete your profile before starting deliveries.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600"
            required
          />

          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600"
          />

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600"
          >
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
          </select>

          <div className="md:col-span-2">
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-all"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryProfile;