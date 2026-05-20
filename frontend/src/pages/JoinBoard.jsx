import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../services/boardService';

export default function JoinBoard() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const processInvite = async () => {
            try {
                // Tell the backend to add us to the board using the token
                const board = await boardService.joinBoard(token);
                // Redirect straight to the board!
                navigate(`/boards/${board.id}`);
            } catch (err) {
                setError(err.message || "Failed to join board.");
            }
        };

        processInvite();
    }, [token, navigate]);

    if (error) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2 style={{ color: 'red' }}>Oops!</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/boards')} style={{ padding: '8px 16px', marginTop: '20px' }}>Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Joining Board...</h2>
            <p>Please wait while we verify your invitation.</p>
        </div>
    );
}