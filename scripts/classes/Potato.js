import { Plant } from './Plant.js';

export class Potato extends Plant {
  constructor() {
    super(0.4, 0.8, 4);
  }

  getImage() {
    const stages = ['🌱', '🥔', '🥔', '🥔'];
    const index = Math.min(this.growthStage, stages.length - 1);
    return stages[index];
  }

  getInfo() {
    return `Картошка: ${super.getInfo()}`;
  }
}
