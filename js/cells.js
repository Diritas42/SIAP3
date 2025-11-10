// js/cells.js - версия без модулей
class Cell {
    constructor(row, col, type) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.plant = null;
    }
    
    setPlant(plant) {
        if (this.type === 'earth') {
            this.plant = plant;
            return true;
        }
        return false;
    }
    
    removePlant() {
        this.plant = null;
    }
}

class EarthCell extends Cell {
    constructor(row, col) {
        super(row, col, 'earth');
        this.moisture = 0;
    }
    
    calculateMoisture(grid, rows, cols) {
        // Ищем ближайшую воду и рассчитываем влажность на основе расстояния
        let totalMoisture = 0;
        let waterSources = 0;
        
        // Проверяем соседние клетки в радиусе 5 клеток
        const searchRadius = 5;
        for (let i = Math.max(0, this.row - searchRadius); i <= Math.min(rows - 1, this.row + searchRadius); i++) {
            for (let j = Math.max(0, this.col - searchRadius); j <= Math.min(cols - 1, this.col + searchRadius); j++) {
                if (grid[i] && grid[i][j] && grid[i][j].type === 'water') {
                    const distance = Math.sqrt(
                        Math.pow(this.row - i, 2) + Math.pow(this.col - j, 2)
                    );
                    
                    if (distance <= searchRadius) {
                        // Влажность обратно пропорциональна расстоянию до воды
                        const moistureFromThisSource = 1 - (distance / searchRadius);
                        totalMoisture += moistureFromThisSource;
                        waterSources++;
                    }
                }
            }
        }
        
        // Усредняем влажность от всех источников воды
        if (waterSources > 0) {
            this.moisture = Math.min(1, totalMoisture / waterSources);
        } else {
            this.moisture = 0;
        }
    }
}

class WaterCell extends Cell {
    constructor(row, col) {
        super(row, col, 'water');
    }
    
    setPlant() {
        // На воде нельзя сажать растения
        return false;
    }
}
