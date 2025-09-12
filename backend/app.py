from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import config_by_name
import os

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=["http://localhost:3000"])

    # Register blueprints
    from routes.auth import auth_bp
    from routes.appointments import appointments_bp
    from routes.services import services_bp
    from routes.recommendations import recommendations_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(appointments_bp, url_prefix="/api/appointments")
    app.register_blueprint(services_bp, url_prefix="/api/services")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")

    # Create tables
    with app.app_context():
        from models import user, appointment, service  # noqa: F401
        db.create_all()

    @app.route("/api/health")
    def health_check():
        return {"status": "healthy", "service": "SalonAI API"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
