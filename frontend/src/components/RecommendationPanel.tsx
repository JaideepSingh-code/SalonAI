"use client";

import { useState } from "react";
import { getPriceEstimate } from "@/lib/api";

interface Recommendation {
  style: {
    id: number;
    name: string;
    category: string;
    hair_length: string;
    maintenance: string;
  };
  confidence: number;
  reason: string;
}

interface PriceEstimate {
  style: string;
  base_price: number;
  estimated_total: number;
  price_range: string;
}

export default function RecommendationPanel({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);

  const handlePriceCheck = async (styleId: number) => {
    try {
      const res = await getPriceEstimate({ style_id: styleId });
      setEstimate(res.data.estimate);
    } catch {
      console.error("Failed to get price estimate");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recommended Styles for You
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => (
          <div key={rec.style.id} className="card relative">
            {idx === 0 && (
              <div className="absolute -top-3 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Best Match
              </div>
            )}
            <h4 className="text-lg font-semibold text-gray-800 mt-2">{rec.style.name}</h4>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 rounded-full h-2"
                  style={{ width: `${rec.confidence}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {rec.confidence}%
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-gray-500 capitalize">
                <span className="font-medium">Category:</span> {rec.style.category}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                <span className="font-medium">Length:</span> {rec.style.hair_length}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                <span className="font-medium">Maintenance:</span> {rec.style.maintenance}
              </p>
            </div>
            <p className="text-sm text-primary-600 mt-3 italic">{rec.reason}</p>
            <button
              onClick={() => handlePriceCheck(rec.style.id)}
              className="mt-4 w-full btn-secondary text-sm"
            >
              Get Price Estimate
            </button>
          </div>
        ))}
      </div>

      {/* Price Estimate */}
      {estimate && (
        <div className="card mt-6 bg-primary-50 border-primary-200">
          <h4 className="font-semibold text-gray-800 mb-2">Price Estimate: {estimate.style}</h4>
          <p className="text-2xl font-bold text-primary-600">{estimate.price_range}</p>
          <p className="text-sm text-gray-500 mt-1">
            Base: ${estimate.base_price} | Estimated total: ${estimate.estimated_total}
          </p>
        </div>
      )}
    </div>
  );
}
