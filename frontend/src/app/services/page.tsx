"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/api";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  base_price: number;
  duration_minutes: number;
}

const CATEGORIES = ["all", "haircut", "coloring", "styling", "treatment"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices(filter === "all" ? undefined : filter);
        setServices(res.data.services);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [filter]);

  return (
    <div className="min-h-screen bg-salon-light">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>

        {/* Category Filter */}
        <div className="flex space-x-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setLoading(true); }}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === cat
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No services found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
