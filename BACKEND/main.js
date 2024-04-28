// ЗАПУСК -- npm ./main.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const uuid = require('uuid');

const app = express();
app.use(express.json());



// ИНИЦИАЛИЗАЦИЯ
const db = new sqlite3.Database('todo.db');
const sampleUser = 'sample_user', samplePassword = 'sample_password';

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        completed BOOLEAN,
        user_id INTEGER
    )`);

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [sampleUser],
        (err, user) => {
            if (!user) {
                db.run(
                    `INSERT INTO users (username, password) VALUES (?, ?)`,
                    [sampleUser, samplePassword]
                ); 
            }
        }
    );
});



// ВХОД В СИСТЕМУ (TODO: заменить на jwt)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    db.get(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, hashedPassword],
        (err, user) => {
            if (user) {
                const sessionId = uuid.v4();
                db.run(
                    `INSERT INTO sessions (user_id, session_id) VALUES (?, ?)`,
                    [user.id, sessionId],
                    (err) => {
                        if (err) { return res.status(500).json( { message: err.message }); }
                        return res.json({ sessionId: sessionId });
                    }
                );
            }
            else {
                return res.json({ sessionId: null });
            }
        }
    );
});



// РАБОТА С ЗАДАЧАМИ
app.get('/tasks', (req, res) => {
    const sessionId = req.get('Authorization')?.split(' ')[1];

    if (sessionId) {
        db.get(
            `SELECT user_id FROM sessions WHERE session_id = ?`,
            [sessionId],
            (err, session) => {
                if (session) {
                    db.all(
                        `SELECT * FROM tasks WHERE user_id = ?`,
                        [session.user_id],
                        (err, tasks) => {
                            res.json(tasks.map(task => ({
                                id: task.id,
                                title: task.title,
                                completed: task.completed,
                                userId: task.user_id
                            })));
                        }
                    );
                }
                else {
                    res.status(401).json({ message: 'Ошибка аутентификации!' });
                }
            }
        );
    } else {
        db.all(
            `SELECT * FROM tasks`,
            (err, tasks) => {
                res.json(tasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    completed: task.completed,
                    userId: task.user_id
                })));
            }
        );
    }
});

app.post('/tasks', (req, res) => {
    const sessionId = req.get('Authorization')?.split(' ')[1];
    if (sessionId) {
        db.get(
            `SELECT user_id FROM sessions WHERE session_id = ?`,
            [sessionId],
            (err, session) => {
                if (session) {
                    const { tasks } = req.body;
                    db.run(
                        `DELETE FROM tasks WHERE user_id = ?`,
                        [session.user_id]
                    );
                    tasks.forEach(task => {
                        db.run(
                            `INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)`,
                            [task.title, task.completed, session.user_id]
                        );
                    });
                    res.json(tasks);
                } else {
                    res.status(401).json({ message: 'Ошибка аутентификации!' });
                }
            }
        );
    } else {
        res.status(401).json({ message: 'Ошибка аутентификации!' });
    }
});



app.listen(3000);
