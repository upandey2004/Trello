import { fetchWithAuth } from './api';

export const boardService = {
    getBoards: () => fetchWithAuth('/boards'),
    createBoard: (boardData) => fetchWithAuth('/boards', { 
        method: 'POST',
        body: JSON.stringify(boardData)
    }),
    
    getBoard: (boardId) => fetchWithAuth(`/boards/${boardId}`),
    joinBoard: (token) => fetchWithAuth(`/boards/join/${token}`, { method: 'POST' }),
    getBoardMembers: (boardId) => fetchWithAuth(`/boards/${boardId}/members`)
};