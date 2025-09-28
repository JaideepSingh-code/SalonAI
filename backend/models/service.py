from app import db
from datetime import datetime


class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # haircut, coloring, styling, treatment
    base_price = db.Column(db.Float, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "base_price": self.base_price,
            "duration_minutes": self.duration_minutes,
            "is_active": self.is_active,
        }
