import { Plant } from './Plant.js';

export class SwampPlant extends Plant {
  constructor() {
    super(0.7, 1, 5);
  }

  getImage() {
    const stages = ['🌱', '🪴', '🌿', '🍀', '🌾'];
    return stages[this.growthStage] || stages[0];
  }

  getInfo() {
    return `Болотник: ${super.getInfo()}`;
  }
}