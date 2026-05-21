import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';
import { boardService } from '../services/boardService';
import { authService } from '../services/authService';
import SectionColumn from '../components/SectionColumn'; 

export default function BoardDetail() {
    const { boardId } = useParams();
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [error, setError] = useState('');
    const [board, setBoard] = useState(null);
    const [members, setMembers] = useState([]);
    
    // Get the current user's email and ID
    const currentUserEmail = authService.getCurrentUserEmail();
    const currentUserId = authService.getCurrentUserId();
    const isOwner = board?.owner_id === currentUserId;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const boardData = await boardService.getBoard(boardId);
                setBoard(boardData);

                // Fetch the member emails
                const membersData = await boardService.getBoardMembers(boardId);
                setMembers(membersData);

                await loadSections();
            } catch (err) {
                setError(err.message);
            }
        };
        loadInitialData();
    }, [boardId]);

    const loadSections = async () => {
        try {
            const data = await sectionService.getBoardSections(boardId);
            setSections(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateSection = async (e) => {
        e.preventDefault();
        if (!newSectionName.trim()) return;
        
        try {
            await sectionService.createSection({ name: newSectionName, board_id: boardId });
            setNewSectionName('');
            loadSections();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Delete this entire list and all its cards?")) return;
        try {
            await sectionService.deleteSection(sectionId);
            loadSections();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-board)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Link 
                        to="/boards" 
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--bg-list)',
                            color: 'var(--text-main)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            fontSize: '14px',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                            e.currentTarget.style.borderColor = 'var(--text-light)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-list)';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        ← Back
                    </Link>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{board ? board.name : 'Loading...'}</h2>
                </div>
                
                {board && (
                    <button 
                        onClick={() => {
                            const inviteUrl = `${window.location.origin}/invite/${board.invitation_token}`;
                            navigator.clipboard.writeText(inviteUrl);
                            alert("Invite link copied to clipboard!");
                        }}
                        style={{
                            padding: '10px 18px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
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
                        Share Board
                    </button>
                )}
            </div>
            
            {error && <div style={{ padding: '12px 24px', backgroundColor: 'rgba(251,113,133,0.08)', color: 'var(--danger)', fontWeight: '500', fontSize: '14px' }}>{error}</div>}

            {/* Kanban Canvas */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '24px', flexGrow: 1, alignItems: 'flex-start' }}>
                
                {sections.map(section => (
                    <SectionColumn 
                        key={section.id} 
                        section={section} 
                        onDeleteSection={handleDeleteSection} 
                        members={members} 
                        isOwner={isOwner} 
                        canCreateTickets={Boolean(board)} 
                        currentUserEmail={currentUserEmail} /* <--- PROP ADDED HERE */
                    />
                ))}

                {isOwner && (
                    <form onSubmit={handleCreateSection} style={{ minWidth: '280px', width: '280px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-lg)', flexShrink: 0, backdropFilter: 'blur(6px)', border: '2px dashed var(--border)', transition: 'all 0.2s' }}>
                        <input 
                            type="text" 
                            placeholder="+ Add another list" 
                            value={newSectionName} 
                            onChange={(e) => setNewSectionName(e.target.value)} 
                            style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box', marginBottom: '8px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--bg-card)', boxShadow: 'inset 0 0 0 1px var(--border)', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}
                        />
                        {newSectionName && (
                            <button 
                                type="submit" 
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Add List
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}