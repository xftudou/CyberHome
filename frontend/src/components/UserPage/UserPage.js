import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./UserPage.css"
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

function UserPage() {
    const [user, setUser] = useState(null);
    const { username } = useParams();

    useEffect(() => {
        axios.get(`/api/users/${username}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [username]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='userpage'>
            <h1>{user.name}</h1>
            <h2>List of Posts</h2>
        </div>
    );
}

export default UserPage;