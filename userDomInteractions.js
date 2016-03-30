var controls = {
  addSizes: function() {
    _.each(_.range(5, 20), i => {
      $('#size-of-board').append($('<option></option>').val(i).html(i+'x'+i));
    });

    $('#size-of-board').val(sketchOptions.defaultGameSize);
  },

  onSizeChange: function() {
    $('#size-of-board').change(controls.restrictBombNum).change(controls.resetGame);
  },

  onBombChange: function() {
    $('#number-of-bombs').change(controls.resetGame);
  },

  restrictBombNum: function() {
    var maxSize = Math.pow($(this).val(), 2) - 1;
    var input = $('#number-of-bombs');

    input.prop('max', maxSize);

    if (input.val() > maxSize) {
      input.val(maxSize);
    }
  },

  onFaceClick: function() {
    $('#face-button').click(controls.resetGame);
  },

  resetGame: function() {
    var size = $('#size-of-board').val();
    var numBombs = $('#number-of-bombs').val();
    resize(size);
    game = new Board(size, numBombs, sketchOptions.cellSize, true);
  },

  preventRightClickModalBox: function() {
    $('#canvas').bind('contextmenu', function(e) {
      return false;
    });
  }
};


$(function() {
  controls.addSizes();
  controls.onSizeChange();
  controls.onBombChange();
  controls.onFaceClick();
  controls.preventRightClickModalBox();
});
