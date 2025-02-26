## 🚀 Project Overview
The **Online Quiz System** is a web-based application that allows users to attempt quizzes while providing an admin panel for quiz management.

## 🛠 Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js (Express.js)(Didn't comfortable with required backend)
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Rate Limiting:** 100 requests/sec per user
- **Version Control:** GitHub

## 📋 Features
### 🔐 Authentication & User Dashboard
- JWT-based authentication (Login & Logout)
- Separate dashboards for **Users** & **Admins**

### 🎯 Quiz Management (Admin Panel)
- Create and manage quizzes (Title, Questions, Duration, Score)
- Map questions to quizzes
- View quiz participants & their responses

### 📝 Quiz Attempt (User Flow)
- View available quizzes
- Start and submit quizzes
- View scores and correct answers after completion

### 🗂 Database Schema

<img width="191" alt="Screenshot 2025-02-26 at 10 51 23 PM" src="https://github.com/user-attachments/assets/6eb897d0-872c-434a-abfc-3de6f357dcf5" />
<img width="475" alt="Screenshot 2025-02-26 at 10 42 18 PM" src="https://github.com/user-attachments/assets/c624f4d7-c4e9-457c-be05-5b13afe2208b" />

## ⚙️ Setup Instructions
### Prerequisites
- Node.js & npm installed
- MySQL database setup
- Git for version control

### Installation Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/online-quiz-system.git
   cd online-quiz-system
   ```

2. **Backend Setup**
   ```sh
   cd quiz-backend
   npm install
   touch .env  # Configure as per your db and jwt configuration
   npm start
   ```

3. **Frontend Setup**
   ```sh
   cd ../quiz-frontend
   npm install
   npm start
   ```

4. **Database Migration**
   ```sql
   CREATE DATABASE quiz_system;
   USE quiz_system
   ```

   #### `quizzes` Table
    ```sql
    CREATE TABLE quizzes (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        total_questions INT NOT NULL,
        total_score INT NOT NULL,
        duration INT NOT NULL,
        question_ids TEXT NOT NULL
    );
    ```
    
    #### `questions` Table
    ```sql
    CREATE TABLE questions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        question TEXT NOT NULL,
        PRIMARY KEY (id)
    );
    ```
    
    #### `question_options` Table
    ```sql
    CREATE TABLE question_options (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        question_id INT UNSIGNED NOT NULL,
        option TEXT NOT NULL,
        is_correct TINYINT UNSIGNED DEFAULT '0',
        PRIMARY KEY (id)
    );
    ```

## 📌 Snapshots
<img width="1440" alt="Screenshot 2025-02-26 at 10 23 26 PM" src="https://github.com/user-attachments/assets/d5ce8d93-ec0e-42f8-a932-a3ff0f7a36dd" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 23 35 PM" src="https://github.com/user-attachments/assets/470cb542-9219-44e7-ad8c-eab6fd9e2496" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 24 03 PM" src="https://github.com/user-attachments/assets/98e75e97-c4d8-46d0-b182-aaa2d136e520" />
<img width="1440" alt="Screenshot 2025-02-26 at 11 04 48 PM" src="https://github.com/user-attachments/assets/2d995e28-4693-4870-8f8f-a6242a22cfb9" />
<img width="1440" alt="Screenshot 2025-02-26 at 11 04 55 PM" src="https://github.com/user-attachments/assets/44c4f53f-1b3d-4e87-83be-05e8eff38aee" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 25 03 PM" src="https://github.com/user-attachments/assets/822bd01e-3411-4977-9eb1-683dbba70e9d" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 25 42 PM" src="https://github.com/user-attachments/assets/8e331ec0-8b88-4c0e-8d0b-4dcac595fb4b" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 36 16 PM" src="https://github.com/user-attachments/assets/a8b94e7c-cc09-4e58-b4b7-2e68b3869021" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 36 48 PM" src="https://github.com/user-attachments/assets/d5e13441-8d6d-4d3b-aadb-f705ce2a37f1" />
<img width="1440" alt="Screenshot 2025-02-26 at 10 36 54 PM" src="https://github.com/user-attachments/assets/68e4580e-34da-4abe-8bf5-62595687da60" />

---

Made with ❤️ by Aman Jain (NIT Allahabad)
