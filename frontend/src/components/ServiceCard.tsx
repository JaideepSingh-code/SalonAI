import Link from "next/link";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  base_price: number;
  duration_minutes: number;
}

const categoryIcons: Record<string, string> = {
  haircut: "✂️",
  coloring: "🎨",
  styling: "💇",
  treatment: "💆",
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{categoryIcons[service.category] || "💇"}</span>
        <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium capitalize">
          {service.category}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
      <p className="text-gray-500 text-sm mb-4">{service.description}</p>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div>
          <span className="text-xl font-bold text-primary-600">${service.base_price}</span>
          <span className="text-gray-400 text-sm ml-2">{service.duration_minutes} min</span>
        </div>
        <Link href="/appointments" className="text-primary-600 hover:underline text-sm font-medium">
          Book Now →
        </Link>
      </div>
    </div>
  );
}
