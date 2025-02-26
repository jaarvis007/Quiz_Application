import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaClock, FaQuestionCircle, FaStar, FaPlay } from "react-icons/fa";

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/quizzes");
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartTest = (quiz) => {
    navigate(`/quiz/${quiz.id}`, { state: { quiz } });
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="text-center mb-4">📚 User Dashboard</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Col md={4} key={quiz.id} className="mb-4">
                  <Card className="shadow border-0 rounded">
                    <Card.Body>
                      <Card.Title className="text-primary">
                        {quiz.title}
                      </Card.Title>
                      <Card.Text>
                        <FaQuestionCircle className="text-info" />{" "}
                        <strong>Questions:</strong> {quiz.total_questions}
                        <br />
                        <FaStar className="text-warning" />{" "}
                        <strong>Score:</strong> {quiz.total_score}
                        <br />
                        <FaClock className="text-danger" />{" "}
                        <strong>Duration:</strong> {quiz.duration} min
                      </Card.Text>
                      <div className="d-flex justify-content-center">
                        <Button
                          variant="success"
                          onClick={() => handleStartTest(quiz)}
                        >
                          <FaPlay className="me-2" /> Start Test
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center text-muted">No quizzes available.</p>
            )}
          </Row>
        )}
      </Container>
    </>
  );
};

export default UserDashboard;
