import { EarthCell, WaterCell } from './cells.js';
import { MarshPlant, Potato, Cactus } from './plants.js';

export class Grid {
    constructor(rows, cols, container) {
        this.rows = rows;
        this.cols = cols;
        this.container = container;
        this.cells = [];
        this.selectedPlantType = null;
        
        this.initGrid();
        this.render();
    }
    
    initGrid() {
        // Создаем случайную сетку с землей и водой
        for (let i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // Случайным образом создаем воду или землю
                if (Math.random() < 0.15) { // 15% шанс создания воды
                    this.cells[i][j] = new WaterCell(i, j);
                } else {
                    this.cells[i][j] = new EarthCell(i, j);
                }
            }
        }
        
        // После создания всех клеток рассчитываем влажность
        this.calculateMoisture();
    }
    
    calculateMoisture() {
        // Рассчитываем влажность для каждой клетки земли на основе близости к воде
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.cells[i][j].type === 'earth') {
                    this.cells[i][j].calculateMoisture(this.cells, this.rows, this.cols);
                }
            }
        }
    }
    
    render() {
        this.container.innerHTML = '';
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.cells[i][j];
                const cellElement = document.createElement('div');
                cellElement.className = `cell ${cell.type}`;
                cellElement.dataset.row = i;
                cellElement.dataset.col = j;
                
                // Устанавливаем цвет земли в зависимости от влажности
                if (cell.type === 'earth') {
                    const moisture = cell.moisture;
                    // Плавный переход от желтого (сухо) к темно-коричневому (влажно)
                    const r = Math.floor(241 - (40 * moisture)); 
                    const g = Math.floor(196 - (100 * moisture)); 
                    const b = Math.floor(15 + (60 * moisture));
                    cellElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                    
                    // Добавляем текст с процентом влажности для отладки (можно удалить)
                    // cellElement.title = `Влажность: ${Math.round(moisture * 100)}%`;
                }
                
                // Добавляем растение, если оно есть
                if (cell.plant && cell.plant.alive) {
                    const plantContainer = document.createElement('div');
                    plantContainer.className = 'plant-container';
                    
                    const plantSprite = document.createElement('div');
                    plantSprite.className = 'plant-sprite';
                    
                    // Определяем стадию роста
                    const growthStage = Math.min(3, Math.floor(cell.plant.growthStage * 3) + 1);
                    plantSprite.classList.add(`growth-${growthStage}`);
                    
                    // Устанавливаем иконку растения
                    let plantEmoji = '🌱'; // иконка по умолчанию
                    if (cell.plant.name === 'marshplant') plantEmoji = '🌿';
                    else if (cell.plant.name === 'potato') plantEmoji = '🥔';
                    else if (cell.plant.name === 'cactus') plantEmoji = '🌵';
                    
                    plantSprite.textContent = plantEmoji;
                    plantContainer.appendChild(plantSprite);
                    cellElement.appendChild(plantContainer);
                }
                
                this.container.appendChild(cellElement);
            }
        }
    }
    
    getCell(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.cells[row][col];
        }
        return null;
    }
    
    setSelectedPlantType(plantType) {
        this.selectedPlantType = plantType;
    }
    
    dig(row, col) {
        const cell = this.getCell(row, col);
        if (cell && cell.type === 'earth') {
            if (cell.plant) {
                cell.removePlant();
                this.calculateMoisture();
                this.render();
                return true;
            } else {
                // Превращаем землю в воду
                this.cells[row][col] = new WaterCell(row, col);
                this.calculateMoisture();
                this.render();
                return true;
            }
        } else if (cell && cell.type === 'water') {
            // Превращаем воду в землю
            this.cells[row][col] = new EarthCell(row, col);
            this.calculateMoisture();
            this.render();
            return true;
        }
        return false;
    }
    
    useBucket(row, col) {
        const cell = this.getCell(row, col);
        if (cell && cell.type === 'earth' && this.selectedPlantType && !cell.plant) {
            // Сажаем растение
            let plant;
            switch(this.selectedPlantType) {
                case 'marshplant':
                    plant = new MarshPlant();
                    break;
                case 'potato':
                    plant = new Potato();
                    break;
                case 'cactus':
                    plant = new Cactus();
                    break;
                default:
                    return false;
            }
            
            if (cell.setPlant(plant)) {
                this.render();
                return true;
            }
        }
        return false;
    }
    
    updatePlants() {
        let updated = false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.cells[i][j];
                if (cell.type === 'earth' && cell.plant) {
                    if (cell.plant.grow(cell.moisture)) {
                        updated = true;
                    } else if (!cell.plant.alive) {
                        updated = true;
                    }
                }
            }
        }
        
        if (updated) {
            this.render();
        }
    }
    
    getPlantsCount() {
        let count = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.cells[i][j].plant && this.cells[i][j].plant.alive) {
                    count++;
                }
            }
        }
        return count;
    }
    
    getWaterCellsCount() {
        let count = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.cells[i][j].type === 'water') {
                    count++;
                }
            }
        }
        return count;
    }
}