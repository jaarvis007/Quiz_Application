import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";

export const CreateQuiz = ({ setShowForm, onQuizCreated }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [score, setScore] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsList, setQuestionList] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/questions");
        const questionList = response.data.map((question) => ({
          id: question.id,
          text: question.question,
        }));
        setQuestionList(questionList);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const quizData = {
        title,
        total_questions: parseInt(numQuestions),
        total_score: parseInt(score),
        duration: parseInt(duration),
        question_ids: questions.map((q) => q.selectedQuestion).join(","),
      };

      const response = await axios.post(
        "http://localhost:3000/api/quizzes",
        quizData
      );

      // Reset form and close
      setShowForm(false);
      setStep(1);
      setTitle("");
      setNumQuestions("");
      setScore("");
      setDuration("");
      setQuestions([]);

      onQuizCreated(quizData);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleNext = () => {
    const num = parseInt(numQuestions, 10);
    if (title && num > 0 && score && duration) {
      setQuestions(
        new Array(num).fill({ marks: "", id: "", selectedQuestion: "" })
      );
      setStep(2);
    }
  };

  const handleMarksChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], marks: value };
    setQuestions(updatedQuestions);
  };

  const handleQuestionSelect = (index, value) => {
    const selectedQ = questionsList.find((q) => q.id === value);
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      selectedQuestion: value,
      id: selectedQ ? selectedQ.id : "",
    };
    setQuestions(updatedQuestions);
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        {step === 1 ? (
          <>
            <h4>Create Quiz Step 1</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter quiz title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="No. of questions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Enter Score"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Enter Duration (in min)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" onClick={handleNext}>
                Next
              </Button>
            </Form>
          </>
        ) : (
          <>
            <h4>Create Quiz Step 2</h4>
            {questions.map((q, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col xs={2}>Q{index + 1}</Col>
                <Col xs={4}>
                  <Form.Select
                    value={q.selectedQuestion}
                    onChange={(e) =>
                      handleQuestionSelect(index, e.target.value)
                    }
                  >
                    <option value="">Select a question</option>
                    {questionsList.map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.text}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={2}>
                  <Form.Control
                    type="number"
                    placeholder="Marks"
                    value={q.marks}
                    onChange={(e) => handleMarksChange(index, e.target.value)}
                  />
                </Col>
                <Col xs={2}>{q.id}</Col>
              </Row>
            ))}
            <Button
              variant="success"
              className="mt-3"
              onClick={handleCreateQuiz}
            >
              Create
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
};
