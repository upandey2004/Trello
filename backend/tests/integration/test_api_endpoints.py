import pytest

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "System is operational"}


@pytest.fixture
def temp_board(client):
    """Creates a temporary board and cleans it up after the test."""
    # 1. Setup
    payload = {"name": "Integration Test Board", "description": "Will be deleted"}
    response = client.post("/api/v1/boards/", json=payload)
    assert response.status_code == 200
    board = response.json()
    
    # 2. Yield to test
    yield board
    
    # 3. Teardown (runs after test completes)
    client.delete(f"/api/v1/boards/{board['id']}")

@pytest.fixture
def temp_section(client, temp_board):
    """Creates a temporary section inside the temporary board."""
    # 1. Setup
    payload = {"name": "Integration Test Section", "board_id": temp_board["id"]}
    response = client.post("/api/v1/sections", json=payload)
    assert response.status_code == 200
    section = response.json()
    
    # 2. Yield to test
    yield section
    
    # 3. Teardown
    # Note: Because your SQL schema uses 'ON DELETE CASCADE', deleting the board 
    client.delete(f"/api/v1/sections/{section['id']}")

# --- REAL DATABASE INTEGRATION TESTS ---

def test_create_and_get_board(client, temp_board):
    # The `temp_board` fixture already created the board.
    # Let's verify our GET endpoint can actually see it in the real database.
    response = client.get("/api/v1/boards/")
    assert response.status_code == 200
    boards = response.json()
    
    # Verify the ID of our temporary board exists in the list returned by the DB
    assert any(b["id"] == temp_board["id"] for b in boards)

def test_create_and_get_sections(client, temp_board, temp_section):
   
    response = client.get(f"/api/v1/sections/board/{temp_board['id']}")
    assert response.status_code == 200
    sections = response.json()
    
    assert len(sections) >= 1
    assert any(s["id"] == temp_section["id"] for s in sections)

def test_create_and_get_tickets(client, temp_section):
    # We create the ticket manually in this test to verify the POST endpoint
    payload = {"name": "Integration Test Ticket", "section_id": temp_section["id"]}
    create_res = client.post("/api/v1/tickets", json=payload)
    
    assert create_res.status_code == 200
    ticket = create_res.json()
    
    # Now test the GET endpoint
    get_res = client.get(f"/api/v1/tickets/section/{temp_section['id']}")
    assert get_res.status_code == 200
    tickets = get_res.json()
    
    assert any(t["id"] == ticket["id"] for t in tickets)
    
    # Cleanup the ticket
    client.delete(f"/api/v1/tickets/{ticket['id']}")