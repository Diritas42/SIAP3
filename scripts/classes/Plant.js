export class Plant {
  constructor(minMoisture, maxMoisture, maxGrowthStage) {
    this.minMoisture = minMoisture;
    this.maxMoisture = maxMoisture;
    this.growthStage = 0;
    this.maxGrowthStage = maxGrowthStage;
    this.isAlive = true;
  }

  grow(moisture) {
    if (moisture < this.minMoisture || moisture > this.maxMoisture) {
      this.isAlive = false;
      return;
    }

    if (this.growthStage < this.maxGrowthStage) {
      this.growthStage++;
    }
  }

  getImage() {
    return '🌱';
  }

  getInfo() {
    return `Стадия роста: ${this.growthStage}/${this.maxGrowthStage}`;
  }
}