import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  Circle,
  Truck,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  Send,
} from "lucide-react";
import config from "../config";

const DELIVERY_API_URL = config.DELIVERY_API;

const STATUSES = [
  { id: "pending",    label: "Order Received",  icon: Package,       desc: "Order is waiting to be picked up." },
  { id: "ready",      label: "Ready for Pickup", icon: Clock,         desc: "Shop has prepared the order." },
  { id: "picked-up",  label: "Picked Up",        icon: Truck,         desc: "Rider is on the way to customer." },
  { id: "delivered",  label: "Delivered",         icon: CheckCircle2,  desc: "Order delivered to customer." },
  { id: "completed",  label: "Completed",         icon: CheckCircle2,  desc: "Order confirmed complete." },
];

const statusIndex = (status) => STATUSES.findIndex((s) => s.id === status);

const TrackingTimeline = ({ status }) => {
  const current = statusIndex(status);
  return (
    <div className="relative">
      {STATUSES.slice(0, 4).map((step, idx) => {
        const done   = idx <= current;
        const active = idx === current;
        const Icon   = step.icon;

        return (
          <div key={step.id} className="flex gap-4 items-start mb-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 transition-all ${
                  done
                    ? active
                      ? "bg-orange-600 text-white ring-4 ring-orange-100"
                      : "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done && !active ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {idx < STATUSES.length - 2 && (
                <div className={`w-0.5 h-10 mt-1 ${done && idx < current ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
            <div className="pt-1.5 pb-10">
              <p className={`text-sm font-semibold ${done ? (active ? "text-orange-600" : "text-green-600") : "text-gray-400"}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DeliveryTracking = () => {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateNote, setUpdateNote]     = useState("");
  const [updating, setUpdating]         = useState(false);
  const [updateMsg, setUpdateMsg]       = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(`${DELIVERY_API_URL}/delivery/my-deliveries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data.deliveries || res.data.orders || [];
      setOrders(list);
      if (list.length > 0 && !selected) setSelected(list[0]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdate = async () => {
    if (!selected || !updateStatus) return;
    try {
      setUpdating(true);
      setUpdateMsg("");
      const token = localStorage.getItem("token");
      await axios.patch(
        `${DELIVERY_API_URL}/delivery/deliveries/${selected._id}/status`,
        { status: updateStatus, note: updateNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === selected._id ? { ...o, status: updateStatus } : o))
      );
      setSelected((prev) => ({ ...prev, status: updateStatus }));
      setUpdateMsg("Status updated successfully!");
      setUpdateNote("");
    } catch (err) {
      setUpdateMsg(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter((o) =>
    o._id?.toLowerCase().includes(search.toLowerCase()) ||
    (o.deliveryAddress || o.address || "").toLowerCase().includes(search.toLowerCase())
  );

  const actionableStatuses = [
    { value: "picked-up", label: "Mark Picked Up" },
    { value: "delivered", label: "Mark Delivered" },
    { value: "completed", label: "Mark Completed" },
  ].filter((s) => statusIndex(s.value) > statusIndex(selected?.status || ""));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <ClipboardList className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tracking Updates</h2>
            <p className="text-gray-500 text-sm mt-0.5">View and update tracking status for your deliveries.</p>
          </div>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Order List */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or address…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center shadow-sm">
                <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No deliveries found.</p>
              </div>
            ) : (
              filtered.map((order) => (
                <button
                  key={order._id}
                  onClick={() => { setSelected(order); setUpdateMsg(""); }}
                  className={`w-full text-left bg-white rounded-2xl border shadow-sm px-5 py-4 transition-all hover:border-orange-300 ${
                    selected?._id === order._id ? "border-orange-500 ring-2 ring-orange-100" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        #{order._id?.slice(-6).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {order.deliveryAddress || order.address || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        order.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "picked-up" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right: Timeline + Update */}
          {selected ? (
            <div className="space-y-4">
              {/* Timeline Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-bold text-gray-900">Order #{selected._id?.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}
                    </p>
                  </div>
                  <Truck className="w-6 h-6 text-orange-400" />
                </div>
                <TrackingTimeline status={selected.status} />
              </div>

              {/* Update Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <p className="font-semibold text-gray-800">Update Tracking Status</p>

                {actionableStatuses.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No further status updates available for this order.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-2">
                      {actionableStatuses.map((s) => (
                        <label
                          key={s.value}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                            updateStatus === s.value
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="updateStatus"
                            value={s.value}
                            checked={updateStatus === s.value}
                            onChange={(e) => setUpdateStatus(e.target.value)}
                            className="accent-orange-600"
                          />
                          <span className="text-sm font-medium text-gray-700">{s.label}</span>
                        </label>
                      ))}
                    </div>

                    <textarea
                      placeholder="Optional note (e.g. 'Customer wasn't home')"
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <button
                      onClick={handleUpdate}
                      disabled={updating || !updateStatus}
                      className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Update
                    </button>

                    {updateMsg && (
                      <p className={`text-sm font-medium ${updateMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {updateMsg}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select an order to see tracking details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;