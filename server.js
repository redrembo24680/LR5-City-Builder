const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./firebaseConfig');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Хостинг статичних файлів (збірка React-клієнта)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Rate-limiter: обмеження POST на 1 раз на хвилину для кожного userId
// ============================================================
const lastSaveTime = {}; // { userId: timestamp }
const RATE_LIMIT_MS = 60 * 1000; // 1 хвилина

// ============================================================
// GET /api/buildings — отримати дані будівель з Firestore
// ============================================================
app.get('/api/buildings', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const docRef = db.collection('cities').doc(userId);
        const snap = await docRef.get();

        if (!snap.exists) {
            return res.json({ data: null }); // Ще немає даних — клієнт використає дефолтні
        }

        const raw = snap.data();
        res.json({
            data: {
                grid: JSON.parse(raw.grid),
                resources: JSON.parse(raw.resources),
            },
        });
    } catch (err) {
        console.error('GET /api/buildings error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================
// POST /api/buildings — зберегти дані будівель (раз на хвилину)
// ============================================================
app.post('/api/buildings', async (req, res) => {
    try {
        const { userId, grid, resources } = req.body;

        if (!userId || !grid || !resources) {
            return res.status(400).json({ error: 'userId, grid, resources are required' });
        }

        // Rate-limit: 1 раз на хвилину
        const now = Date.now();
        if (lastSaveTime[userId] && now - lastSaveTime[userId] < RATE_LIMIT_MS) {
            const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastSaveTime[userId])) / 1000);
            return res.status(429).json({
                error: `Зберігати можна раз на хвилину. Зачекайте ще ${waitSec} сек.`,
            });
        }

        // Зберігаємо у Firestore
        const docRef = db.collection('cities').doc(userId);
        await docRef.set({
            grid: JSON.stringify(grid),
            resources: JSON.stringify(resources),
            updatedAt: new Date().toISOString(),
        });

        lastSaveTime[userId] = now;

        res.json({ success: true, message: 'Дані збережено!' });
    } catch (err) {
        console.error('POST /api/buildings error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================
// GET /api/message — тестовий маршрут
// ============================================================
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Для SPA: будь-який маршрут, що не починається з /api, повертає index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
