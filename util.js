function createArray(length) {
  var arr = new Array(length || 0),
  i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}

function notOutOfBounds(x, y, max) {
  if (x < 0) {
    return false;
  }

  if (x >= max) {
    return false;
  }

  if (y < 0) {
    return false;
  }

  if (y >= max) {
    return false;
  }

  return true;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
