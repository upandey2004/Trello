import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import TicketModal from './TicketModal.jsx'; // <-- Import the new modal component

export default function SectionColumn({ section, onDeleteSection }) {
    const [tickets, setTickets] = useState([]);
    const [newTicketName, setNewTicketName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    // New state to track which ticket is currently being edited
    const [editingTicket, setEditingTicket] = useState(null);

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
            await ticketService.createTicket({ name: newTicketName, section_id: section.id });
            setNewTicketName('');
            setIsAdding(false);
            loadTickets();
        } catch (error) {
            console.error("Failed to create ticket", error);
        }
    };

    const handleDeleteTicket = async (e, ticketId) => {
        e.stopPropagation(); // Prevents the modal from opening when you click delete
        if (!window.confirm("Delete this card?")) return;
        try {
            await ticketService.deleteTicket(ticketId);
            loadTickets();
        } catch (error) {
            console.error("Failed to delete ticket", error);
        }
    };

    // New function to handle saving the edited ticket
    const handleSaveTicket = async (ticketId, updatedData) => {
        try {
            await ticketService.updateTicket(ticketId, updatedData);
            setEditingTicket(null); // Close the modal
            loadTickets(); // Refresh the list to show the new title
        } catch (error) {
            console.error("Failed to update ticket", error);
        }
    };

    return (
        <div style={{ minWidth: '280px', width: '280px', background: '#f4f3ec', padding: '15px', borderRadius: '8px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#08060d' }}>{section.name}</h3>
                <button onClick={() => onDeleteSection(section.id)} style={{ padding: '4px 8px', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer' }}>X</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', flexGrow: 1, overflowY: 'auto' }}>
                {tickets.map(ticket => (
                    <div 
                        key={ticket.id} 
                        onClick={() => setEditingTicket(ticket)} // <-- Click to open modal
                        style={{ padding: '10px', background: '#fff', borderRadius: '6px', color: '#08060d', fontSize: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                    >
                        <span>{ticket.name}</span>
                        <button onClick={(e) => handleDeleteTicket(e, ticket.id)} style={{ border: 'none', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '12px' }}>X</button>
                    </div>
                ))}
            </div>

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
                        <button type="submit" style={{ background: '#aa3bff', color: 'white', padding: '6px 12px', flexGrow: 1, border: 'none', borderRadius: '4px' }}>Add Card</button>
                        <button type="button" onClick={() => { setIsAdding(false); setNewTicketName(''); }} style={{ background: '#e5e4e7', color: '#333', padding: '6px 12px', border: 'none', borderRadius: '4px' }}>Cancel</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setIsAdding(true)} style={{ width: '100%', background: 'transparent', color: '#6b6375', textAlign: 'left', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                    + Add a card
                </button>
            )}

            {/* Conditionally render the modal if a ticket is selected */}
            {editingTicket && (
                <TicketModal 
                    ticket={editingTicket} 
                    onClose={() => setEditingTicket(null)} 
                    onSave={handleSaveTicket} 
                />
            )}
        </div>
    );
}