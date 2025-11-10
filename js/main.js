import { Grid } from './grid.js';
import { ToolManager } from './tools.js';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const grid = new Grid(10, 10, gridElement);
    
    const toolManager = new ToolManager(grid);
    
    // Обновление статистики
    function updateStats() {
        document.getElementById('plants-count').textContent = grid.getPlantsCount();
        document.getElementById('water-count').textContent = grid.getWaterCellsCount();
        
        // Обновление активного инструмента в статистике
        const activeToolElement = document.querySelector('.tool.active');
        if (activeToolElement) {
            const toolName = activeToolElement.querySelector('span:not(.tool-icon)').textContent;
            document.getElementById('active-tool').textContent = toolName;
        }
    }
    
    // Игровой цикл
    let day = 1;
    const gameLoop = setInterval(() => {
        grid.updatePlants();
        day++;
        document.getElementById('day').textContent = day;
        updateStats();
        
        // Обновляем влажность каждые 5 дней
        if (day % 5 === 0) {
            grid.calculateMoisture();
            grid.render();
        }
    }, 5000); // Каждые 5 секунд - новый "день"
    
    // Инициализация статистики
    updateStats();
    
    // Экспорт для отладки (можно удалить в продакшене)
    window.game = {
        grid,
        toolManager,
        stopGame: () => clearInterval(gameLoop)
    };
});