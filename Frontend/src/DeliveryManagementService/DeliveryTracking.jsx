import React from "react";
import { ClipboardList, Clock3 } from "lucide-react";

import config from "../config";
const DELIVERY_API_URL = config.DELIVERY_API;

const DeliveryTracking = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <ClipboardList className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tracking Updates</h2>
            <p className="text-gray-500 mt-1">
              Shipment tracking history and update form will appear here.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 text-sm font-semibold">
          <Clock3 className="w-4 h-4" />
          Coming Soon
        </span>
      </div>

      <div className="h-64 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 font-medium">
        Tracking timeline and update controls will be added here.
      </div>
    </div>
  );
};

export default DeliveryTracking;