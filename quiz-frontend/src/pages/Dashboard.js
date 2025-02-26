import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Container, Card, Button, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:3000/api/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuizzes(res.data.quizzes);
      })
      .catch(() => alert("Failed to load quizzes"));
  }, [token, navigate]);

  return (
    <>
      <>
        <Navbar />
        <Container>
          <h2 className="text-center mb-4">Available Quizzes</h2>
          <Row>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Col key={quiz.id} md={4} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`https://source.unsplash.com/400x250/?${quiz.title},exam`}
                    />
                    <Card.Body>
                      <Card.Title>{quiz.title}</Card.Title>
                      <Card.Text>
                        <strong>Questions:</strong> {quiz.total_questions}{" "}
                        <br />
                        <strong>Duration:</strong> {quiz.duration} min
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                      >
                        Start Quiz
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <h5 className="text-center">No quizzes available</h5>
            )}
          </Row>
        </Container>
      </>
    </>
  );
};

export default Dashboard;
