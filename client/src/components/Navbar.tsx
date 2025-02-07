import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Category } from "../types/tables/category";
import axios from "axios";

function Navbar({fetchGameByCategory}:{fetchGameByCategory:any}) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };


  useEffect(() => {
    // Fetch the categories from your backend API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categories"); // Replace with your actual API endpoint
        setCategories(response.data); // Store categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  fetchCategories();
  }, []);

  
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">GameZone</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {/* Dynamically render category items */}
                  {categories.map((category: Category) => (
                    <li key={category.id}>
                      <Link className="dropdown-item" to={"/category"} onClick={() => fetchGameByCategory(category.id)}>{category.name}</Link>
                    </li>
                  ))}
                </ul>

              </li>
                <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
                </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button className="btn btn-primary" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
