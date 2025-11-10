// js/tools.js - версия без модулей
class ToolManager {
    constructor(grid) {
        this.grid = grid;
        this.activeTool = 'shovel';
        this.selectedPlant = null;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        console.log('Инициализация обработчиков событий...');
        
        // Обработчики для инструментов
        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.activeTool = e.currentTarget.dataset.tool;
                
                // Если выбран инструмент "лопата", сбрасываем выбранное растение
                if (this.activeTool === 'shovel') {
                    this.selectedPlant = null;
                    document.querySelectorAll('.plant').forEach(p => p.classList.remove('active'));
                }
                
                console.log(`Активный инструмент: ${this.activeTool}`);
            });
        });
        
        // Обработчики для растений
        document.querySelectorAll('.plant').forEach(plant => {
            plant.addEventListener('click', (e) => {
                // Снимаем выделение с других растений
                document.querySelectorAll('.plant').forEach(p => p.classList.remove('active'));
                
                // Выделяем выбранное растение
                e.currentTarget.classList.add('active');
                this.selectedPlant = e.currentTarget.dataset.plant;
                this.grid.setSelectedPlantType(this.selectedPlant);
                
                // Активируем инструмент "ведро" для посадки
                this.activeTool = 'bucket';
                document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
                document.querySelector('[data-tool="bucket"]').classList.add('active');
                
                console.log(`Выбрано растение: ${this.selectedPlant}`);
            });
        });
        
        // Обработчик кликов по сетке
        document.getElementById('grid').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            console.log(`Клик по клетке [${row}, ${col}] с инструментом ${this.activeTool}`);
            
            if (this.activeTool === 'shovel') {
                this.grid.dig(row, col);
            } else if (this.activeTool === 'bucket') {
                this.grid.useBucket(row, col);
            }
        });
        
        console.log('Обработчики событий инициализированы');
    }
}
