import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

const Navbar = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData?.username || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          Quiz App
        </Link>
        <div className="d-flex align-items-center">
          <span className="text-light me-2">Hi, {username}</span>
          <Avatar
            src="https://static.vecteezy.com/system/resources/previews/021/682/346/non_2x/avatar-with-a-young-face-pictures-of-men-and-women-of-various-nationalities-vector.jpg"
            alt="User Avatar"
            className="me-3"
            sx={{ width: 40, height: 40 }}
          />
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
