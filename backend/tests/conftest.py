import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.api.dependencies import get_current_user
from app.core.config import settings

class MockUser:
    # Use the secure environment variable!
    id = settings.TEST_USER_ID 
    email = "test@example.com"

@pytest.fixture
def mock_supabase():
    return MagicMock()

@pytest.fixture
def mock_user():
    return MockUser()

@pytest.fixture
def client(mock_user):
    def override_get_current_user():
        return mock_user

    app.dependency_overrides[get_current_user] = override_get_current_user
    
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.clear()