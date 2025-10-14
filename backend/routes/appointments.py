from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.appointment import Appointment
from models.service import Service
from models.user import User
from app import db
from datetime import datetime

appointments_bp = Blueprint("appointments", __name__)


@appointments_bp.route("/", methods=["GET"])
@jwt_required()
def get_appointments():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role == "stylist":
        appointments = Appointment.query.filter_by(stylist_id=user_id).all()
    elif user.role == "admin":
        appointments = Appointment.query.all()
    else:
        appointments = Appointment.query.filter_by(client_id=user_id).all()

    return jsonify({
        "appointments": [a.to_dict() for a in appointments]
    }), 200


@appointments_bp.route("/", methods=["POST"])
@jwt_required()
def create_appointment():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    required_fields = ["stylist_id", "service_id", "appointment_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    service = Service.query.get(data["service_id"])
    if not service:
        return jsonify({"error": "Service not found"}), 404

    stylist = User.query.get(data["stylist_id"])
    if not stylist or stylist.role != "stylist":
        return jsonify({"error": "Invalid stylist"}), 404

    appointment_date = datetime.fromisoformat(data["appointment_date"])

    # Check for scheduling conflicts
    conflict = Appointment.query.filter(
        Appointment.stylist_id == data["stylist_id"],
        Appointment.appointment_date == appointment_date,
        Appointment.status.in_(["pending", "confirmed"]),
    ).first()

    if conflict:
        return jsonify({"error": "Time slot not available"}), 409

    appointment = Appointment(
        client_id=user_id,
        stylist_id=data["stylist_id"],
        service_id=data["service_id"],
        appointment_date=appointment_date,
        duration_minutes=service.duration_minutes,
        total_price=service.base_price,
        notes=data.get("notes", ""),
        status="pending",
    )

    db.session.add(appointment)
    db.session.commit()

    return jsonify({
        "message": "Appointment created",
        "appointment": appointment.to_dict(),
    }), 201


@appointments_bp.route("/<int:appointment_id>", methods=["PUT"])
@jwt_required()
def update_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    data = request.get_json()

    if "status" in data:
        appointment.status = data["status"]
    if "appointment_date" in data:
        appointment.appointment_date = datetime.fromisoformat(data["appointment_date"])
    if "notes" in data:
        appointment.notes = data["notes"]

    db.session.commit()
    return jsonify({
        "message": "Appointment updated",
        "appointment": appointment.to_dict(),
    }), 200


@appointments_bp.route("/<int:appointment_id>", methods=["DELETE"])
@jwt_required()
def cancel_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    appointment.status = "cancelled"
    db.session.commit()

    return jsonify({"message": "Appointment cancelled"}), 200
