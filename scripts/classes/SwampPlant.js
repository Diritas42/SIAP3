import { Plant } from './Plant.js';

export class SwampPlant extends Plant {
  constructor() {
    super(0.7, 1, 5);
  }

  getImage() {
    const stages = ['🌱', '🪴', '🌿', '🍀', '🌾'];
    const index = Math.min(this.growthStage, stages.length - 1);
    return stages[index];
  }

  getInfo() {
    return `Болотник: ${super.getInfo()}`;
  }
}

