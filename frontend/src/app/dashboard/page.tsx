"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getAppointments, getCurrentUser } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

interface Appointment {
  id: number;
  service_name: string;
  appointment_date: string;
  status: string;
  total_price: number;
}

interface User {
  first_name: string;
  last_name: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, aptsRes] = await Promise.all([
          getCurrentUser(),
          getAppointments(),
        ]);
        setUser(userRes.data.user);
        setAppointments(aptsRes.data.appointments);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const completed = appointments.filter((a) => a.status === "completed");

  return (
    <div className="min-h-screen bg-salon-light">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome back, {user?.first_name}!
        </h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Upcoming" value={upcoming.length} color="text-primary-600" />
          <StatCard label="Completed" value={completed.length} color="text-green-600" />
          <StatCard
            label="Total Spent"
            value={`$${completed.reduce((sum, a) => sum + (a.total_price || 0), 0).toFixed(0)}`}
            color="text-blue-600"
          />
          <StatCard label="This Month" value={
            appointments.filter((a) => {
              const d = new Date(a.appointment_date);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length
          } color="text-orange-600" />
        </div>

        {/* Upcoming Appointments */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
            <Link href="/appointments" className="text-primary-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.{" "}
              <Link href="/appointments" className="text-primary-600 hover:underline">Book one now</Link>
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((apt) => (
                <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{apt.service_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.appointment_date).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/appointments" className="card hover:shadow-lg transition-shadow cursor-pointer text-center">
            <div className="text-3xl mb-2">📅</div>
            <h4 className="font-semibold text-gray-800">Book Appointment</h4>
            <p className="text-sm text-gray-500">Schedule your next visit</p>
          </Link>
          <Link href="/recommendations" className="card hover:shadow-lg transition-shadow cursor-pointer text-center">
            <div className="text-3xl mb-2">✨</div>
            <h4 className="font-semibold text-gray-800">Get AI Recommendations</h4>
            <p className="text-sm text-gray-500">Find your perfect style</p>
          </Link>
          <Link href="/services" className="card hover:shadow-lg transition-shadow cursor-pointer text-center">
            <div className="text-3xl mb-2">💇</div>
            <h4 className="font-semibold text-gray-800">Browse Services</h4>
            <p className="text-sm text-gray-500">Explore what we offer</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="card text-center">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
