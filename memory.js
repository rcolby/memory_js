function Memory(size) {
  this.size = size;
  this.matrix = [];
  this.winningCombos = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var that = this;
  var subset = characters.substring(0, size/2);
  function initialize() {
    _.each(_.shuffle(subset), function(i) {that.matrix.push(i);});
    _.each(_.shuffle(subset), function(i) {that.matrix.push(i);});
    _.each(subset, function(i) {
      that.winningCombos.push([_.indexOf(that.matrix, i), _.lastIndexOf(that.matrix, i)]);
    });
  }
  initialize();
  return that;
}

function draw(memory) {
//  var row = $('<div class="row"></div>');
  var card;
  _.each(memory.matrix, function(letter, index, list){
    card = $('<div class="card"></div>');
    card.attr('id', 'card-' + index);
    card.html(letter);
    $('#board').append(card);
  });
}

$(document).ready(function(){
  var small = 10;
  var m = new Memory(small);
  draw(m);

});