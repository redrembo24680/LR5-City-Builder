// Конфігурація Firebase Admin SDK для серверної частини
const admin = require('firebase-admin');

// Завантаження сервісного ключа
// Згенеруйте його: Firebase Console → Налаштування проекту → Облікові записи служб → Згенерувати новий приватний ключ
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Firestore — хмарна база даних
const db = admin.firestore();

module.exports = { admin, db };
