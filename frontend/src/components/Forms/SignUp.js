import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Form.css';
import { useAuth } from '../../contexts/AuthContext';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isFormValid = name.trim() !== '' && username.trim() !== '' && password.trim() !== '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('/users/signup', {
                name,
                username,
                password
            });

            if (response.status === 201) {
                alert('Signup successful!');
                login({ name: response.data.name, username: response.data.username });
                navigate(`/user/${response.data.username}`);
            }

        } catch (err) {
            if (err.response) {
                alert(err.response.data.error || 'Failed to sign up');
            } else if (err.request) {
                alert('No response from server. Please try again later.');
            } else {
                alert('Error: ' + err.message);
            }

            console.error('Signup error:', err);
        }
    };

    return (
        <div className="form-container">
            <header className="form-header">
                <Link to="/" className="nav-link">&larr; BACK</Link>
                <Link to="/login" className="nav-link">LOGIN</Link>
            </header>
            <div className="form-content">
                <h1>Welcome to CyberHome</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="name" className="form-label">NAME</label>
                    <input
                        type="text"
                        id="name"
                        className="form-input"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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
                        SIGN UP
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;