// AdminPanel.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [gameFile, setGameFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    const handleFileUpload = (e) => {
        setGameFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('gameFile', gameFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);

        try {
            await axios.post('/api/games/upload', formData);
            alert('Game uploaded successfully!');
        } catch (error) {
            console.error("Error uploading game:", error);
            alert('Failed to upload game');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <input type="text" placeholder="Game Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Game Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="Thumbnail URL" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
            <input type="file" onChange={handleFileUpload} />
            <button onClick={handleSubmit}>Upload Game</button>
        </div>
    );
};

export default AdminPanel;