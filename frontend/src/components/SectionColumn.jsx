import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';

export default function SectionColumn({ section, onDeleteSection }) {
    const [tickets, setTickets] = useState([]);
    const [newTicketName, setNewTicketName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        loadTickets();
    }, [section.id]);

    const loadTickets = async () => {
        try {
            const data = await ticketService.getSectionTickets(section.id);
            setTickets(data);
        } catch (error) {
            console.error("Failed to load tickets", error);
        }
    };

    const handleAddTicket = async (e) => {
        e.preventDefault();
        if (!newTicketName.trim()) return;
        try {
            await ticketService.createTicket({ 
                name: newTicketName, 
                section_id: section.id 
            });
            setNewTicketName('');
            setIsAdding(false);
            loadTickets(); // Refresh this column's tickets
        } catch (error) {
            console.error("Failed to create ticket", error);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm("Delete this card?")) return;
        try {
            await ticketService.deleteTicket(ticketId);
            loadTickets();
        } catch (error) {
            console.error("Failed to delete ticket", error);
        }
    };

    return (
        <div style={{ minWidth: '280px', width: '280px', background: '#f4f3ec', padding: '15px', borderRadius: '8px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Column Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#08060d' }}>{section.name}</h3>
                <button onClick={() => onDeleteSection(section.id)} style={{ padding: '4px 8px', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer' }}>
                    X
                </button>
            </div>
            
            {/* Tickets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', flexGrow: 1, overflowY: 'auto' }}>
                {tickets.map(ticket => (
                    <div key={ticket.id} style={{ padding: '10px', background: '#fff', borderRadius: '6px', color: '#08060d', fontSize: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span>{ticket.name}</span>
                        <button onClick={() => handleDeleteTicket(ticket.id)} style={{ border: 'none', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '12px' }}>
                            X
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Card Form / Button */}
            {isAdding ? (
                <form onSubmit={handleAddTicket} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea 
                        autoFocus
                        placeholder="Enter a title for this card..." 
                        value={newTicketName} 
                        onChange={(e) => setNewTicketName(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', resize: 'none', fontFamily: 'inherit' }}
                        rows={2}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" style={{ background: '#aa3bff', color: 'white', padding: '6px 12px', flexGrow: 1 }}>Add Card</button>
                        <button type="button" onClick={() => { setIsAdding(false); setNewTicketName(''); }} style={{ background: '#e5e4e7', color: '#333', padding: '6px 12px' }}>Cancel</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setIsAdding(true)} style={{ width: '100%', background: 'transparent', color: '#6b6375', textAlign: 'left', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                    + Add a card
                </button>
            )}
        </div>
    );
}