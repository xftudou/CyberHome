import React, { useState, useEffect } from 'react';
import "./Home.css"
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function Home() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState([]);


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

    const startEditingPost = (postId, currentContent) => {
        setEditingPostId(postId);
        setEditedContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditedContent('');
    };

    const handleSaveEdit = async (postId) => {
        if (!editedContent.trim()) return;
        try {
            const response = await axios.put(`/posts/${postId}`, { content: editedContent });
            setPosts(prevPosts => prevPosts.map(p => p._id === postId ? response.data : p));
            setEditingPostId(null);
            setEditedContent('');
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await axios.delete(`/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className='homepage'>
            <h1>Welcome to CyberHome</h1>
            <p>Here are the newest updates in the community!</p>
            <ul className="posts-list">
                {posts.map(post => {
                    const isOwner = user && user.username === post.user.username;
                    return (
                        <li key={post._id} className="post-item">
                            {editingPostId === post._id ? (
                                <>
                                    <textarea
                                        value={editedContent}
                                        onChange={e => setEditedContent(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveEdit(post._id)}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p>
                                        <strong>
                                            {post.user ? (
                                                <Link to={`/user/${post.user.username}`}>
                                                    {post.user.name}
                                                </Link>
                                            ) : "Unknown User"}:
                                        </strong> {post.content}
                                    </p>                                            <small>{new Date(post.timestamp).toLocaleString()}</small>
                                    {isOwner && (
                                        <div className='post-actions'>
                                            <button onClick={() => startEditingPost(post._id, post.content)}>Edit</button>
                                            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Home;