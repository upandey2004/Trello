import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.api.dependencies import get_current_user
from app.db.supabase import get_supabase_client

class MockUser:
    id = "user-123"
    email = "test@example.com"

@pytest.fixture
def mock_supabase():
    """Provides a mocked Supabase client."""
    return MagicMock()

@pytest.fixture
def mock_user():
    return MockUser()

@pytest.fixture
def client(mock_supabase, mock_user):
    """Provides a FastAPI TestClient with overridden dependencies."""
    def override_get_supabase():
        return mock_supabase
    
    def override_get_current_user():
        return mock_user

    # Override the dependencies for integration testing
    app.dependency_overrides[get_supabase_client] = override_get_supabase
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    with TestClient(app) as test_client:
        yield test_client
        
    # Clean up overrides after test
    app.dependency_overrides.clear()