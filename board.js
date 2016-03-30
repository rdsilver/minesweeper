class Board {
  constructor(size, numBombs, cellSize, visual) {
    this.size = size;
    this.numBombs = numBombs;
    this.cellSize = cellSize;
    this.visual = visual;
    this.bombNeighborhood = [[0, -1], [-1, 0], [1, 0], [0, 1], [-1, -1], [1, -1], [1, 1], [-1, 1]];
    this.state = 'live';
    this.firstPress = true;
    this.changeFace('happy_face');
    this.pressedCell;

    // This will be overwritten when the first click comes in
    this.grid = _.chunk(_.map(createArray(size*size), cell => cell = {}), this.size);
    this.setAllAttribrute('seenAs', 'blank');
  }

  setBombs(size, numBombs, clickedCell) {
    var flatGrid = _.map(createArray(size*size), cell => cell = {});
    var clickedCellIndex = size * clickedCell.x + clickedCell.y;
    var validBombIndexes = _.pull(_.range(0, flatGrid.length), clickedCellIndex);
    var bombIndexes = _.sampleSize(validBombIndexes, numBombs);

    _.each(bombIndexes, i => {
      flatGrid[i].actual = 'explodedBomb';
    });

    return _.chunk(flatGrid, size);
  }

  calculateNeighborValues() {
    _.each(this.grid, (arr, x) => {
      _.each(arr, (cell, y)=> {
        var bombsTouching = 0;

        _.each(this.bombNeighborhood, dir => {
          // Check if direction will be inbound and if there is a bomb at that spot
          if (notOutOfBounds(x+dir[0], y+dir[1], this.grid.length)) {
            if (this.grid[x+dir[0]][y+dir[1]].actual === 'explodedBomb') {
              bombsTouching++;
            }
          }
        });

        // Not a bomb, add neighbor count
        if (cell.actual === undefined) {
          cell.actual = bombsTouching;
        }
      });
    });
  }

  setAllAttribrute(key, value) {
    _.each(_.flatten(this.grid), cell => {
      cell[key] = value;
    });
  }

  display() {
    _.each(this.grid, (arr, x) => {
      _.each(arr, (cell, y)=> {
        if (_.isInteger(cell.seenAs)) {
          image(icons.bombs[cell.seenAs], x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);
        } else {
          image(icons[cell.seenAs], x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);
        }
      });
    });
  }

  clickedCell(x, y) {
    if (this.grid[x][y].seenAs === 'pressed') {
      this.grid[x][y].seenAs = this.grid[x][y].actual;
      this.checkConditions(x, y);
      this.pressedCell = undefined;
    } else {
      this.unPressCell();
    }
  }

  setUpBoard(x, y) {
    this.grid = this.setBombs(this.size, this.numBombs, {x:x, y:y});
    this.calculateNeighborValues();
    this.setAllAttribrute('seenAs', 'blank');
    this.firstPress = false;
  }

  checkConditions(x, y) {
    this.changeFace('happy_face');

    if (this.grid[x][y].seenAs === 0) {
      this.checkClearArea(x, y);
      this.setAllAttribrute('cleared', false);
    }

    if (this.grid[x][y].seenAs === 'explodedBomb') {
      this.changeFace('dead_face');
      this.state = 'dead';
      return;
    }

    this.checkWin();
  }

  checkClearArea(x, y) {
    this.grid[x][y].seenAs = this.grid[x][y].actual;
    this.grid[x][y].cleared = true;

    _.each(this.bombNeighborhood, dir => {
      var newX = x+dir[0];
      var newY = y+dir[1];
      if (notOutOfBounds(newX, newY, this.grid.length)) {
        var cell = this.grid[newX][newY];

        if (!cell.cleared && cell.seenAs === 'blank') {
          if (cell.actual === 0) {
            this.checkClearArea(newX, newY);
          } else if (_.isInteger(cell.actual)) {
            cell.seenAs = cell.actual;
            cell.cleared = true;
          }
        }
      }
    });
  }

  checkWin() {
    var win = true;
    _.each(_.flatten(this.grid), cell => {
      if (cell.seenAs === 'blank') {
        if (cell.actual !== 'explodedBomb') {
          win = false;
        }
      }
    });

    if (win) {
      this.state = 'win';
      this.changeFace('win_face');
      _.each(_.flatten(this.grid), cell => {
        if (cell.seenAs === 'blank' || cell.seenAs === 'flag') {
          cell.seenAs = 'exposedBomb';
        }
      });
    }
  }

  unPressCell() {
    if (this.pressedCell) {
      this.grid[this.pressedCell[0]][this.pressedCell[1]].seenAs = 'blank';
      this.changeFace('happy_face');
    }
  }

  pressCell(x, y) {
    if (this.firstPress) {
      this.setUpBoard(x, y);
    }

    if (this.grid[x][y].seenAs === 'blank') {
      this.grid[x][y].seenAs = 'pressed';
      this.pressedCell = [x, y];
      this.changeFace('scared_face');
    }
  }

  toggleFlag(x, y) {
    var cell = this.grid[x][y];

    if (cell.seenAs === 'blank') {
      cell.seenAs = 'flag';
    } else if (cell.seenAs === 'flag') {
      cell.seenAs = 'blank';
    }
  }

  changeFace(faceString) {
    // If we are using a solver or in test mode calling any css will break everything because it won't be there
    if (this.visual) {
      $('#face-button').css('background-image', 'url(images/' + faceString +'.png)');
    }
  }
}
