import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';
import SectionColumn from '../components/SectionColumn'; 

export default function BoardDetail() {
    const { boardId } = useParams();
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
            loadSections();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Are you sure you want to delete this section and all its tickets?")) return;
        try {
            await sectionService.deleteSection(sectionId);
            loadSections();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/boards" style={{ textDecoration: 'none', padding: '8px 12px', background: '#e5e4e7', color: '#08060d', borderRadius: '4px' }}>
                    &larr; Back to Boards
                </Link>
                <h2>Kanban Board</h2>
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', flexGrow: 1, alignItems: 'flex-start' }}>
                
                {/* Render the new SectionColumn components */}
                {sections.map(section => (
                    <SectionColumn 
                        key={section.id} 
                        section={section} 
                        onDeleteSection={handleDeleteSection} 
                    />
                ))}

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