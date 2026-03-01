import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';

import Header from './components/Header';
import Budget from './components/Budget';
import MyCity from './components/MyCity';
import BuildMenu from './components/BuildMenu';
import LoginPage from './components/LoginPage';

import { initialGrid, buildingTypes, defaultResources } from './data/buildings';

// Захищений маршрут
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Завантаження…</p>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function CityApp() {
    const { user } = useAuth();

    const [resources, setResources] = useState(defaultResources);
    const [grid, setGrid] = useState(initialGrid);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // ===== GET /api/buildings — завантажити дані з сервера =====
    useEffect(() => {
        if (!user) {
            setGrid(initialGrid);
            setResources(defaultResources);
            setDataLoaded(false);
            return;
        }

        fetch(`/api/buildings?userId=${user.uid}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.data) {
                    setGrid(result.data.grid);
                    setResources(result.data.resources);
                }
                setDataLoaded(true);
            })
            .catch((err) => {
                console.error('Error loading data:', err);
                setDataLoaded(true);
            });
    }, [user]);

    // ===== POST /api/buildings — зберегти дані на сервері =====
    const saveToServer = useCallback(
        async (newGrid, newResources) => {
            if (!user) return;

            try {
                const res = await fetch('/api/buildings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.uid,
                        grid: newGrid,
                        resources: newResources,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setSaveMessage('✅ ' + result.message);
                } else {
                    setSaveMessage('⚠️ ' + result.error);
                }
                setTimeout(() => setSaveMessage(''), 4000);
            } catch (err) {
                console.error('Save error:', err);
                setSaveMessage('❌ Помилка збереження');
                setTimeout(() => setSaveMessage(''), 4000);
            }
        },
        [user]
    );

    // Задоволеність
    const satisfaction = grid.reduce((acc, cell) => {
        if (cell.isBuilding) {
            return acc + buildingTypes[cell.type].satisfaction * cell.level;
        }
        return acc;
    }, 50);

    // Апгрейд будівлі → POST /api/buildings
    const upgradeBuilding = (cellId) => {
        const cellIndex = grid.findIndex((c) => c.id === cellId);
        if (cellIndex === -1) return;

        const cell = grid[cellIndex];
        const bld = buildingTypes[cell.type];
        const cost = {
            money: bld.baseCost.money * cell.level,
            wood: bld.baseCost.wood * cell.level,
            stone: bld.baseCost.stone * cell.level,
        };

        if (resources.money < cost.money || resources.wood < cost.wood || resources.stone < cost.stone) return;

        const newResources = {
            money: resources.money - cost.money,
            wood: resources.wood - cost.wood,
            stone: resources.stone - cost.stone,
        };
        const newGrid = [...grid];
        newGrid[cellIndex] = { ...cell, level: cell.level + 1 };

        setResources(newResources);
        setGrid(newGrid);

        // Зберегти через API сервера
        saveToServer(newGrid, newResources);
    };

    // Вирахувати ресурси
    const deductResources = (cost) => {
        setResources((prev) => ({
            money: prev.money - cost.money,
            wood: prev.wood - cost.wood,
            stone: prev.stone - cost.stone,
        }));
    };

    // setGrid + зберегти через API
    const setGridAndSave = (newGrid) => {
        setGrid(newGrid);
        setTimeout(() => {
            setResources((currentResources) => {
                saveToServer(newGrid, currentResources);
                return currentResources;
            });
        }, 100);
    };

    return (
        <>
            <Header />
            <main>
                <Budget resources={resources} satisfaction={satisfaction} />

                {saveMessage && (
                    <div style={{
                        textAlign: 'center',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: saveMessage.startsWith('✅') ? 'rgba(16,185,129,0.15)' :
                            saveMessage.startsWith('⚠️') ? 'rgba(245,158,11,0.15)' :
                                'rgba(239,68,68,0.15)',
                        fontWeight: 600,
                    }}>
                        {saveMessage}
                    </div>
                )}

                <Routes>
                    <Route path="/" element={<MyCity grid={grid} onUpgrade={upgradeBuilding} resources={resources} />} />
                    <Route
                        path="/build"
                        element={
                            <ProtectedRoute>
                                <BuildMenu
                                    resources={resources}
                                    deductResources={deductResources}
                                    grid={grid}
                                    setGrid={setGridAndSave}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>
            <footer>
                <p>&copy; 2026 City Builder Simulator. Лабораторна №5 (Node.js + Express + Firestore).</p>
            </footer>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CityApp />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
