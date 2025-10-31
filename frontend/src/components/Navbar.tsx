"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-primary-700">
          SalonAI
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/appointments" className="text-gray-600 hover:text-primary-600 transition-colors">
            Appointments
          </Link>
          <Link href="/services" className="text-gray-600 hover:text-primary-600 transition-colors">
            Services
          </Link>
          <Link href="/recommendations" className="text-gray-600 hover:text-primary-600 transition-colors">
            AI Stylist
          </Link>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
