export class Cell {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.moisture = type === 'water' ? 1 : 0;
    this.plant = null;
  }

  calculateMoisture(grid, cells) {
    if (this.type === 'water') {
      this.moisture = 1;
      return;
    }

    let totalMoisture = 0;
    let waterCells = 0;

    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -3; dy <= 3; dy++) {
        const nx = this.x + dx;
        const ny = this.y + dy;

        if (nx >= 0 && nx < grid.width && ny >= 0 && ny < grid.height) {
          const neighbor = cells[ny][nx];
          if (neighbor.type === 'water') {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moistureContribution = 1 / (distance + 1);
            totalMoisture += moistureContribution;
            waterCells++;
          }
        }
      }
    }

    if (waterCells > 0) {
      this.moisture = Math.min(totalMoisture / 3, 1);
    } else {
      this.moisture = 0;
    }
  }

  getColor() {
    if (this.type === 'water') {
      return '#3498db';
    }

    const hue = 30;
    const saturation = 80;
    const lightness = 50 - (this.moisture * 30);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  plantSeed(plantType) {
    if (this.type !== 'land' || this.plant) {
      return false;
    }

    switch (plantType) {
      case 'swamp-plant':
        this.plant = new SwampPlant();
        break;
      case 'potato':
        this.plant = new Potato();
        break;
      case 'cactus':
        this.plant = new Cactus();
        break;
      default:
        return false;
    }

    return true;
  }

  removePlant() {
    this.plant = null;
  }

  changeType() {
    this.type = this.type === 'water' ? 'land' : 'water';
    if (this.type === 'water') {
      this.moisture = 1;
      this.plant = null;
    } else {
      this.moisture = 0;
    }
  }

  update() {
    if (this.plant) {
      this.plant.grow(this.moisture);
      if (!this.plant.isAlive) {
        this.plant = null;
      }
    }
  }
}