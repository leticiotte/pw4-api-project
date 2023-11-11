create database pw4;
use pw4;

CREATE TABLE class (
    id INT AUTO_INCREMENT NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    studentNumber VARCHAR(50) NOT NULL,
    birthDate DATE NOT NULL,
    gender ENUM('feminine', 'masculine', 'non_binary', 'others') NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    classId INT,
    FOREIGN KEY (classId) REFERENCES class(id)
);

CREATE TABLE student_class (
    studentId INT,
    classId INT,
    PRIMARY KEY (studentId, classId),
    FOREIGN KEY (studentId) REFERENCES student(id),
    FOREIGN KEY (classId) REFERENCES class(id)
);

CREATE TABLE student_subject (
    studentId INT,
    subjectId INT,
    PRIMARY KEY (studentId, subjectId),
    FOREIGN KEY (studentId) REFERENCES student(id),
    FOREIGN KEY (subjectId) REFERENCES subject(id)
);
