'use strict';

class Solver {
  constructor(boardSize, numBombs, timesToSolve) {
    this.startingTime;
    this.boardSize = boardSize;
    this.numBombs = numBombs;
    this.timesToSolve = timesToSolve;
    this.timesSolved = 0;
  }

  solve() {
    var steps;
    this.startingTime = millis();

    while (this.timesToSolve > 0) {
      game = new Board(this.boardSize, this.numBombs, 25, false);
      steps = 0;

      this.firstMoves();

      while(game.state === 'live') {
        var toCheck = this.checkForMustFlags();
        this.checkForMustClicks(toCheck);

        // If no progress from these methods, lets click a random blank
        if (toCheck.length === 0) {
          this.clickRandomBlank();
        }
      }

      if (game.state === 'win') {
        this.timesSolved+=1;
      }

      this.timesToSolve--;
    }
    var timeTaken = _.round((millis() - this.startingTime)/1000, 2);
    console.log(('Solved: ' + this.timesSolved + ' Time Taken: ' + timeTaken + ' seconds'));
    return [this.timesSolved, timeTaken];
  }

  firstMoves() {
    // Click in the middle, this gives us a better chance to get a nice blank area
    var x = _.floor(this.boardSize/2 -1);
    var y = _.floor(this.boardSize/2 -1);
    this.clickCell(x, y);

    // We have to have an open area to work with
    while (game.grid[x][y].seenAs !== 0 && game.state === 'live') {
      x = _.random(0, this.boardSize-1);
      y = _.random(0, this.boardSize-1);
      this.clickCell(x, y);
    }
  }

  checkForMustFlags() {
    var toCheck = [];

    _.each(game.grid, (arr, x) => {
      _.each(arr, (cell, y)=> {
        var seenAs = cell.seenAs;
        var complete = cell.noMoreFlagChecking;

        // We only care about cells that have a positive number
        if (_.indexOf(['flag', 'blank', 0], seenAs) === -1 && !complete) {
          var bombCoords = {};
          _.each(game.bombNeighborhood, dir => {
            var newX = x + dir[0];
            var newY = y + dir[1];

            if (notOutOfBounds(newX, newY, game.grid.length) && _.indexOf(['flag', 'blank'], game.grid[newX][newY].seenAs) >= 0) {
              bombCoords[newX +' '+newY] =  game.grid[newX][newY].seenAs;
            }
          });

          // If the cells bomb number is the same as the blank/flag cells around it
          // These cells are bombs
          if (_.keys(bombCoords).length === seenAs) {
            _.each(_.keys(bombCoords), coords => {
              var split = coords.split(' ');
              var bombX = split[0];
              var bombY = split[1];

              if (bombCoords[coords] !== 'flag') {
                game.toggleFlag(bombX, bombY);
              }
            });
            cell.noMoreFlagChecking = true;
            toCheck.push([x, y]);
          }

          // No need to flag check flags with the correct number of flags around them
          if (_.countBy(bombCoords, _.identity).flag === seenAs) {
            cell.noMoreFlagChecking = true;
            toCheck.push([x, y]);
          }
        }

      });
    });

    return toCheck;
  }

  checkForMustClicks(toCheck) {
    _.each(toCheck, cell => {
        var x = cell[0];
        var y = cell[1];
        cell = game.grid[x][y];

      // If a cell's bomb number is the same as the number of flags around it
      // We can click all the remaining blank cells knowing they arn't bombs
        _.each(game.bombNeighborhood, dir => {
          var newX = x + dir[0];
          var newY = y + dir[1];
          if (notOutOfBounds(newX, newY, game.grid.length) && game.grid[newX][newY].seenAs === 'blank') {
            this.clickCell(newX, newY);
          }
        });
    });
  }

  clickRandomBlank() {
    var blank_coords = [];
    var chosen;

    _.each(game.grid, (arr, x) => {
      _.each(arr, (cell, y)=> {
        if (cell.seenAs === 'blank') {
          blank_coords.push([x, y]);
        }
      });
    });

    if (blank_coords.length > 0) {
      chosen = _.sample(blank_coords);
      this.clickCell(chosen[0], chosen[1]);
    }
  }


  // We have to press a cell before clicking it, unless I write methods in the class for just the solver
  clickCell(x, y) {
    game.pressCell(x, y);
    game.clickedCell(x, y);
  }
}
