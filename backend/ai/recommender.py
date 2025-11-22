"""
AI-powered hairstyle and color recommendation engine.

Uses client history, preferences, and feature analysis to suggest
personalized styles and color treatments.
"""

import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import pandas as pd


class StyleRecommender:
    """Recommends hairstyles and colors based on client profile and history."""

    # Predefined style catalog
    STYLE_CATALOG = [
        {"id": 1, "name": "Classic Bob", "category": "haircut", "hair_length": "short",
         "maintenance": "low", "face_shapes": ["oval", "heart", "square"]},
        {"id": 2, "name": "Layered Cut", "category": "haircut", "hair_length": "medium",
         "maintenance": "medium", "face_shapes": ["round", "oval", "oblong"]},
        {"id": 3, "name": "Pixie Cut", "category": "haircut", "hair_length": "short",
         "maintenance": "low", "face_shapes": ["oval", "heart"]},
        {"id": 4, "name": "Beach Waves", "category": "styling", "hair_length": "long",
         "maintenance": "medium", "face_shapes": ["square", "round", "oval"]},
        {"id": 5, "name": "Balayage", "category": "coloring", "hair_length": "any",
         "maintenance": "low", "face_shapes": ["all"]},
        {"id": 6, "name": "Full Highlights", "category": "coloring", "hair_length": "any",
         "maintenance": "high", "face_shapes": ["all"]},
        {"id": 7, "name": "Blunt Cut", "category": "haircut", "hair_length": "medium",
         "maintenance": "medium", "face_shapes": ["oval", "oblong"]},
        {"id": 8, "name": "Curtain Bangs", "category": "haircut", "hair_length": "any",
         "maintenance": "medium", "face_shapes": ["round", "square", "heart"]},
        {"id": 9, "name": "Ombre Color", "category": "coloring", "hair_length": "medium",
         "maintenance": "low", "face_shapes": ["all"]},
        {"id": 10, "name": "Textured Crop", "category": "haircut", "hair_length": "short",
         "maintenance": "low", "face_shapes": ["oval", "square", "diamond"]},
    ]

    # Feature encoding maps
    LENGTH_MAP = {"short": 0, "medium": 1, "long": 2, "any": 1}
    MAINTENANCE_MAP = {"low": 0, "medium": 1, "high": 2}

    def __init__(self):
        self.scaler = StandardScaler()
        self._prepare_catalog_features()

    def _prepare_catalog_features(self):
        """Encode catalog styles as numerical feature vectors."""
        features = []
        for style in self.STYLE_CATALOG:
            vec = [
                self.LENGTH_MAP.get(style["hair_length"], 1),
                self.MAINTENANCE_MAP.get(style["maintenance"], 1),
                1 if style["category"] == "haircut" else 0,
                1 if style["category"] == "coloring" else 0,
                1 if style["category"] == "styling" else 0,
            ]
            features.append(vec)

        self.catalog_features = np.array(features)
        self.scaler.fit(self.catalog_features)
        self.catalog_normalized = self.scaler.transform(self.catalog_features)

        self.nn_model = NearestNeighbors(n_neighbors=3, metric="cosine")
        self.nn_model.fit(self.catalog_normalized)

    def get_recommendations(self, client_profile, n_recommendations=3):
        """
        Generate style recommendations for a client.

        Args:
            client_profile: dict with keys like preferred_length, maintenance_preference,
                          face_shape, past_services, preferred_category
            n_recommendations: number of recommendations to return

        Returns:
            List of recommended styles with confidence scores.
        """
        # Build client preference vector
        client_vec = np.array([[
            self.LENGTH_MAP.get(client_profile.get("preferred_length", "medium"), 1),
            self.MAINTENANCE_MAP.get(client_profile.get("maintenance_preference", "medium"), 1),
            1 if client_profile.get("preferred_category") == "haircut" else 0,
            1 if client_profile.get("preferred_category") == "coloring" else 0,
            1 if client_profile.get("preferred_category") == "styling" else 0,
        ]])

        client_normalized = self.scaler.transform(client_vec)

        distances, indices = self.nn_model.kneighbors(
            client_normalized, n_neighbors=min(n_recommendations + 2, len(self.STYLE_CATALOG))
        )

        # Filter by face shape compatibility
        face_shape = client_profile.get("face_shape", "oval")
        recommendations = []

        for dist, idx in zip(distances[0], indices[0]):
            style = self.STYLE_CATALOG[idx]
            if "all" in style["face_shapes"] or face_shape in style["face_shapes"]:
                confidence = max(0, 1.0 - dist) * 100
                recommendations.append({
                    "style": style,
                    "confidence": round(confidence, 1),
                    "reason": self._generate_reason(style, client_profile),
                })

            if len(recommendations) >= n_recommendations:
                break

        return recommendations

    def _generate_reason(self, style, profile):
        """Generate a human-readable reason for the recommendation."""
        reasons = []

        face_shape = profile.get("face_shape", "oval")
        if face_shape in style.get("face_shapes", []):
            reasons.append(f"complements your {face_shape} face shape")

        if style["maintenance"] == profile.get("maintenance_preference", "medium"):
            reasons.append("matches your maintenance preference")

        if style["category"] == profile.get("preferred_category"):
            reasons.append(f"aligns with your interest in {style['category']}")

        return "Recommended because it " + " and ".join(reasons) if reasons else "Popular choice among similar clients"

    def get_price_estimate(self, style_id, hair_length="medium", additional_treatments=None):
        """
        Estimate pricing based on style, hair properties, and add-ons.

        Returns estimated price range.
        """
        base_prices = {
            "haircut": {"short": 35, "medium": 45, "long": 55},
            "coloring": {"short": 80, "medium": 120, "long": 160},
            "styling": {"short": 30, "medium": 40, "long": 50},
        }

        style = next((s for s in self.STYLE_CATALOG if s["id"] == style_id), None)
        if not style:
            return {"error": "Style not found"}

        length = hair_length if style["hair_length"] == "any" else style["hair_length"]
        base = base_prices.get(style["category"], {}).get(length, 50)

        treatment_cost = 0
        if additional_treatments:
            treatment_prices = {"deep_conditioning": 25, "keratin": 80, "toner": 30, "gloss": 20}
            for t in additional_treatments:
                treatment_cost += treatment_prices.get(t, 0)

        total = base + treatment_cost
        return {
            "style": style["name"],
            "base_price": base,
            "treatment_cost": treatment_cost,
            "estimated_total": total,
            "price_range": f"${total - 10} - ${total + 15}",
        }
