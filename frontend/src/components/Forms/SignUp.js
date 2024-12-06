import React, { useState } from 'react';
import './Form.css';

const SignUp = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isFormValid = name.trim() !== '' && username.trim() !== '' && password.trim() !== '';

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!isFormValid) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful!');
            } else if (response.status === 409) {
                alert(data.error);
            } else {
                alert(data.error || 'Failed to sign up');
            }

        } catch (err) {
            setError(err.message);
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="form-container">
            <header className="form-header">
                <a href="/" className="nav-link">&larr; BACK</a>
                <a href="/login" className="nav-link">LOGIN</a>
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