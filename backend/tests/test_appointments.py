import pytest
from app import create_app, db
from models.user import User
from models.service import Service


@pytest.fixture
def client():
    app = create_app("testing")
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            _seed_test_data()
            yield client
            db.session.remove()
            db.drop_all()


def _seed_test_data():
    """Create test stylist and service."""
    stylist = User(
        email="stylist@salon.com",
        first_name="Jane",
        last_name="Stylist",
        role="stylist",
    )
    stylist.set_password("pass123")
    db.session.add(stylist)

    service = Service(
        name="Basic Haircut",
        category="haircut",
        base_price=45.0,
        duration_minutes=30,
    )
    db.session.add(service)
    db.session.commit()


def _register_and_get_token(client):
    reg = client.post("/api/auth/register", json={
        "email": "client@test.com",
        "password": "pass123",
        "first_name": "Test",
        "last_name": "Client",
    })
    return reg.get_json()["access_token"]


def test_create_appointment(client):
    token = _register_and_get_token(client)

    response = client.post("/api/appointments/", json={
        "stylist_id": 1,
        "service_id": 1,
        "appointment_date": "2025-11-15T10:00:00",
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 201
    data = response.get_json()
    assert data["appointment"]["status"] == "pending"


def test_get_appointments(client):
    token = _register_and_get_token(client)

    client.post("/api/appointments/", json={
        "stylist_id": 1,
        "service_id": 1,
        "appointment_date": "2025-11-15T10:00:00",
    }, headers={"Authorization": f"Bearer {token}"})

    response = client.get("/api/appointments/", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    assert len(response.get_json()["appointments"]) == 1


def test_cancel_appointment(client):
    token = _register_and_get_token(client)

    create_resp = client.post("/api/appointments/", json={
        "stylist_id": 1,
        "service_id": 1,
        "appointment_date": "2025-11-15T10:00:00",
    }, headers={"Authorization": f"Bearer {token}"})
    apt_id = create_resp.get_json()["appointment"]["id"]

    response = client.delete(f"/api/appointments/{apt_id}", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
