class Spot {

  constructor(i, j, width) {
    this.i = i;
    this.j = j;
    this.width = width;
    this.x = i * width;
    this.y = j * width;
    this.neighbors = [];
    this.previous = null;
    this.isWall = false;

    this.g = 0;
    this.h = 0;
    this.f = 0;
  }

  addNeighbors = (grid) => {
    //* upptie
    if (this.i > 0 && !grid[this.i - 1][this.j].isWall)
      this.neighbors.push(grid[this.i - 1][this.j]);

    //* downie
    if (this.i < grid.length - 1 && !grid[this.i + 1][this.j].isWall)
      this.neighbors.push(grid[this.i + 1][this.j]);
      
    //* leftie
    if (this.j > 0 && !(grid[this.i][this.j - 1].isWall))
      this.neighbors.push(grid[this.i][this.j - 1]);

    //* rightie
    if (this.j < grid.length - 1 && !grid[this.i][this.j + 1].isWall)
      this.neighbors.push(grid[this.i][this.j + 1]);

  }

  draw = (ctx, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      this.x,
      this.y,
      this.width,
      this.width
    );
  }
}

export default Spot;