import { fetchWithAuth } from './api';

export const sectionService = {
    getBoardSections: (boardId) => fetchWithAuth(`/sections/board/${boardId}`),
    
    createSection: (sectionData) => fetchWithAuth('/sections', {
        method: 'POST',
        body: JSON.stringify(sectionData)
    }),

    updateSection: (sectionId, sectionData) => fetchWithAuth(`/sections/${sectionId}`, {
        method: 'PUT',
        body: JSON.stringify(sectionData)
    }),

    deleteSection: (sectionId) => fetchWithAuth(`/sections/${sectionId}`, {
        method: 'DELETE'
    })
};