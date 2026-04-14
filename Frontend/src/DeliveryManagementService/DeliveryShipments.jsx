import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PackageCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import config from "../config";

const DELIVERY_API_URL = config.DELIVERY_API;
const ORDER_API_URL = config.ORDER_API;

const STATUS_CONFIG = {
  pending:    { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
  "picked-up": { bg: "bg-blue-100",  text: "text-blue-700",   label: "Picked Up" },
  delivered:  { bg: "bg-green-100",  text: "text-green-700",  label: "Delivered" },
  completed:  { bg: "bg-emerald-100",text: "text-emerald-700",label: "Completed" },
  cancelled:  { bg: "bg-red-100",    text: "text-red-700",    label: "Cancelled" },
  ready:      { bg: "bg-purple-100", text: "text-purple-700", label: "Ready" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

const FILTER_TABS = [
  { id: "all",       label: "All" },
  { id: "pending",   label: "Pending" },
  { id: "picked-up", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "completed", label: "Completed" },
];

const DeliveryShipments = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError]                 = useState("");
  const [expanded, setExpanded]           = useState(null);
  const [filter, setFilter]               = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const url =
        filter === "all"
          ? `${DELIVERY_API_URL}/my-deliveries`
          : `${DELIVERY_API_URL}/my-deliveries?status=${filter}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.deliveries || res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load shipments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setActionLoading(orderId + newStatus);
      const token = localStorage.getItem("token");

      await axios.patch(
        `${DELIVERY_API_URL}/deliveries/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setActionLoading("");
    }
  };

  const nextAction = (status) => {
    if (status === "ready")     return { label: "Pick Up",  next: "picked-up", icon: Truck };
    if (status === "picked-up") return { label: "Mark Delivered", next: "delivered", icon: CheckCircle2 };
    return null;
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <PackageCheck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Shipments</h2>
            <p className="text-gray-500 text-sm mt-0.5">Manage and update your assigned deliveries.</p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.id
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <PackageCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No shipments found.</p>
          <p className="text-sm text-gray-400 mt-1">New assignments will appear here once assigned.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const action    = nextAction(order.status);
            const isOpen    = expanded === order._id;
            const isLoading = actionLoading.startsWith(order._id);

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-orange-100 p-2 rounded-xl shrink-0">
                      <Truck className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        Order #{order._id?.slice(-6).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{order.deliveryAddress || order.address || "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={order.status} />
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {order.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {order.phone}
                        </div>
                      )}
                      {order.createdAt && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      )}
                      {order.totalAmount != null && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-gray-400 font-mono text-xs">LKR</span>
                          {Number(order.totalAmount).toFixed(2)}
                        </div>
                      )}
                      {order.deliveryType && (
                        <div className="flex items-center gap-2 text-gray-600 capitalize">
                          <Truck className="w-4 h-4 text-gray-400" />
                          {order.deliveryType} delivery
                        </div>
                      )}
                    </div>

                    {order.items?.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm text-gray-700">
                            <span>{item.name || item.productName} × {item.quantity}</span>
                            <span className="text-gray-500">LKR {Number(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    {action && (
                      <button
                        onClick={() => updateStatus(order._id, action.next)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <action.icon className="w-4 h-4" />
                        )}
                        {action.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryShipments;