from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.service import Service
from models.user import User
from app import db

services_bp = Blueprint("services", __name__)


@services_bp.route("/", methods=["GET"])
def get_services():
    category = request.args.get("category")

    query = Service.query.filter_by(is_active=True)
    if category:
        query = query.filter_by(category=category)

    services = query.all()
    return jsonify({"services": [s.to_dict() for s in services]}), 200


@services_bp.route("/<int:service_id>", methods=["GET"])
def get_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    return jsonify({"service": service.to_dict()}), 200


@services_bp.route("/", methods=["POST"])
@jwt_required()
def create_service():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.get_json()
    required_fields = ["name", "base_price", "duration_minutes"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    service = Service(
        name=data["name"],
        description=data.get("description", ""),
        category=data.get("category", "general"),
        base_price=data["base_price"],
        duration_minutes=data["duration_minutes"],
    )

    db.session.add(service)
    db.session.commit()

    return jsonify({
        "message": "Service created",
        "service": service.to_dict(),
    }), 201


@services_bp.route("/<int:service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    data = request.get_json()
    for field in ["name", "description", "category", "base_price", "duration_minutes", "is_active"]:
        if field in data:
            setattr(service, field, data[field])

    db.session.commit()
    return jsonify({
        "message": "Service updated",
        "service": service.to_dict(),
    }), 200
