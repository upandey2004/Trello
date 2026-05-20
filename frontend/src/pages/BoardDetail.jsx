import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';
import { boardService } from '../services/boardService';
import SectionColumn from '../components/SectionColumn'; 

export default function BoardDetail() {
    const { boardId } = useParams();
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [error, setError] = useState('');
    const [board, setBoard] = useState(null);

    // Load board details and sections when the page opens
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch the board to get the name and invite token
                const boardData = await boardService.getBoard(boardId);
                setBoard(boardData);
                // Fetch the sections
                await loadSections();
            } catch (err) {
                setError(err.message);
            }
        };
        loadInitialData();
    }, [boardId]);

    // Isolated so we can call it individually after creating/deleting lists
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
            await sectionService.createSection({
                name: newSectionName,
                board_id: boardId
            });
            setNewSectionName('');
            loadSections(); // Refresh lists
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Are you sure you want to delete this section and all its tickets?")) return;
        try {
            await sectionService.deleteSection(sectionId);
            loadSections(); // Refresh lists
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to="/boards" style={{ textDecoration: 'none', padding: '8px 12px', background: '#e5e4e7', color: '#08060d', borderRadius: '4px' }}>
                        &larr; Back to Boards
                    </Link>
                    <h2>{board ? board.name : 'Loading Board...'}</h2>
                </div>
                
                {/* Share Button (Only visible after board data loads) */}
                {board && (
                    <button 
                        onClick={() => {
                            const inviteUrl = `${window.location.origin}/invite/${board.invitation_token}`;
                            navigator.clipboard.writeText(inviteUrl);
                            alert("Invite link copied to clipboard!");
                        }}
                        style={{ padding: '8px 16px', background: '#aa3bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Share / Invite
                    </button>
                )}
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Kanban Horizontal Scroll Container */}
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', flexGrow: 1, alignItems: 'flex-start' }}>
                
                {/* Render the SectionColumn components */}
                {sections.map(section => (
                    <SectionColumn 
                        key={section.id} 
                        section={section} 
                        onDeleteSection={handleDeleteSection} 
                    />
                ))}

                {/* Add New Section Form */}
                <form onSubmit={handleCreateSection} style={{ minWidth: '280px', width: '280px', background: 'rgba(170, 59, 255, 0.1)', padding: '15px', borderRadius: '8px', flexShrink: 0 }}>
                    <input 
                        type="text" 
                        placeholder="+ Add another list" 
                        value={newSectionName} 
                        onChange={(e) => setNewSectionName(e.target.value)} 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {newSectionName && <button type="submit" style={{ width: '100%', background: '#aa3bff', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save List</button>}
                </form>
                
            </div>
        </div>
    );
}