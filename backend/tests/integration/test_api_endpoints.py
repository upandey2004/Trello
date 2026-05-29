def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "System is operational"}

# --- BOARDS API TESTS ---
def test_create_board_endpoint(client, mock_supabase):
    mock_supabase.table().insert().execute.return_value.data = [
        {"id": "b-1", "name": "New Board", "owner_id": "user-123", "invitation_token": "token-1"}
    ]
    
    payload = {"name": "New Board", "description": "My test board"}
    response = client.post("/api/v1/boards/", json=payload)
    
    assert response.status_code == 200
    assert response.json()["name"] == "New Board"

def test_get_my_boards_endpoint(client, mock_supabase):
    mock_supabase.table().select().eq().execute.return_value.data = [
        {"board_id": "b-1", "boards": {"id": "b-1", "name": "B1"}},
        {"board_id": "b-2", "boards": {"id": "b-2", "name": "B2"}}
    ]
    
    response = client.get("/api/v1/boards/")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["name"] == "B1"

# --- SECTIONS API TESTS ---
def test_create_section_endpoint(client, mock_supabase):
    # Mock board ownership check
    mock_supabase.table().select().eq().execute.return_value.data = [{"owner_id": "user-123"}]
    # Mock section creation
    mock_supabase.table().insert().execute.return_value.data = [
        {"id": "s-1", "name": "To Do", "board_id": "b-1"}
    ]
    
    payload = {"name": "To Do", "board_id": "b-1"}
    response = client.post("/api/v1/sections", json=payload)
    
    assert response.status_code == 200
    assert response.json()["name"] == "To Do"

def test_get_sections_endpoint(client, mock_supabase):
    mock_supabase.table().select().eq().execute.return_value.data = [
        {"id": "s-1", "name": "To Do", "board_id": "b-1"},
        {"id": "s-2", "name": "Done", "board_id": "b-1"}
    ]
    
    response = client.get("/api/v1/sections/board/b-1")
    assert response.status_code == 200
    assert len(response.json()) == 2

# --- TICKETS API TESTS ---
def test_get_tickets_endpoint(client, mock_supabase):
    mock_supabase.table().select().eq().order().execute.return_value.data = [
        {"id": "t-1", "name": "Task 1", "section_id": "s-1", "created_at": "2026-05-21T00:00:00Z"},
    ]
    
    response = client.get("/api/v1/tickets/section/s-1")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Task 1"