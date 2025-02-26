require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../config/db");

const router = express.Router();

const quizLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Too many requests, please try again later.",
  headers: true,
  keyGenerator: (req) => req.ip,
});

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

router.get("/", quizLimiter, async (req, res) => {
  try {
    const [quizzes] = await db.query("SELECT * FROM quizzes");
    res.json({ success: true, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", verifyToken, quizLimiter, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { title, total_questions, total_score, duration, question_ids } =
      req.body;

    if (
      !title ||
      !total_questions ||
      !total_score ||
      !duration ||
      !question_ids
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await db.query(
      "INSERT INTO quizzes (title, total_questions, total_score, duration, question_ids) VALUES (?, ?, ?, ?, ?)",
      [title, total_questions, total_score, duration, question_ids]
    );

    res
      .status(201)
      .json({ success: true, message: "Quiz created successfully." });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const [result] = await db.query("DELETE FROM quizzes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found." });
    }

    res.json({ success: true, message: "Quiz deleted successfully." });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
