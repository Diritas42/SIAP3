import { Plant } from './Plant.js';

export class Potato extends Plant {
  constructor() {
    super(0.4, 0.8, 4);
  }

  getImage() {
    const stages = ['🌱', '🥔', '🥔', '🥔'];
    return stages[this.growthStage] || stages[0];
  }

  getInfo() {
    return `Картошка: ${super.getInfo()}`;
  }
}