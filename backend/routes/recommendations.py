from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ai.recommender import StyleRecommender

recommendations_bp = Blueprint("recommendations", __name__)
recommender = StyleRecommender()


@recommendations_bp.route("/", methods=["POST"])
@jwt_required()
def get_recommendations():
    data = request.get_json()

    client_profile = {
        "preferred_length": data.get("preferred_length", "medium"),
        "maintenance_preference": data.get("maintenance_preference", "medium"),
        "face_shape": data.get("face_shape", "oval"),
        "preferred_category": data.get("preferred_category"),
    }

    n = data.get("n_recommendations", 3)
    recommendations = recommender.get_recommendations(client_profile, n)

    return jsonify({"recommendations": recommendations}), 200


@recommendations_bp.route("/price-estimate", methods=["POST"])
@jwt_required()
def get_price_estimate():
    data = request.get_json()

    style_id = data.get("style_id")
    if not style_id:
        return jsonify({"error": "style_id is required"}), 400

    estimate = recommender.get_price_estimate(
        style_id=style_id,
        hair_length=data.get("hair_length", "medium"),
        additional_treatments=data.get("additional_treatments"),
    )

    return jsonify({"estimate": estimate}), 200


@recommendations_bp.route("/styles", methods=["GET"])
def get_style_catalog():
    """Return all available styles in the catalog."""
    return jsonify({"styles": StyleRecommender.STYLE_CATALOG}), 200
