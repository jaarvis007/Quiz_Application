import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        username,
        password,
        role,
      });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-lg p-4"
        style={{ width: "350px", borderRadius: "10px" }}
      >
        <Card.Body>
          <h2 className="text-center text-primary mb-4">Quiz App Signup</h2>
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" className="w-100" type="submit">
              Signup
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none text-primary">
                Login
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Signup;
