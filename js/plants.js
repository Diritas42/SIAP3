export class Plant {
    constructor(name, minMoisture, maxMoisture) {
        this.name = name;
        this.minMoisture = minMoisture;
        this.maxMoisture = maxMoisture;
        this.growthStage = 0; // от 0 до 1
        this.alive = true;
    }
    
    grow(moisture) {
        if (!this.alive) return false;
        
        // Проверяем, подходит ли влажность для растения
        if (moisture >= this.minMoisture && moisture <= this.maxMoisture) {
            // Растение растет
            this.growthStage = Math.min(1, this.growthStage + 0.1);
            return true;
        } else {
            // Растение погибает, если влажность не подходит
            this.alive = false;
            return false;
        }
    }
}

export class MarshPlant extends Plant {
    constructor() {
        super('marshplant', 0.7, 1.0); // Болотник любит высокую влажность
    }
}

export class Potato extends Plant {
    constructor() {
        super('potato', 0.3, 0.8); // Картошка предпочитает среднюю влажность
    }
}

export class Cactus extends Plant {
    constructor() {
        super('cactus', 0.0, 0.3); // Кактус предпочитает сухую почву
    }
}