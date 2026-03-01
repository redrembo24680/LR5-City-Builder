function BuildingCard({ building, onBuild, canAfford }) {
    return (
        <div className="build-card">
            <div style={{ fontSize: '3rem' }}>{building.emoji}</div>
            <h3>{building.name}</h3>
            <p style={{ color: '#94a3b8', marginBottom: '10px' }}>Категорія: {building.category}</p>
            <p><strong>Вартість:</strong></p>
            <p>{building.baseCost.money}💰 {building.baseCost.wood}🪵 {building.baseCost.stone}🪨</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                Вплив: +{building.baseIncome} Дохід / {building.satisfaction > 0 ? '+' + building.satisfaction : building.satisfaction} Задоволеність
            </p>
            <button onClick={() => onBuild(building.id)} disabled={!canAfford}>Побудувати</button>
        </div>
    );
}

export default BuildingCard;
