"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import RecommendationPanel from "@/components/RecommendationPanel";
import { getRecommendations } from "@/lib/api";
import toast from "react-hot-toast";

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

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    face_shape: "oval",
    preferred_length: "medium",
    maintenance_preference: "medium",
    preferred_category: "",
  });

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getRecommendations(profile);
      setRecommendations(res.data.recommendations);
      if (res.data.recommendations.length === 0) {
        toast("No exact matches found. Try different preferences.");
      }
    } catch {
      toast.error("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-salon-light">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Style Recommendations</h2>
        <p className="text-gray-500 mb-8">
          Tell us about your preferences and let our AI suggest the perfect style for you.
        </p>

        {/* Preference Form */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Your Preferences</h3>
          <form onSubmit={handleGetRecommendations} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Face Shape</label>
              <select
                className="input-field"
                value={profile.face_shape}
                onChange={(e) => setProfile({ ...profile, face_shape: e.target.value })}
              >
                <option value="oval">Oval</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="heart">Heart</option>
                <option value="oblong">Oblong</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Length</label>
              <select
                className="input-field"
                value={profile.preferred_length}
                onChange={(e) => setProfile({ ...profile, preferred_length: e.target.value })}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Level</label>
              <select
                className="input-field"
                value={profile.maintenance_preference}
                onChange={(e) => setProfile({ ...profile, maintenance_preference: e.target.value })}
              >
                <option value="low">Low - Minimal upkeep</option>
                <option value="medium">Medium - Some styling needed</option>
                <option value="high">High - Regular salon visits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
              <select
                className="input-field"
                value={profile.preferred_category}
                onChange={(e) => setProfile({ ...profile, preferred_category: e.target.value })}
              >
                <option value="">Any</option>
                <option value="haircut">Haircut</option>
                <option value="coloring">Coloring</option>
                <option value="styling">Styling</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary md:col-span-2 disabled:opacity-50">
              {loading ? "Finding your perfect style..." : "Get AI Recommendations ✨"}
            </button>
          </form>
        </div>

        {/* Results */}
        {recommendations.length > 0 && <RecommendationPanel recommendations={recommendations} />}
      </main>
    </div>
  );
}
