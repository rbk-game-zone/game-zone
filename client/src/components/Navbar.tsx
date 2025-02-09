import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Category } from "../types/tables/category";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function Navbar({ fetchGameByCategory }: { fetchGameByCategory: any }) {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Use env variable or default to localhost
        const response = await axios.get(`${apiUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("avatar")
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home" style={{ color: "white", textDecoration: "none" }}>
            GameZone
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category: Category) => (
                    <li key={category.id}>
                      <Link
                        className="dropdown-item"
                        to={"/category"}
                        onClick={() => fetchGameByCategory(category.id)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            {/* User Avatar Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="rounded-circle text-white d-flex justify-content-center align-items-center"
                  style={{
                    width: "25px",
                    height: "25px",
                    fontSize: "10px",
                    backgroundColor: "rgba(255, 0, 0, 0.5)"
                  }}
                >
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                {user?.role === "admin" && (
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
