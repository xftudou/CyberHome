import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./UserPage.css"
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function UserPage() {
    const [userData, setUserData] = useState({ posts: [] });
    const [newPostContent, setNewPostContent] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const { username } = useParams();
    const { user } = useAuth();

    const isOwner = user && user.username === username;

    useEffect(() => {
        axios.get(`/users/${username}`)
            .then(response => {
                setUserData(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [username]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        try {
            const response = await axios.post(`/posts/${username}/posts`, { content: newPostContent });
            setUserData(prev => {
                const posts = Array.isArray(prev.posts) ? prev.posts : [];
                return {
                    ...prev,
                    posts: [response.data, ...posts]
                };
            });
            setNewPostContent('');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const startEditingPost = (postId, currentContent) => {
        setEditingPostId(postId);
        setEditedContent(currentContent);
    };

    const handleSaveEdit = async () => {
        if (!editedContent.trim()) return;
        try {
            const response = await axios.put(`/posts/${username}/posts/${editingPostId}`, { content: editedContent });
            setUserData(prev => ({
                ...prev,
                posts: prev.posts.map(p => p._id === editingPostId ? response.data : p)
            }));
            setEditingPostId(null);
            setEditedContent('');
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditedContent('');
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`/posts/${username}/posts/${postId}`);
            setUserData(prev => ({
                ...prev,
                posts: prev.posts.filter(p => p._id !== postId)
            }));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const { posts = [] } = userData;

    return (
        <div className='userpage'>
            <h1 className='userpage__username'>{userData.name}</h1>

            {isOwner && (
                <div className='create-post-section'>
                    <h3>Create a new post</h3>
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                    <button onClick={handleCreatePost}>Post</button>
                </div>
            )}

            <h2>Posts</h2>
            <ul className='posts-list'>
                {posts.map(post => (
                    <li className='post-item' key={post._id}>
                        {editingPostId === post._id ? (
                            <>
                                <textarea
                                    value={editedContent}
                                    onChange={e => setEditedContent(e.target.value)}
                                />
                                <button onClick={handleSaveEdit}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p>{post.content}</p>
                                <small>{new Date(post.timestamp).toLocaleString()}</small>
                                {isOwner && (
                                    <div className='post-actions'>
                                        <button onClick={() => startEditingPost(post._id, post.content)}>Edit</button>
                                        <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserPage;