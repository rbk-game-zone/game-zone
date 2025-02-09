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
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            alert('Failed to fetch categories.');
        }
    };

    // Handle Game ZIP Upload
    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setGameFile(e.target.files[0]);
        }
    };

    // Handle Image Upload to Cloudinary
    const handleImageUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default"); // Cloudinary Upload Preset

        setLoading(true);

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/doxjp0kvo/image/upload",
                formData
            );

            setThumbnail(response.data.secure_url); // Store uploaded image URL
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Form Submission
        if (e.target.files && e.target.files[0]) {
            setGameFile(e.target.files[0]);
        }
    };

    // Handle Image Upload to Cloudinary
    const handleImageUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default"); // Cloudinary Upload Preset

        setLoading(true);

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/doxjp0kvo/image/upload",
                formData
            );

            setThumbnail(response.data.secure_url); // Store uploaded image URL
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Form Submission
    const handleSubmit = async () => {
        if (!gameFile || !title || !description || !thumbnail || !category) {
            alert("Please fill all fields and upload an image.");
            return;
        }

        if (!gameFile || !title || !description || !thumbnail || !category) {
            alert("Please fill all fields and upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append('gameFile', gameFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);
        formData.append('category', category);

        setLoading(true);

        try {
            await axios.post(`${API_URL}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Game uploaded successfully!");

            alert("Game uploaded successfully!");
        } catch (error) {
            console.error("Error uploading game:", error);
            alert("Failed to upload game.");
            console.error("Error uploading game:", error);
            alert("Failed to upload game.");
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
                <input
                    type="text"
                    className="form-control"
                    placeholder="Game Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

            {/* Upload Thumbnail */}

            {/* Upload Thumbnail */}
            <div className="form-group mb-3">
                <label> <h5>Upload Image</h5></label>
                <input type="file" className="form-control" onChange={handleImageUpload} accept="image/*"/>
                {thumbnail && <img src={thumbnail} alt="Thumbnail" width={100} className="mt-2" />}
                <label> <h5>Upload Image</h5></label>
                <input type="file" className="form-control" onChange={handleImageUpload} accept="image/*"/>
                {thumbnail && <img src={thumbnail} alt="Thumbnail" width={100} className="mt-2" />}
            </div>

            {/* Upload Game File */}

            {/* Upload Game File */}
            <div className="form-group mb-3">
            
                <input type="file" className="form-control-file" onChange={handleFileUpload} accept=".zip" required />
            
                <input type="file" className="form-control-file" onChange={handleFileUpload} accept=".zip" required />
            </div>

            {/* Category Selection */}

            {/* Category Selection */}
            <div className="form-group mb-3">
                <select className="form-control" onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select a Category</option>
                <select className="form-control" onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit} disabled={loading}>
                {loading ? "Uploading..." : "Upload Game"}

            <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit} disabled={loading}>
                {loading ? "Uploading..." : "Upload Game"}
            </button>


            {loading && <p className="text-center">Loading... Please wait.</p>}
        </div>
    );
};

export default AdminPanel;