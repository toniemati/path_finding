/** @type {HTMLCanvasElement} */

import Spot from './Spot.js';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

//* Setting canvnas size
if (window.innerWidth > window.innerHeight)
  canvas.width = canvas.height = window.innerHeight * 0.9;
else
  canvas.width = canvas.height = window.innerWidth * 0.9;

let userFps = parseInt(prompt('Szybkość: (1-60)'));
const FPS = (userFps < 1 || userFps > 60) ? 1 : userFps;
let lastTime = 0;

let userRows = parseInt(prompt('Wielkość siatki: (3-200)'));
const rows = (userRows < 3 || userRows > 200) ? 3 : userRows;
const cols = rows;

let userWalls = parseInt(prompt(`Ilość ścian: (0-${Math.floor((rows * cols) / 4)})`));
let wallsCount = userWalls;
const gap = canvas.width / rows;

const grid = Array(rows).fill().map((row, i) => Array(cols).fill().map((col, j) => new Spot(i, j, gap)));
const wallsArr = [];
let openSet = [];
let closedSet = [];
let path = [];

const start = grid[0][0];
const end = grid[rows - 1][cols - 1];

const addWalls = () => {
  if (wallsCount > (rows * cols) / 4) {
    alert(`Cannot add more than ${Math.floor((rows * cols) / 4)} walls`);
    wallsCount = Math.floor((rows * cols) / 10);
  }

  for (let i = 0; i < wallsCount; i++) {
    let x = -1;
    let y = -1;

    while (
      x < 0 ||
      y < 0 ||
      grid[x][y] === start ||
      grid[x][y] === end
    ) {
      x = Math.floor(Math.random() * rows);
      y = Math.floor(Math.random() * rows); 
    }

    grid[x][y].isWall = true;
    wallsArr.push(grid[x][y])
  }
}

addWalls();
console.log('walls count:', wallsArr.length);

grid.forEach((row) => row.forEach((spot) => spot.addNeighbors(grid)));
openSet.push(start);

const h = (p1, p2) => {
  const {x: x1, y: y1} = p1;
  const {x: x2, y: y2} = p2;

  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const loop = (timestamp) => {
  const deltaTime = (timestamp - lastTime) / 1000;
  requestAnimationFrame(loop);
  if (deltaTime < 1 / FPS) return;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  closedSet.forEach((spot) => spot.draw(ctx, 'red'));
  openSet.forEach((spot) => spot.draw(ctx, 'green'));
  wallsArr.forEach((wall) => wall.draw(ctx, 'black'));
  path.forEach((spot) => spot.draw(ctx, 'blue'));
  start.draw(ctx, 'orange');
  end.draw(ctx, 'orange');


  if (openSet.length) {
    const current = openSet.reduce((prev, curr) => curr.f < prev.f ? curr : prev);


    if (current === end) {
      path = [];
      let temp = current;

      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }

      console.log('DONE!');

    } else {
      openSet = openSet.filter((spot) => spot !== current);
      closedSet.push(current);
  
      current.neighbors.forEach((neighbor) => {
        if (!closedSet.includes(neighbor)) {
          let tempG = current.g + 1;
          let betterG = false;
  
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
            neighbor.h = h(neighbor, end);
            betterG = true;
  
          } else if (tempG < neighbor.g) {
            betterG = true;
          }
  
          if (betterG) {
            neighbor.previous = current;
            neighbor.g = tempG;
            neighbor.f = neighbor.g + neighbor.h;
          }
        }
      })

    }
  } else {
    console.log('No solution!');
  }
}

loop(0);