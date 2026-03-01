function Budget({ resources, satisfaction }) {
    return (
        <section id="resources">
            <h2>Ресурси міста</h2>
            <div className="resource-stats">
                <div className="stat"><h3>💰 Бюджет</h3><p>{resources.money}</p></div>
                <div className="stat"><h3>🪵 Дерево</h3><p>{resources.wood}</p></div>
                <div className="stat"><h3>🪨 Камінь</h3><p>{resources.stone}</p></div>
                <div className="stat" style={{ border: satisfaction > 0 ? '1px solid var(--accent-color)' : '1px solid var(--danger-color)' }}>
                    <h3>😊 Задоволеність</h3>
                    <p style={{ color: satisfaction > 0 ? 'var(--accent-color)' : 'var(--danger-color)' }}>{satisfaction}%</p>
                </div>
            </div>
        </section>
    );
}

export default Budget;
