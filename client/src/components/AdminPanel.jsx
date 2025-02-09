import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AdminPanel = () => {
    const [gameFile, setGameFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const handleFileUpload = (e) => {
        setGameFile(e.target.files[0]);
    };
useEffect(() => {
    fetchCategories();
}, []);
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('gameFile', gameFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);
        formData.append('category', category);

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
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error adding category:", error.response ? error.response.data : error.message);
            alert('Failed to add category: ' + (error.response ? error.response.data.message : error.message));
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
        <div className="container admin-panel mt-5">
            <h1 className="text-center mb-4">Admin Panel</h1>
            <div className="form-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Game Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Game Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Thumbnail Image URL" 
                    value={thumbnail} 
                    onChange={(e) => setThumbnail(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group mb-3">
                <input 
                    type="file" 
                    className="form-control-file" 
                    onChange={handleFileUpload} 
                    accept=".zip"
                    required 
                />
            </div>
            <div className="form-group mb-3">
                <select className="form-control"  onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>
            </div>
            <button 
                className="btn btn-primary w-100 mb-3" 
                onClick={handleSubmit} 
                disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Game'}
            </button>
            {loading && <p className="text-center">Loading... Please wait.</p>}
            
    
        </div>
    );
};

export default AdminPanel;
