// AdminPanel.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [gameFile, setGameFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Game uploaded successfully!');
        } catch (error) {
            console.error("Error uploading game:", error.response ? error.response.data : error.message);
            alert('Failed to upload game: ' + (error.response ? error.response.data.message : error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleGameClick = async (gameId) => {
        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:8000/api/unzip/${gameId}`);
            const { url } = response.data;
            window.location.href = url;
        } catch (error) {
            console.error("Error starting game:", error.response ? error.response.data : error.message);
            alert('Failed to start the game: ' + (error.response ? error.response.data.message : error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <input 
                type="text" 
                placeholder="Game Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Game Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Thumbnail Image URL" 
                value={thumbnail} 
                onChange={(e) => setThumbnail(e.target.value)} 
                required 
            />
            <input 
                type="file" 
                onChange={handleFileUpload} 
                accept=".zip"
                required 
            />
            <button onClick={handleSubmit} disabled={loading}>Upload Game</button>
            {loading && <p>Loading... Please wait.</p>}
            <div>
                <button onClick={() => handleGameClick(1)} disabled={loading}>Start Game 1</button>
                <button onClick={() => handleGameClick(2)} disabled={loading}>Start Game 2</button>
            </div>
        </div>
    );
};

export default AdminPanel;