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
        <div style={{ minHeight: '100vh', background: 'var(--bg-board)' }}>
            {/* Header */}
            <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '20px 30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>My Boards</h1>
                        <p style={{ color: 'var(--text-sub)', fontSize: '14px', margin: '4px 0 0 0' }}>Organize your work and collaborate</p>
                    </div>
                    <button 
                        onClick={logout}
                        style={{
                            padding: '10px 20px',
                            background: 'var(--danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--danger-hover)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--danger)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ padding: '40px 30px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Create Board Section */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Create New Board</h2>
                    <form onSubmit={handleCreateBoard} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Board Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Marketing Campaign" 
                                    value={newBoardName} 
                                    onChange={(e) => setNewBoardName(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e5e7eb', fontSize: '14px' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Description</label>
                                <input 
                                    type="text" 
                                    placeholder="Optional description" 
                                    value={newBoardDesc} 
                                    onChange={(e) => setNewBoardDesc(e.target.value)} 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e5e7eb', fontSize: '14px' }} 
                                />
                            </div>
                            <button 
                                type="submit"
                                style={{
                                    padding: '10px 24px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Create Board
                            </button>
                        </div>
                    </form>
                </div>

                {/* Boards Grid */}
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Your Boards</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {boards.map(board => (
                            <Link 
                                to={`/boards/${board.id}`} 
                                key={board.id} 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div 
                                    style={{
                                        background: 'var(--bg-card)',
                                        padding: '20px',
                                        borderRadius: 'var(--radius-lg)',
                                        boxShadow: 'var(--shadow-sm)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: '1px solid var(--border)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: '80px', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}></div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{board.name}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0 }}>{board.description || 'No description'}</p>
                                    <div style={{ marginTop: 'auto', fontSize: '12px', color: 'var(--text-light)' }}>Click to open</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {boards.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sub)' }}>
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No boards yet</p>
                            <p style={{ fontSize: '14px' }}>Create your first board above to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}