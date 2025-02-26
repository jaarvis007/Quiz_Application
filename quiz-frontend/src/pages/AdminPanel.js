import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import { CreateQuiz } from "./CreateQuiz";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaClipboardList } from "react-icons/fa";
import Navbar from "./Navbar";

const AdminPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData.role !== "admin") {
        window.location.href = "/user/dashboard";
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setQuizzes(response.data.quizzes);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="text-center mb-4">🛠️ Admin Panel</h2>
        <div className="d-flex justify-content-center mb-4 gap-2">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              "✖ Close Quiz Form"
            ) : (
              <>
                <FaPlus /> Create New Quiz
              </>
            )}
          </Button>

          <Link className="btn btn-outline-dark" to="/addquestions">
            <FaClipboardList /> Add Question
          </Link>
        </div>
        {showForm && (
          <CreateQuiz
            setShowForm={setShowForm}
            onQuizCreated={(newQuiz) => setQuizzes([...quizzes, newQuiz])}
          />
        )}

        {!showForm &&
          (loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <Col md={6} lg={4} key={quiz.id} className="mb-4">
                    <Card className="shadow-lg border-0 rounded-3 quiz-card position-relative">
                      <Card.Body className="text-center p-4">
                        <Badge
                          pill
                          bg={
                            quiz.status === "Complete" ? "success" : "warning"
                          }
                          className="position-absolute top-0 start-50 translate-middle mt-3"
                        >
                          {quiz.status}
                        </Badge>
                        <Card.Title className="fw-bold text-primary quiz-title mt-4">
                          {quiz.title}
                        </Card.Title>
                        <Card.Text className="text-muted">
                          <strong>Total Questions:</strong>{" "}
                          {quiz.total_questions}
                        </Card.Text>
                        <Card.Text className="text-muted">
                          <strong>Total Marks:</strong> {quiz.total_score}
                        </Card.Text>
                        <Card.Text className="text-muted">
                          <strong>Duration:</strong> {quiz.duration} minutes
                        </Card.Text>
                        <FaTrash
                          className="text-danger position-absolute top-0 end-0 m-3 cursor-pointer"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          style={{ fontSize: "1.5rem" }}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center text-muted">No quizzes available.</p>
              )}
            </Row>
          ))}
      </Container>
    </>
  );
};

export default AdminPanel;
