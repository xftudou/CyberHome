import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!isFormValid) return;

        try {
            const response = await axios.post('/users/login', {
                username,
                password
            });

            if (response.status === 200) {
                navigate(`/user/${response.data.username}`);
            } else {
                alert('Failed to log in. Please check your credentials.');
            }
        } catch (error) {
            alert('Login error:', error.response?.data?.message || 'Unexpected error occurred');
        }
    };

    return (
        <div className="form-container">
            <header className="form-header">
                <Link to="/" className="nav-link">&larr; BACK</Link>
                <Link to="/signup" className="nav-link">SIGN UP</Link>
            </header>
            <div className="form-content">
                <h1>Log into CyberHome</h1>
                <form className="form" onSubmit={handleLogin}>
                    <label htmlFor="username" className="form-label">USERNAME</label>
                    <input
                        type="text"
                        id="username"
                        className="form-input"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password" className="form-label">PASSWORD</label>
                    <div className="password-container">
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`form-button ${isFormValid ? 'active' : ''}`}
                        disabled={!isFormValid}
                    >
                        LOG IN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;