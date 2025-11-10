import { Plant } from './Plant.js';

export class Cactus extends Plant {
  constructor() {
    super(0, 0.3, 3);
  }

  getImage() {
    const stages = ['🌵', '🌵', '🌵'];
    const index = Math.min(this.growthStage, stages.length - 1);
    return stages[index];
  }

  getInfo() {
    return `Кактус: ${super.getInfo()}`;
  }
}
