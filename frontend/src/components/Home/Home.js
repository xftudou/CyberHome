import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Home.css";
import { useAuth } from '../../contexts/AuthContext';

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true;

function Home() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/posts');
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            alert('Failed to fetch posts.');
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) {
            alert('Post content cannot be empty.');
            return;
        }
        try {
            if (!user) {
                alert('You must be logged in to create a post.');
                return;
            }

            const response = await axios.post(`/posts/${user.username}/posts`, { content: newPostContent });
            const newPost = {
                ...response.data,
                user: {
                    username: user.username,
                    name: user.name
                }
            };

            setPosts(prev => [newPost, ...prev]);
            setNewPostContent('');
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Failed to create post: ${error.response.data.message}`);
            } else {
                alert('Failed to create post.');
            }
        }
    };

    const startEditingPost = (postId, currentContent) => {
        setEditingPostId(postId);
        setEditedContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditedContent('');
    };

    const handleSaveEdit = async (postId) => {
        if (!editedContent.trim()) {
            alert('Post content cannot be empty.');
            return;
        }
        try {
            const post = posts.find(p => p._id === postId);
            if (!post) {
                alert('Post not found.');
                return;
            }

            if (!user || user.username !== post.user.username) {
                alert('You are not authorized to edit this post.');
                return;
            }

            const response = await axios.put(`/posts/${user.username}/posts/${postId}`, { content: editedContent });

            const updatedPost = {
                ...response.data,
                user: {
                    username: user.username,
                    name: user.name
                }
            };

            setPosts(prevPosts => prevPosts.map(p => p._id === postId ? updatedPost : p));
            setEditingPostId(null);
            setEditedContent('');
        } catch (error) {
            console.error('Error editing post:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Failed to edit post: ${error.response.data.message}`);
            } else {
                alert('Failed to edit post.');
            }
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            const post = posts.find(p => p._id === postId);
            if (!post) {
                alert('Post not found.');
                return;
            }

            if (!user || user.username !== post.user.username) {
                alert('You are not authorized to delete this post.');
                return;
            }

            await axios.delete(`/posts/${user.username}/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Failed to delete post: ${error.response.data.message}`);
            } else {
                alert('Failed to delete post.');
            }
        }
    };

    return (
        <div className='homepage'>
            <h1>Welcome to CyberHome</h1>
            <p>Here are the newest updates in the community!</p>

            {user && (
                <div className='create-post-section'>
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className='create-post-textarea'
                    />
                    <button
                        className={`post-button ${newPostContent.trim() ? 'active' : ''}`}
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                    >
                        Post
                    </button>
                </div>
            )}

            <ul className='posts-list'>
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map(post => {
                        const isOwner = user && user.username === post.user.username;
                        return (
                            <li key={post._id} className='post-item'>
                                {editingPostId === post._id ? (
                                    <div className='post-edit-area'>
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className='post-edit-textarea'
                                        />
                                        <div className='post-edit-buttons'>
                                            <button onClick={() => handleSaveEdit(post._id)} className='save-button'>Save</button>
                                            <button onClick={handleCancelEdit} className='cancel-button'>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='post-content'>
                                        <p>
                                            <strong>
                                                {post.user ? (
                                                    <Link to={`/user/${post.user.username}`} className='user-link'>
                                                        {post.user.name}
                                                    </Link>
                                                ) : "Unknown User"}
                                            </strong>: {post.content}
                                        </p>
                                        <small>{new Date(post.timestamp).toLocaleString()}</small>
                                        {isOwner && (
                                            <div className='post-actions'>
                                                <button onClick={() => startEditingPost(post._id, post.content)} className='edit-button'>Edit</button>
                                                <button onClick={() => handleDeletePost(post._id)} className='delete-button'>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <li>No posts available.</li>
                )}
            </ul>
        </div>
    );
}

export default Home;