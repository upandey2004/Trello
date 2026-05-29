import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate

def test_register_user(mock_supabase):
    service = AuthService(mock_supabase)
    
    # Mock the Supabase sign_up response
    mock_response = MagicMock()
    mock_response.user.id = "new-user-123"
    mock_supabase.auth.sign_up.return_value = mock_response
    
    user_in = UserCreate(email="test@example.com", password="password123", first_name="John", last_name="Doe")
    result = service.register_user(user_in)
    
    assert result.user.id == "new-user-123"
    mock_supabase.auth.sign_up.assert_called_once()

def test_login_user_success(mock_supabase):
    service = AuthService(mock_supabase)
    
    # Mock a successful login with a session
    mock_response = MagicMock()
    mock_response.session.access_token = "valid-jwt-token"
    mock_supabase.auth.sign_in_with_password.return_value = mock_response
    
    result = service.login_user("test@example.com", "password123")
    assert result.session.access_token == "valid-jwt-token"

def test_login_user_failure(mock_supabase):
    service = AuthService(mock_supabase)
    
    # Mock a failed login (Supabase returns no session)
    mock_response = MagicMock()
    mock_response.session = None
    mock_supabase.auth.sign_in_with_password.return_value = mock_response
    
    # Verify that our FastAPI backend correctly raises an HTTP 401 error
    with pytest.raises(HTTPException) as excinfo:
        service.login_user("test@example.com", "wrong-password")
        
    assert excinfo.value.status_code == 401
    assert "Invalid email or password" in excinfo.value.detail