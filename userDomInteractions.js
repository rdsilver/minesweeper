'use strict';

var controls = {
  addSizes: function() {
    for(var index=5;index<=20;index++) {
        $('#size-of-board').append($('<option></option>').val(index).html(index+'x'+index));
    }

    // Default Value 10x10
    $('#size-of-board').val(10);
  },

	onSizeChange: function() {
		$('#size-of-board').change(controls.restrictBombNum).change(controls.resetGame);
	},

  onBombChange: function() {
    $('#number-of-bombs').change(controls.resetGame);
  },

  restrictBombNum: function() {
    var sizeSquared = Math.pow($(this).val(), 2);
    var input = $('#number-of-bombs');

    input.prop('max', sizeSquared);

    if (input.val() > sizeSquared) {
      input.val(sizeSquared);
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