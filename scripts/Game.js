import { Cell } from './classes/Cell.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.selectedTool = 'shovel';
    this.selectedCell = null;
    this.initGrid();
    this.setupEventListeners();
    this.startGameLoop();
  }

  initGrid() {
    const grid = document.getElementById('grid');
    grid.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;

    for (let y = 0; y < this.height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.width; x++) {
        const type = Math.random() < 0.1 ? 'water' : 'land';
        const cell = new Cell(type, x, y);
        this.cells[y][x] = cell;

        const cellElement = document.createElement('div');
        cellElement.className = `cell ${type}`;
        cellElement.dataset.x = x;
        cellElement.dataset.y = y;
        cellElement.style.backgroundColor = cell.getColor();

        cellElement.addEventListener('click', () => this.handleCellClick(x, y));

        grid.appendChild(cellElement);
      }
    }

    this.calculateMoisture();
    this.updateGridDisplay();
    this.updateStats();
  }

  calculateMoisture() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x].calculateMoisture(this, this.cells);
      }
    }
  }

  updateGridDisplay() {
    const grid = document.getElementById('grid');
    const cellElements = grid.getElementsByClassName('cell');

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        const cellElement = cellElements[y * this.width + x];

        cellElement.className = `cell ${cell.type}`;
        cellElement.style.backgroundColor = cell.getColor();

        if (cell.type === 'water') {
          cellElement.textContent = '💧';
        } else if (cell.plant) {
          cellElement.textContent = cell.plant.getImage();
        } else {
          cellElement.textContent = '';
        }
      }
    }

    this.updateSelectedCellInfo();
  }

  handleCellClick(x, y) {
    const cell = this.cells[y][x];
    this.selectedCell = cell;

    switch (this.selectedTool) {
      case 'shovel':
        if (cell.plant) {
          cell.removePlant();
        }
        break;
      case 'bucket':
        cell.changeType();
        break;
      case 'swamp-plant':
      case 'potato':
      case 'cactus':
        if (cell.type === 'land') {
          const planted = cell.plantSeed(this.selectedTool);
          if (!planted) {
            console.log('Не удалось посадить растение');
          }
        }
        break;
    }

    this.calculateMoisture();
    this.updateGridDisplay();
    this.updateStats();
  }

  setupEventListeners() {
    const tools = document.querySelectorAll('.tool');

    tools.forEach((tool) => {
      tool.addEventListener('click', () => {
        tools.forEach((t) => t.classList.remove('active'));
        tool.classList.add('active');
        this.selectedTool = tool.dataset.tool;
      });
    });
  }

  updateSelectedCellInfo() {
    const plantInfo = document.getElementById('plant-info');

    if (!this.selectedCell) {
      plantInfo.innerHTML = '<p>Выберите клетку для просмотра информации</p>';
      return;
    }

    const cell = this.selectedCell;
    let info = `<p>Тип: ${cell.type === 'land' ? 'Земля' : 'Вода'}</p>`;
    info += `<p>Увлажненность: ${Math.round(cell.moisture * 100)}%</p>`;

    if (cell.plant) {
      info += `<p>${cell.plant.getInfo()}</p>`;
      info += `<p>Состояние: ${cell.plant.isAlive ? 'Живое' : 'Погибшее'}</p>`;
    } else if (cell.type === 'land') {
      info += '<p>Растение: отсутствует</p>';
    }

    plantInfo.innerHTML = info;
  }

  updateStats() {
    let plantCount = 0;
    let waterCount = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        if (cell.plant) {
          plantCount++;
        }
        if (cell.type === 'water') {
          waterCount++;
        }
      }
    }

    document.getElementById('plant-count').textContent = `Растений: ${plantCount}`;
    document.getElementById('water-count').textContent = `Водных клеток: ${waterCount}`;
  }

  startGameLoop() {
    setInterval(() => {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.cells[y][x].update();
        }
      }
      this.updateGridDisplay();
      this.updateStats();
    }, 2000);
  }
}
