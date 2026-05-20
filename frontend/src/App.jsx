import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css'; // You can delete the default App.css styles if they mess up the layout
import BoardDetail from './pages/BoardDetail';
import JoinBoard from './pages/JoinBoard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/boards" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/boards" replace />} />
                    <Route 
    path="/boards/:boardId" 
    element={
        <ProtectedRoute>
            <BoardDetail />
        </ProtectedRoute>
    } 
/>
<Route 
    path="/invite/:token" 
    element={
        <ProtectedRoute>
            <JoinBoard />
        </ProtectedRoute>
    } 
/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;