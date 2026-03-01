import { useState } from 'react';
import { buildingTypes } from '../data/buildings';
import BuildingCard from './BuildingCard';

function BuildMenu({ resources, deductResources, grid, setGrid }) {
    const [filter, setFilter] = useState('всі');
    const [message, setMessage] = useState('');

    const buildingsArray = Object.values(buildingTypes);
    const filteredBuildings = filter === 'всі' ? buildingsArray : buildingsArray.filter((b) => b.category === filter);

    const checkAffordability = (cost) =>
        resources.money >= cost.money && resources.wood >= cost.wood && resources.stone >= cost.stone;

    const handleBuild = (bldId) => {
        const cost = buildingTypes[bldId].baseCost;
        if (!checkAffordability(cost)) { setMessage('🔴 Недостатньо ресурсів!'); return; }
        const grassIndex = grid.findIndex((c) => c.type === 'grass');
        if (grassIndex === -1) { setMessage('🔴 Немає вільного місця!'); return; }

        deductResources(cost);
        const newGrid = [...grid];
        newGrid[grassIndex] = { id: newGrid[grassIndex].id, type: bldId, level: 1, isBuilding: true };
        setGrid(newGrid);
        setMessage(`🟢 ${buildingTypes[bldId].name} побудовано!`);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <section>
            <h2>Каталог Будівництва</h2>
            <div className="filters">
                {['всі', 'житлові', 'комерційні', 'промислові'].map((f) => (
                    <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f === 'всі' ? 'Всі будівлі' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
            {message && <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>{message}</div>}
            <div className="build-options">
                {filteredBuildings.map((b) => (
                    <BuildingCard key={b.id} building={b} onBuild={handleBuild} canAfford={checkAffordability(b.baseCost)} />
                ))}
            </div>
        </section>
    );
}

export default BuildMenu;
