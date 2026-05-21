import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { sectionService } from '../services/sectionService';
import TicketModal from './TicketModal';
import SectionModal from './SectionModal';

export default function SectionColumn({ section, onDeleteSection, members, isOwner }) {
    const [tickets, setTickets] = useState([]);
    const [newTicketName, setNewTicketName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [editingSection, setEditingSection] = useState(null);

    useEffect(() => { loadTickets(); }, [section.id]);

    const loadTickets = async () => {
        try {
            const data = await ticketService.getSectionTickets(section.id);
            setTickets(data);
        } catch (error) { console.error("Failed to load tickets", error); }
    };

    const handleAddTicket = async (e) => {
        e.preventDefault();
        if (!newTicketName.trim()) return;
        try {
            await ticketService.createTicket({ name: newTicketName, section_id: section.id });
            setNewTicketName('');
            setIsAdding(false);
            loadTickets();
        } catch (error) { console.error("Failed to create ticket", error); }
    };

    const handleDeleteTicket = async (e, ticketId) => {
        e.stopPropagation();
        if (!window.confirm("Delete this card?")) return;
        try {
            await ticketService.deleteTicket(ticketId);
            loadTickets();
        } catch (error) { console.error("Failed to delete ticket", error); }
    };

    const handleSaveTicket = async (ticketId, updatedData) => {
        try {
            await ticketService.updateTicket(ticketId, updatedData);
            setEditingTicket(null);
            loadTickets();
        } catch (error) { alert(error.message || "Failed to update ticket"); }
    };

    const handleSaveSection = async (sectionId, updatedData) => {
        try {
            await sectionService.updateSection(sectionId, updatedData);
            setEditingSection(null);
            window.location.reload();
        } catch (error) { alert(error.message || "Failed to update section"); }
    };

    return (
        <div style={{ minWidth: '280px', width: '280px', backgroundColor: 'var(--bg-list)', padding: '12px', borderRadius: 'var(--radius-lg)', flexShrink: 0, display: 'flex', flexDirection: 'column', maxHeight: '100%', boxShadow: 'var(--shadow-md)' }}>
            
            {/* List Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px 8px', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 onClick={() => isOwner && setEditingSection(section)} style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.3px', cursor: isOwner ? 'pointer' : 'default', transition: 'opacity 0.2s' }} onMouseEnter={(e) => isOwner && (e.target.style.opacity = '0.7')} onMouseLeave={(e) => isOwner && (e.target.style.opacity = '1')}>{section.name}</h3>
                    {isOwner && (
                        <button onClick={() => onDeleteSection(section.id)} style={{ padding: '4px 8px', backgroundColor: 'transparent', color: 'var(--text-light)', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontSize: '16px' }} title="Delete section">
                        &times;
                    </button>
                    )}
            </div>
            
            {/* Scrollable Tickets Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', padding: '8px 2px', flexGrow: 1 }}>
                {tickets.map(ticket => (
                    <div 
                        key={ticket.id} 
                        onClick={() => setEditingTicket(ticket)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                            style={{ padding: '10px 12px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '13px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', transition: 'all 0.2s ease', wordBreak: 'break-word', border: '1px solid var(--border)', fontWeight: '500' }}
                    >
                        <span>{ticket.name}</span>
                            <button onClick={(e) => handleDeleteTicket(e, ticket.id)} style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--text-light)', cursor: 'pointer', padding: '0 4px', fontSize: '16px', opacity: 0.6, hover: 'opacity 0.2s' }} title="Delete card">
                            &times;
                        </button>
                    </div>
                ))}

                {/* Inline Card Composer */}
                {isAdding && (
                    <form onSubmit={handleAddTicket} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                        <textarea 
                            autoFocus
                            placeholder="Enter a title for this card..." 
                            value={newTicketName} 
                            onChange={(e) => setNewTicketName(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: 'var(--radius-md)', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', resize: 'none', fontFamily: 'inherit', fontSize: '13px' }}
                            rows={3}
                        />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button type="submit" style={{ backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 16px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>Add</button>
                                <button type="button" onClick={() => { setIsAdding(false); setNewTicketName(''); }} style={{ backgroundColor: 'transparent', color: 'var(--text-light)', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '0 4px' }}>&times;</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Add Card Trigger */}
            {isOwner && !isAdding && (
                <button 
                    onClick={() => setIsAdding(true)} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--text-sub)', textAlign: 'left', padding: '8px 12px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s', fontSize: '13px', fontWeight: '500' }}
                >
                    <span style={{ fontSize: '18px' }}>+</span> Add a card
                </button>
            )}

            {editingTicket && (
                <TicketModal ticket={editingTicket} onClose={() => setEditingTicket(null)} onSave={handleSaveTicket} members={members} />
            )}

            {editingSection && (
                <SectionModal section={editingSection} onClose={() => setEditingSection(null)} onSave={handleSaveSection} />
            )}
        </div>
    );
}