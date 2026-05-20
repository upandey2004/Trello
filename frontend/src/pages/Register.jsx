import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Register() {
    const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2b204d 0%, #1b1536 100%)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', padding: '40px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>Join and start organizing your projects</p>
                </div>
                
                {error && (
                    <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>First Name</label>
                            <input 
                                name="first_name" 
                                placeholder="John" 
                                required 
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Last Name</label>
                            <input 
                                name="last_name" 
                                placeholder="Doe" 
                                required 
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Email</label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            required 
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-main)' }}>Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            onChange={handleChange}
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
                        Create Account
                    </button>
                </form>
                
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}