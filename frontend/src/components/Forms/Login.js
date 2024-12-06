import React, { useState } from 'react';
import './Form.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    return (
        <div className="form-container">
            <header className="form-header">
                <a href="/" className="nav-link">&larr; BACK</a>
                <a href="/signup" className="nav-link">SIGN UP</a>
            </header>
            <div className="form-content">
                <h1>Log into CyberHome</h1>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
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