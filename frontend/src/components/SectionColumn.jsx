import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { sectionService } from '../services/sectionService';
import TicketModal from './TicketModal';
import SectionModal from './SectionModal';

export default function SectionColumn({ section, onDeleteSection, members, isOwner, canCreateTickets, currentUserEmail }) {
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

    // New Function to handle the Done toggle
    const handleToggleDone = async (e, ticket) => {
        e.stopPropagation(); // Prevents the edit modal from opening when clicking the button
        try {
            await ticketService.updateTicket(ticket.id, { is_done: !ticket.is_done });
            loadTickets();
        } catch (error) {
            alert(error.message || "Failed to update task status");
        }
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
                {tickets.map(ticket => {
                    // Status Checks
                    const isMyTicket = ticket.assigned_to && ticket.assigned_to === currentUserEmail;
                    const isDone = ticket.is_done;

                    // Dynamic Styling Logic
                    let bgColor = 'var(--bg-card)';
                    let cardBorder = '1px solid var(--border)';
                    let leftBorder = '1px solid var(--border)';

                    if (isDone) {
                        bgColor = 'rgba(52, 211, 153, 0.15)'; // Green tint
                        cardBorder = '1px solid var(--success)';
                        leftBorder = '3px solid var(--success)';
                    } else if (isMyTicket) {
                        bgColor = 'rgba(124, 58, 237, 0.15)'; // Purple tint
                        cardBorder = '1px solid var(--accent)';
                        leftBorder = '3px solid var(--accent)';
                    }

                    return (
                        <div 
                            key={ticket.id} 
                            onClick={() => setEditingTicket(ticket)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            style={{ 
                                padding: '10px 12px', 
                                backgroundColor: bgColor, 
                                border: cardBorder,
                                borderLeft: leftBorder,
                                borderRadius: 'var(--radius-md)', 
                                color: isMyTicket ? '#fff' : 'var(--text-main)', 
                                fontSize: '13px', 
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '6px',
                                cursor: 'pointer', 
                                transition: 'all 0.2s ease', 
                                wordBreak: 'break-word', 
                                fontWeight: '500' 
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                <span style={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.8 : 1 }}>
                                    {ticket.name}
                                </span>
                                <button 
                                    onClick={(e) => handleDeleteTicket(e, ticket.id)} 
                                    style={{ border: 'none', backgroundColor: 'transparent', color: isMyTicket ? 'var(--text-main)' : 'var(--text-light)', cursor: 'pointer', padding: '0 4px', fontSize: '16px', opacity: 0.6 }} 
                                    title="Delete card"
                                >
                                    &times;
                                </button>
                            </div>
                            
                            {/* Assigned User Indicator */}
                            {ticket.assigned_to && (
                                <div style={{ 
                                    fontSize: '11px', 
                                    color: isMyTicket ? 'var(--text-main)' : 'var(--text-sub)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isDone ? 'var(--success)' : (isMyTicket ? 'var(--text-main)' : 'var(--text-light)') }}></span>
                                    {isMyTicket ? 'Assigned to you' : ticket.assigned_to.split('@')[0]}
                                </div>
                            )}

                            {/* Mark as Done Button - ONLY visible to the assigned user */}
                            {isMyTicket && (
                                <button 
                                    onClick={(e) => handleToggleDone(e, ticket)}
                                    style={{
                                        marginTop: '4px',
                                        padding: '4px 8px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid',
                                        borderColor: isDone ? 'var(--success)' : 'var(--accent)',
                                        backgroundColor: isDone ? 'var(--success)' : 'transparent',
                                        color: isDone ? '#000' : 'var(--text-main)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        alignSelf: 'flex-start'
                                    }}
                                    onMouseEnter={(e) => { if(!isDone) e.target.style.backgroundColor = 'rgba(124, 58, 237, 0.3)'; }}
                                    onMouseLeave={(e) => { if(!isDone) e.target.style.backgroundColor = 'transparent'; }}
                                >
                                    {isDone ? '✓ Completed' : 'Mark as Done'}
                                </button>
                            )}
                        </div>
                    );
                })}

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
            {canCreateTickets && !isAdding && (
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