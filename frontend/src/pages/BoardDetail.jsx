import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';

export default function BoardDetail() {
    const { boardId } = useParams(); // Get the board ID from the URL
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadSections();
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
            await sectionService.createSection({
                name: newSectionName,
                board_id: boardId
            });
            setNewSectionName('');
            loadSections(); // Refresh the board
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Are you sure you want to delete this section?")) return;
        try {
            await sectionService.deleteSection(sectionId);
            loadSections();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/boards" style={{ textDecoration: 'none', padding: '8px 12px', background: '#e5e4e7', color: '#08060d', borderRadius: '4px' }}>
                    &larr; Back to Boards
                </Link>
                <h2>Kanban Board</h2>
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Kanban Horizontal Scroll Container */}
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', flexGrow: 1, alignItems: 'flex-start' }}>
                
                {/* Render Existing Sections */}
                {sections.map(section => (
                    <div key={section.id} style={{ minWidth: '280px', width: '280px', background: '#f4f3ec', padding: '15px', borderRadius: '8px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#08060d' }}>{section.name}</h3>
                            <button onClick={() => handleDeleteSection(section.id)} style={{ padding: '4px 8px', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer' }}>
                                X
                            </button>
                        </div>
                        
                        {/* Placeholder for Tickets (Next Phase) */}
                        <div style={{ padding: '10px', background: '#fff', borderRadius: '4px', color: '#6b6375', fontSize: '14px', textAlign: 'center', border: '1px dashed #ccc' }}>
                            Tickets will go here
                        </div>
                    </div>
                ))}

                {/* Add New Section Form */}
                <form onSubmit={handleCreateSection} style={{ minWidth: '280px', width: '280px', background: 'rgba(170, 59, 255, 0.1)', padding: '15px', borderRadius: '8px', flexShrink: 0 }}>
                    <input 
                        type="text" 
                        placeholder="+ Add a list" 
                        value={newSectionName} 
                        onChange={(e) => setNewSectionName(e.target.value)} 
                        style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}
                    />
                    {newSectionName && <button type="submit" style={{ width: '100%', background: '#aa3bff', color: 'white' }}>Save List</button>}
                </form>
                
            </div>
        </div>
    );
}