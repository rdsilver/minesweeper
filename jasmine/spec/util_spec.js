describe('Util Class Methods', () => {
  it('should create an array', () => {
    var arr = createArray(5);
    expect(arr.length).toEqual(5);

    arr = createArray(5,5);
    expect(arr.length).toEqual(5);
    expect(arr[0].length).toEqual(5);
  });

  it('should check bounds', () => {
    expect(notOutOfBounds(-1, 2, 200)).toEqual(false);
    expect(notOutOfBounds(201, 2, 200)).toEqual(false);
    expect(notOutOfBounds(199, 0, 200)).toEqual(true);
  });
});
