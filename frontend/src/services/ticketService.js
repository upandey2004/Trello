import { fetchWithAuth } from './api';

export const ticketService = {
    getSectionTickets: (sectionId) => fetchWithAuth(`/tickets/section/${sectionId}`),
    
    createTicket: (ticketData) => fetchWithAuth('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData)
    }),

    updateTicket: (ticketId, ticketData) => fetchWithAuth(`/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(ticketData)
    }),

    deleteTicket: (ticketId) => fetchWithAuth(`/tickets/${ticketId}`, {
        method: 'DELETE'
    })
};