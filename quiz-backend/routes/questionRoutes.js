const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../config/db");

const router = express.Router();

const questionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Too many requests, please try again later.",
  headers: true,
  keyGenerator: (req) => req.ip,
});

// Token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

router.get("/", questionLimiter, async (req, res) => {
  try {
    const getQuestions = "SELECT * FROM questions";
    const [questions] = await db.query(getQuestions);

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", questionLimiter, async (req, res) => {
  const { id } = req.params;

  try {
    const getQuestion = "SELECT * FROM questions WHERE id = ?";
    const [question] = await db.query(getQuestion, [id]);

    if (question.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    const getOptions = "SELECT * FROM question_options WHERE question_id = ?";
    const [options] = await db.query(getOptions, [id]);

    res.status(200).json({ question: question[0], options });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", verifyToken, questionLimiter, async (req, res) => {
  const { question, options } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({
      error: "Invalid data: Question and at least two options are required.",
    });
  }

  try {
    const insertQuestion = "INSERT INTO questions (question) VALUES (?)";
    const [result] = await db.query(insertQuestion, [question]);

    const questionId = result.insertId;

    const insertOption =
      "INSERT INTO question_options (question_id, option_text, is_correct) VALUES ?";

    const optionValues = options.map((opt) => [
      questionId,
      opt.text,
      opt.isCorrect,
    ]);

    await db.query(insertOption, [optionValues]);

    res
      .status(201)
      .json({ message: "Question and options added successfully!" });
  } catch (error) {
    console.error("Error inserting question:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
