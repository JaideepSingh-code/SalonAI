from app import db
from datetime import datetime


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    stylist_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, confirmed, completed, cancelled
    notes = db.Column(db.Text)
    total_price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    service = db.relationship("Service", backref="appointments")

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "stylist_id": self.stylist_id,
            "service_id": self.service_id,
            "service_name": self.service.name if self.service else None,
            "appointment_date": self.appointment_date.isoformat(),
            "duration_minutes": self.duration_minutes,
            "status": self.status,
            "notes": self.notes,
            "total_price": self.total_price,
            "created_at": self.created_at.isoformat(),
        }
