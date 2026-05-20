import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/boards');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2b204d 0%, #1b1536 100%)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', padding: '40px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>Sign in to your Kanban board</p>
                </div>
                
                {error && (
                    <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Email</label>
                            <input 
                            type="email" 
                            placeholder="you@example.com" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        />
                    </div>
                    <button 
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            fontSize: '15px',
                            marginTop: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = 'var(--shadow-lg)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Sign In
                    </button>
                </form>
                
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>Create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}