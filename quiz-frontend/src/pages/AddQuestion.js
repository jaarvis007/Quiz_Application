import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";

export const AddQuestion = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/questions", {
        question,
        options,
      });
      alert("Question added successfully!");
      setQuestion("");
      setOptions([{ text: "", isCorrect: false }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Add Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <input
              type="text"
              className="form-control"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {options.map((option, index) => (
            <div key={index} className="mb-2 d-flex align-items-center">
              <input
                type="text"
                className="form-control me-2"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => updateOption(index, "text", e.target.value)}
                required
              />
              <input
                type="checkbox"
                className="form-check-input"
                checked={option.isCorrect}
                onChange={(e) =>
                  updateOption(index, "isCorrect", e.target.checked)
                }
              />
              <label className="ms-2">Correct</label>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={addOption}
          >
            Add Option
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
