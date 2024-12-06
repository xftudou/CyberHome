import React, { useState } from 'react';
import './Form.css';

const SignUp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isFormValid = firstname.trim() !== '' && lastname.trim() !== '' && username.trim() !== '' && password.trim() !== '';

    return (
        <div className="form-container">
            <header className="form-header">
                <a href="/" className="nav-link">&larr; BACK</a>
                <a href="/login" className="nav-link">LOGIN</a>
            </header>
            <div className="form-content">
                <h1>Welcome to CyberHome</h1>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="firstname" className="form-label">FIRST NAME</label>
                    <input
                        type="text"
                        id="firstname"
                        className="form-input"
                        placeholder="Enter your first name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />

                    <label htmlFor="lastname" className="form-label">LAST NAME</label>
                    <input
                        type="text"
                        id="lastname"
                        className="form-input"
                        placeholder="Enter your last name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
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