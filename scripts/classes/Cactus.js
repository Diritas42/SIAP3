import { Plant } from './Plant.js';

export class Cactus extends Plant {
  constructor() {
    super(0, 0.3, 3);
  }

  getImage() {
    const stages = ['🌵', '🌵', '🌵'];
    return stages[this.growthStage] || stages[0];
  }

  getInfo() {
    return `Кактус: ${super.getInfo()}`;
  }
}