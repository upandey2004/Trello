import { useState } from 'react';

export default function TicketModal({ ticket, onClose, onSave, members = [] }) {
    // Local state for the form so we only save when the user clicks "Save"
    const [name, setName] = useState(ticket.name);
    const [description, setDescription] = useState(ticket.description || '');
    const [assignedTo, setAssignedTo] = useState(ticket.assigned_to || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the assigned_to value back to the parent component
        onSave(ticket.id, { name, description, assigned_to: assignedTo });
    };

    return (
        // The dark background overlay
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            
            {/* The modal box itself */}
                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', width: '500px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px', fontWeight: '700' }}>Edit Card</h3>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-light)', padding: '0 4px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-light)'}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>Title</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                                style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        />
                    </div>

                    <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Add a more detailed description..."
                                style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.2s', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        />
                    </div>

                    {/* Dropdown Assigned To Field */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>Assigned To</label>
                        <select 
                            value={assignedTo} 
                            onChange={(e) => setAssignedTo(e.target.value)} 
                            style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s', background: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', appearance: 'auto' }}
                        >
                            <option value="">-- Unassigned --</option>
                            {members.map(email => (
                                <option key={email} value={email}>{email}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                            <button type="button" onClick={onClose} style={{ padding: '10px 18px', background: 'var(--bg-list)', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#e5e7eb'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--bg-list)'; }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = 'var(--shadow-lg)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}