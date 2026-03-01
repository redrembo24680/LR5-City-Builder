import { buildingTypes } from '../data/buildings';

function MyCity({ grid, onUpgrade, resources }) {
    const canAffordUpgrade = (cell) => {
        if (!cell.isBuilding) return false;
        const bld = buildingTypes[cell.type];
        const m = cell.level;
        return resources.money >= bld.baseCost.money * m && resources.wood >= bld.baseCost.wood * m && resources.stone >= bld.baseCost.stone * m;
    };

    return (
        <section>
            <h2>Моє Місто (Мапа 4x4)</h2>
            <div className="city-grid">
                {grid.map((cell) => {
                    if (cell.isBuilding) {
                        const bld = buildingTypes[cell.type];
                        const affordable = canAffordUpgrade(cell);
                        const uc = { money: bld.baseCost.money * cell.level, wood: bld.baseCost.wood * cell.level, stone: bld.baseCost.stone * cell.level };

                        return (
                            <div key={cell.id} className={`cell building ${cell.type}`}>
                                <img src={bld.images[0]} className="cell-bg" alt={bld.name} />
                                <div className="cell-content">
                                    <div className="cell-emoji">{bld.emoji}</div>
                                    <div className="cell-level">Рівень {cell.level}</div>
                                    <div className="cell-stats">
                                        +{bld.baseIncome * cell.level}💰 | {(bld.satisfaction * cell.level) > 0 ? '+' : ''}{bld.satisfaction * cell.level}😊
                                    </div>
                                    <button className="upgrade-btn" onClick={() => onUpgrade(cell.id)} disabled={!affordable}
                                        title={`Апгрейд: ${uc.money}💰 ${uc.wood}🪵 ${uc.stone}🪨`}>
                                        ⬆ Рівень {cell.level + 1}
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    let icon = '';
                    if (cell.type === 'grass') icon = '🌿';
                    if (cell.type === 'road') icon = '🛣️';

                    return (
                        <div key={cell.id} className={`cell ${cell.type}`}>
                            <span style={{ fontSize: '2rem' }}>{icon}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default MyCity;
