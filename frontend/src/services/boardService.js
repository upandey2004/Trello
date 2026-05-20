import { fetchWithAuth } from './api';

export const boardService = {
    getBoards: () => fetchWithAuth('/boards/'),
    createBoard: (boardData) => fetchWithAuth('/boards/', {
        method: 'POST',
        body: JSON.stringify(boardData)
    })
};