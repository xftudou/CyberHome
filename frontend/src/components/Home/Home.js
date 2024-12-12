import React, { useState, useEffect } from 'react';
import "./Home.css"
import axios from 'axios';
import { Link } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/posts')
            .then(response => {
                console.log("Fetched posts:", response.data);
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    return (
        <div className='homepage'>
            <h1>Welcome to CyberHome</h1>
            <p>Here are the newest updates in the community!</p>
            <ul className="posts-list">
                {posts.map(post => (
                    <li key={post._id} className="post-item">
                        <p>
                            <strong>
                                {post.user ? (
                                    <Link to={`/user/${post.user.username}`}>
                                        {post.user.name}
                                    </Link>
                                ) : "Unknown User"}:
                            </strong> {post.content}
                        </p>                        <small>{new Date(post.timestamp).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;