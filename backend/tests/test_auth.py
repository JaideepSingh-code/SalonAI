import pytest
from app import create_app, db


@pytest.fixture
def client():
    app = create_app("testing")
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "securepass123",
        "first_name": "Test",
        "last_name": "User",
    })
    assert response.status_code == 201
    data = response.get_json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "pass123",
        "first_name": "Test",
        "last_name": "User",
    })
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "pass456",
        "first_name": "Test2",
        "last_name": "User2",
    })
    assert response.status_code == 409


def test_login_success(client):
    client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "securepass123",
        "first_name": "Test",
        "last_name": "User",
    })
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "securepass123",
    })
    assert response.status_code == 200
    assert "access_token" in response.get_json()


def test_login_invalid_password(client):
    client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "securepass123",
        "first_name": "Test",
        "last_name": "User",
    })
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 401


def test_get_current_user(client):
    reg = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "securepass123",
        "first_name": "Test",
        "last_name": "User",
    })
    token = reg.get_json()["access_token"]

    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    assert response.get_json()["user"]["email"] == "test@example.com"
