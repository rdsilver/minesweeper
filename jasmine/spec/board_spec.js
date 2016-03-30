describe('Board Class Methods', () => {
  beforeEach(() => {
    this.testBoard = new Board(5, 2, 25, false);
    this.otherBoard = new Board(10, 0, 25, false);
  });

  it('should create a new board with specific attributes', () => {
    expect(this.testBoard.grid.length).toEqual(5);
    expect(this.testBoard.grid[0].length).toEqual(5);
    expect(this.testBoard.cellSize).toEqual(25);
  });

  it('should create a grid with 2 bombs', () => {
    this.testBoard.pressCell(0,0);
    var numBombs = _.countBy(_.flatten(this.testBoard.grid), cell => cell.actual).explodedBomb;
    expect(numBombs).toEqual(2);
  });

  it('should create a grid with 25 actual values', () => {
    var total = 0;
    _.each(_.countBy(_.flatten(this.testBoard.grid), cell => cell.actual), amount => total+= amount);
    expect(total).toEqual(25);
  });

  it('should create a grid with 25 blank seen as values', () => {
    var seenAsNum = _.countBy(_.flatten(this.testBoard.grid), cell => cell.seenAs).blank;
    expect(seenAsNum).toEqual(25);
  });

  it('should set an attribute with setAllAttribrute method', () => {
    this.testBoard.setAllAttribrute('test', '1');
    var testTotal = _.countBy(_.flatten(this.testBoard.grid), cell => cell.test);
    expect(testTotal[1]).toEqual(25);
  });

  it('checks whether to sweep the area clicked', () => {
    this.otherBoard.pressCell(0,0);
    this.otherBoard.checkClearArea(0, 0);
    var numSeenAsZero = _.countBy(_.flatten(this.otherBoard.grid), cell => cell.seenAs)[0];

    expect(numSeenAsZero).toEqual(100);
  });

  it('should check win condition', () => {
    this.otherBoard.pressCell(0,0);
    this.otherBoard.checkClearArea(0, 0);
    this.otherBoard.checkWin();
    expect(this.otherBoard.state).toEqual('win');
  });

});
