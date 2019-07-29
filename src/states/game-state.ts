import { NinePatch } from "../lib/NinePatch";

export class GameState extends Phaser.State {
  private _board: any[][] = [];
  private _visual: Phaser.Image[] = [];
  private _sourcePoint: number[] = [3, 3];
  private _destPoint: number[] = [3, 6];
  private _destObj: Phaser.Image = null;
  private _sourceObj: Phaser.Image = null;
  private _sourceNeighbors: number[];
  private _destNeighbors: number[];
  private _counter: number = 0;

  public create(): void {
    super.create();

    var gridSize = 20;
    var grid = [];
    for (var i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (var j = 0; j < gridSize; j++) {
        grid[i][j] = "Empty";
      }
    }

    // Think of the first index as "distance from the top row"
    // Think of the second index as "distance from the left-most column"

    // This is how we would represent the grid with obstacles above
    grid[0][0] = "Start";
    grid[2][2] = "Goal";

    grid[1][1] = "Obstacle";
    grid[1][2] = "Obstacle";
    grid[1][3] = "Obstacle";
    grid[2][1] = "Obstacle";

    //
    //
    // Start location will be in the following format:
    // [distanceFromTop, distanceFromLeft]
    var findShortestPath = function(startCoordinates, grid) {
      var distanceFromTop = startCoordinates[0];
      var distanceFromLeft = startCoordinates[1];

      // Each "location" will store its coordinates
      // and the shortest path required to arrive there
      var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: "Start"
      };

      // Initialize the queue with the start location already inside
      var queue = [location];

      // Loop through the grid searching for the goal
      while (queue.length > 0) {
        // Take the first location off the queue
        var currentLocation = queue.shift();

        // Explore North
        var newLocation = exploreInDirection(currentLocation, "North", grid);
        if (newLocation.status === "Goal") {
          return newLocation.path;
        } else if (newLocation.status === "Valid") {
          queue.push(newLocation);
        }

        // Explore East
        var newLocation = exploreInDirection(currentLocation, "East", grid);
        if (newLocation.status === "Goal") {
          return newLocation.path;
        } else if (newLocation.status === "Valid") {
          queue.push(newLocation);
        }

        // Explore South
        var newLocation = exploreInDirection(currentLocation, "South", grid);
        if (newLocation.status === "Goal") {
          return newLocation.path;
        } else if (newLocation.status === "Valid") {
          queue.push(newLocation);
        }

        // Explore West
        var newLocation = exploreInDirection(currentLocation, "West", grid);
        if (newLocation.status === "Goal") {
          return newLocation.path;
        } else if (newLocation.status === "Valid") {
          queue.push(newLocation);
        }
      }

      // No valid path found
      return false;
    };

    // This function will check a location's status
    // (a location is "valid" if it is on the grid, is not an "obstacle",
    // and has not yet been visited by our algorithm)
    // Returns "Valid", "Invalid", "Blocked", or "Goal"
    var locationStatus = function(location, grid) {
      var gridSize = grid.length;
      var dft = location.distanceFromTop;
      var dfl = location.distanceFromLeft;

      if (
        location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize
      ) {
        // location is not on the grid--return false
        return "Invalid";
      } else if (grid[dft][dfl] === "Goal") {
        return "Goal";
      } else if (grid[dft][dfl] !== "Empty") {
        // location is either an obstacle or has been visited
        return "Blocked";
      } else {
        return "Valid";
      }
    };

    // Explores the grid from the given location in the given
    // direction
    var exploreInDirection = function(currentLocation, direction, grid) {
      var newPath = currentLocation.path.slice();
      newPath.push(direction);

      var dft = currentLocation.distanceFromTop;
      var dfl = currentLocation.distanceFromLeft;

      if (direction === "North") {
        dft -= 1;
      } else if (direction === "East") {
        dfl += 1;
      } else if (direction === "South") {
        dft += 1;
      } else if (direction === "West") {
        dfl -= 1;
      }

      var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: "Unknown"
      };
      newLocation.status = locationStatus(newLocation, grid);

      // If this new location is valid, mark it as 'Visited'
      if (newLocation.status === "Valid") {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
      }

      return newLocation;
    };

    // OK. We have the functions we need--let's run them to get our shortest path!

    // Create a 4x4 grid
    // Represent the grid as a 2-dimensional array
    var gridSize = 20;
    var grid = [];
    for (var i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (var j = 0; j < gridSize; j++) {
        grid[i][j] = "Empty";
      }
    }

    // Think of the first index as "distance from the top row"
    // Think of the second index as "distance from the left-most column"

    // This is how we would represent the grid with obstacles above
    grid[0][0] = "Start";
    grid[16][16] = "Goal";

    grid[1][1] = "Obstacle";
    grid[1][2] = "Obstacle";
    grid[1][3] = "Obstacle";
    grid[2][1] = "Obstacle";

    console.log(findShortestPath([0, 0], grid));

    // this._build2DPath();
    // this._build2DVisual();
    // this._buildShortestPath();
  }

  _build2DPath() {
    const path = [];

    for (let i = 0; i < 7; i++) {
      path.push([]);

      for (let j = 0; j < 7; j++) {
        path[i].push(0);
      }
    }

    this._board = path;
  }

  _build2DVisual() {
    const board = this._board;
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      this._visual.push([]);

      for (let j = 0; j < row.length; j++) {
        const cell = row[i];

        const img = this.game.add.image(j * 57, i * 57, "frame2");
        img.tint = 0xcccccc;
        img.scale.set(0.9);

        this._visual[i].push(img);
      }
    }

    this._destObj = this._getImageFromPoint(this._destPoint);
    this._sourceObj = this._getImageFromPoint(this._sourcePoint);

    this._destObj.tint = 0xff0000;
    this._sourceObj.tint = 0xff0000;
  }

  _getImageFromPoint(point) {
    return this._visual[point[0]][point[1]];
  }

  _buildShortestPath() {
    const ns = { cells: [], parent: this._sourcePoint };
    const tree = this._buildNeighborsTree(ns, [...this._sourcePoint], [...this._destPoint]);
  }

  _buildNeighborsTree(parentNS, fromPt: number[], toPt: number[]) {
    ++this._counter;
    if (this._counter > 100) {
      return;
    }

    const ns = this._getNeighbors(fromPt);
    parentNS.cells.push(ns);

    for (let i = 0; i < ns.cells.length; ++i) {
      const cell = ns.cells[i];
      this._tintCell(cell, i * 100);
    }

    const sameCell = ns.cells.find(cell => this._isSameCell(cell, toPt));
    if (sameCell) {
      return ns;
    } else {
      for (let i = 0; i < ns.cells.length; ++i) {
        const cell = ns.cells[i];
        this._buildNeighborsTree(ns, cell, toPt);
        console.log(cell);
      }
    }
  }

  _getNeighbors(point: number[]) {
    const b = this._board;
    const x = point[0];
    const y = point[1];
    const n = { cells: [], parent: point };

    const i1 = [x - 1, y];
    const i2 = [x, y + 1];
    const i3 = [x + 1, y];
    const i4 = [x, y - 1];

    if (b[i1[0]] !== undefined && b[i1[0]][i1[1]] !== undefined) {
      n.cells.push([...i1]);
    }

    if (b[i2[0]] !== undefined && b[i2[0]][i2[1]] !== undefined) {
      n.cells.push([...i2]);
    }

    if (b[i3[0]] !== undefined && b[i3[0]][i3[1]] !== undefined) {
      n.cells.push([...i3]);
    }

    if (b[i4[0]] !== undefined && b[i4[0]][i4[1]] !== undefined) {
      n.cells.push([...i4]);
    }

    return n;
  }

  _isSameCell(pointA, pointB) {
    return pointA[0] === pointB[0] && pointA[1] === pointB[1];
  }

  _tintCell(point, delay) {
    setTimeout(() => {
      const neighbor = this._getImageFromPoint(point);
      neighbor.tint = 0x0000ff;
    }, delay);
  }
}

// let a = 0
// while(a < 100) {
//   ++a
//   const {}

// }

// let a = 0
// while(a < 100){
//   ++a

// }
// const np = this._getNeighborsPair([...this._sourcePoint], [...this._destPoint]);

// const sn = this._getNeighbors([...this._sourcePoint]);
// const dn = this._getNeighbors([...this._destPoint]);

// neighBorsPair.push(sn, dn);

// neighBorsPair.forEach(pair => {
//   pair.forEach((point, index) => {
//     setTimeout(() => {
//       const neighbor = this._getImageFromPoint(point);
//       neighbor.tint = 0x0000ff;
//     }, 100 * index);
//   });
// });

//
//   // const config = {
//   frame: "frame1",
//   width: 500,
//   height: 500,
//   data: {
//     top: 70,
//     bottom: 70,
//     right: 70,
//     left: 70
//   }
// };

// for (let i = 0; i < 1; ++i) {
//   for (let j = 0; j < 1; ++j) {
//     const frame = new NinePatch(this.game, config);
//     frame.position.set(i * 180, j * 180);
//     frame.scale.set(0.3);
//     this.game.world.add(frame);
//   }
// }

// const bt = this.game.cache.getBaseTexture("frame1");
// const rect = new PIXI.Rectangle(0, 0, bt.width / 2, bt.height / 2);
// const t = new PIXI.Texture(bt, rect);
// const sprite = new PIXI.Sprite(t);

// const cont = new PIXI.DisplayObjectContainer();
// cont.update = () => {};
// cont.postUpdate = () => {};

// cont.addChild(sprite);

// this.game.world.add(cont);
// const n = new NinePatch(this.game, 0, 0, null, "frame1", 300, 300, { top: 70, bottom: 70, right: 70, left: 70 });

// _testMovement() {
//   this.game.add.tween(this).to({ rotation: 2 * Math.PI }, 3000, null, true, 0, -1);
//   this.game.add.tween(this.scale).to({ x: 2, y: 2 }, 1000, null, true, 0, -1, true);
//   const tweenData = { a: 196, b: 196 };
//   const tween = this.game.add.tween(tweenData).to({ a: 300, b: 300 }, 1000, null, true, 0, -1, true);
//   tween.onUpdateCallback((tween, progress, tweenData) => {
//     const { a, b } = tween.target;
//     this.resize(a, b);
//   });
// }

// public update() {}

// public postUpdate() {}
