import { useEffect, useState } from 'react';
import { boardService } from '../services/boardService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [boards, setBoards] = useState([]);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDesc, setNewBoardDesc] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        loadBoards();
    }, []);

    const loadBoards = async () => {
        try {
            const data = await boardService.getBoards();
            setBoards(data);
        } catch (error) {
            console.error("Failed to load boards", error);
        }
    };

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardName) return;
        try {
            await boardService.createBoard({ name: newBoardName, description: newBoardDesc });
            setNewBoardName('');
            setNewBoardDesc('');
            loadBoards(); // Refresh list
        } catch (error) {
            console.error("Failed to create board", error);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>My Boards</h2>
                <button onClick={logout}>Logout</button>
            </div>

            <form onSubmit={handleCreateBoard} style={{ marginBottom: '20px', padding: '15px', background: '#f4f3ec', borderRadius: '8px' }}>
                <h3>Create New Board</h3>
                <input type="text" placeholder="Board Name" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} required style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Description (Optional)" value={newBoardDesc} onChange={(e) => setNewBoardDesc(e.target.value)} style={{ marginRight: '10px' }} />
                <button type="submit">Create Board</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
    {boards.map(board => (
        <Link 
            to={`/boards/${board.id}`} 
            key={board.id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', height: '100%', transition: 'box-shadow 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                 onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
                <h3>{board.name}</h3>
                <p>{board.description}</p>
            </div>
        </Link>
    ))}
    {boards.length === 0 && <p>No boards found. Create one above!</p>}
</div>
        </div>
    );
}