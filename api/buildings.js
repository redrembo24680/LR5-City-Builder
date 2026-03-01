const admin = require('firebase-admin');

// ===== Ініціалізація Firebase Admin =====
// На Vercel: зчитуємо з env var FIREBASE_SERVICE_ACCOUNT
// Локально: з файлу serviceAccountKey.json
if (!admin.apps.length) {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount);
    } else {
        const serviceAccount = require('../serviceAccountKey.json');
        credential = admin.credential.cert(serviceAccount);
    }

    admin.initializeApp({ credential });
}

const db = admin.firestore();

// Rate-limiter: 1 раз на хвилину
const lastSaveTime = {};
const RATE_LIMIT_MS = 60 * 1000;

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ===== GET /api/buildings?userId=xxx =====
    if (req.method === 'GET') {
        try {
            const userId = req.query.userId;
            if (!userId) return res.status(400).json({ error: 'userId is required' });

            const snap = await db.collection('cities').doc(userId).get();

            if (!snap.exists) return res.json({ data: null });

            const raw = snap.data();
            return res.json({
                data: {
                    grid: JSON.parse(raw.grid),
                    resources: JSON.parse(raw.resources),
                },
            });
        } catch (err) {
            console.error('GET error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // ===== POST /api/buildings =====
    if (req.method === 'POST') {
        try {
            const { userId, grid, resources } = req.body;
            if (!userId || !grid || !resources) {
                return res.status(400).json({ error: 'userId, grid, resources are required' });
            }

            // Rate-limit
            const now = Date.now();
            if (lastSaveTime[userId] && now - lastSaveTime[userId] < RATE_LIMIT_MS) {
                const wait = Math.ceil((RATE_LIMIT_MS - (now - lastSaveTime[userId])) / 1000);
                return res.status(429).json({ error: `Зберігати можна раз на хвилину. Зачекайте ще ${wait} сек.` });
            }

            await db.collection('cities').doc(userId).set({
                grid: JSON.stringify(grid),
                resources: JSON.stringify(resources),
                updatedAt: new Date().toISOString(),
            });

            lastSaveTime[userId] = now;
            return res.json({ success: true, message: 'Дані збережено!' });
        } catch (err) {
            console.error('POST error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
