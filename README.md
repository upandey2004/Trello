# Kanban Board (Trello Clone)

A full-stack Kanban board application featuring persistent lists, draggable cards, user assignment, and secure board invitations.

## 🚀 Tech Stack
* **Frontend:** React (Vite), React Router
* **Backend:** Python, FastAPI, Pydantic
* **Database & Auth:** Supabase (PostgreSQL)

---

## 🛠️ Local Environment Setup Instructions

### Prerequisites
Before you begin, ensure you have the following installed:
* Python 3.10+
* Node.js (v18+)
* A free [Supabase](https://supabase.com) account

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. Go to **Authentication -> Providers -> Email** and disable "Confirm email".
3. Open the **SQL Editor** in Supabase and run the following queries to create the schema:

\`\`\`sql
-- Run this to build the tables
CREATE TABLE boards (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    owner_id uuid references auth.users(id) not null,
    invitation_token uuid default gen_random_uuid() unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE board_members (
    id uuid default gen_random_uuid() primary key,
    board_id uuid references boards(id) on delete cascade not null,
    user_id uuid references auth.users(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
\`\`\`
4. Go to the **Table Editor**, click on each of the 4 tables (`boards`, `board_members`, `sections`, `tickets`), and **Disable RLS** (Row Level Security).

### 2. Backend Setup (FastAPI)
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Create and activate a virtual environment:
   \`\`\`bash
   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   \`\`\`
3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   pip install -r requirements-test.txt
   \`\`\`
4. Create a `.env` file in the `backend` folder and add your Supabase credentials:
   \`\`\`env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-public-key
   \`\`\`
5. Start the server:
   \`\`\`bash
   uvicorn app.main:app --reload
   \`\`\`
   *The backend will run on http://127.0.0.1:8000*

### 3. Frontend Setup (React)
1. Open a new terminal and navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the `frontend` folder to point to the local backend:
   \`\`\`env
   VITE_API_URL=http://127.0.0.1:8000/api/v1
   \`\`\`
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *The frontend will run on http://localhost:5173*

---

## 🧪 Testing Environment Setup

The backend features a comprehensive testing suite using `pytest`. It includes isolated unit tests (using a mocked database) and integration tests (hitting the live Supabase instance with teardown logic).

### 1. Test Environment Variables
To run the integration tests safely, you must provide a valid test user ID in your backend `.env` file. This is used to bypass authentication during automated tests.

Update your `backend/.env` file to include:
\`\`\`env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
TEST_USER_ID=your-real-user-uuid-from-supabase-auth
\`\`\`

### 2. Running Tests
Ensure your virtual environment is activated and you are in the `backend` directory. *(Note: We use `python -m pytest` to automatically resolve path and import issues).*

* **Run all tests (Unit + Integration):**
    \`\`\`bash
    python -m pytest
    \`\`\`
* **Run only Unit Tests (Fast, no DB required):**
    \`\`\`bash
    python -m pytest tests/unit/
    \`\`\`
* **Run only Integration Tests (Requires DB & TEST_USER_ID):**
    \`\`\`bash
    python -m pytest tests/integration/
    \`\`\`

### 3. Generating Coverage Reports
We use `pytest-cov` to measure code coverage.

* **Generate Combined Coverage Report:**
    \`\`\`bash
    python -m pytest --cov=app --cov-report=html tests/
    \`\`\`
* **Generate Separate Reports:**
    \`\`\`bash
    python -m pytest --cov=app --cov-report=html:htmlcov_unit tests/unit/
    python -m pytest --cov=app --cov-report=html:htmlcov_integration tests/integration/
    \`\`\`

### 4. Viewing the Reports
To view the interactive HTML coverage reports with their proper styling, start a local Python web server inside the generated directory:

\`\`\`bash
cd htmlcov  # Or htmlcov_unit / htmlcov_integration
python -m http.server 8080
\`\`\`
Then, open `http://localhost:8080` in your web browser. When finished, press `Ctrl+C` in the terminal to stop the server.