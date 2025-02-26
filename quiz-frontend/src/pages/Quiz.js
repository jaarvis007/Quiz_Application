import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa";
import Navbar from "./Navbar";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.quiz;

  const [quiz, setQuiz] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const timeLeftRef = useRef(900); // 15 minutes in seconds
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState("15:00");

  useEffect(() => {
    if (!quizData) return;
    const quizDataArray = quizData.question_ids.split(",").map(Number);

    const fetchQuiz = async () => {
      try {
        const responses = await Promise.all(
          quizDataArray.map(async (id) => {
            const response = await axios.get(
              `http://localhost:3000/api/questions/${id}`
            );
            return {
              question: response.data.question[0],
              options: response.data.options,
            };
          })
        );
        setQuiz(responses);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuiz();
  }, [quizData]);

  useEffect(() => {
    if (!quizData) return;
    timerRef.current = setInterval(() => {
      if (timeLeftRef.current > 0) {
        timeLeftRef.current -= 1;
        const minutes = Math.floor(timeLeftRef.current / 60);
        const seconds = timeLeftRef.current % 60;
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      } else {
        clearInterval(timerRef.current);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quizData]);

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    let newScore = 0;
    quiz.forEach((q) => {
      if (selectedAnswers[q.question.id] === 1) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    setShowResultModal(true);
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4 p-4 rounded shadow bg-light">
        <Modal show={showModal} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Are You Ready?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Please read the instructions carefully before starting the quiz.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setShowModal(false)}>
              Start Quiz
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{quizData?.title}</h2>
          <div className="d-flex align-items-center bg-warning text-dark px-3 py-2 rounded">
            <FaClock size={20} className="me-2" />
            <span className="fw-bold">{timeLeft}</span>
          </div>
        </div>

        <div className="text-end fw-bold d-flex align-items-center">
          <FaTrophy size={20} className="text-warning me-2" /> Score: {score}
        </div>
        <ul className="list-group mt-3">
          {quiz.map((q, index) => (
            <li
              key={q.question.id}
              className={`list-group-item ${
                submitted && selectedAnswers[q.question.id] === 1
                  ? "bg-success text-white"
                  : ""
              }`}
            >
              <strong>
                Q{index + 1}: {q.question.question}
              </strong>
              <ul className="mt-2">
                {q.options.map((opt) => (
                  <li key={opt.id} className="list-unstyled">
                    <input
                      type="radio"
                      name={`question-${q.question.id}`}
                      value={opt.id}
                      id={`option-${opt.id}`}
                      disabled={submitted}
                      onChange={() =>
                        handleOptionChange(q.question.id, opt.is_correct)
                      }
                    />
                    <label htmlFor={`option-${opt.id}`} className="ms-2">
                      {opt.option_text}{" "}
                      {submitted && opt.is_correct ? (
                        <FaCheckCircle className="text-success ms-1" />
                      ) : null}
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {!submitted ? (
          <Button className="mt-3" variant="success" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        ) : (
          <Button
            className="mt-3"
            variant="primary"
            onClick={() => navigate("/user/dashboard")}
          >
            Back to Dashboard
          </Button>
        )}

        <Modal show={showResultModal} onHide={() => setShowResultModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Quiz Result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              <FaTrophy className="text-warning me-2" /> Your Score: {score} /{" "}
              {quiz.length}
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowResultModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Quiz;
