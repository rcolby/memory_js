// var uniChars = "🐮🐗🐵🐒🐴🐑🐘🐼🐧🐦🐤🐥🐣🐔🐍🐢🐛🐝🐜🐞🐌🐙🐚🐠🐟🐬🐳🐋ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function Memory(size) {
  this.size = size;
  this.matrix = [];
  this.winningCombos = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var subset = characters.substring(0, size/2);

  var that = this;

  function initialize() {
    _.each(_.shuffle(subset), function(i) {that.matrix.push(i);});
    _.each(_.shuffle(subset), function(i) {that.matrix.push(i);});
    _.each(subset, function(i) {
      that.winningCombos.push([_.indexOf(that.matrix, i), _.lastIndexOf(that.matrix, i)]);
    });
  }

  // card must be a jquery element with an id of e.g. "card-0"
  this.reveal = function (card) {
    var index = (card.attr("id").split("-"))[1];
    var letter = that.matrix[index];
    card.append('<span>' + letter + '</span>');
  };

  initialize();
  return that;
}

function draw(memory) {
  var card;
  var span;

  _.each(memory.matrix, function(letter, index, list){
    card = $('<div class="card face-down"></div>');
    card.attr('id', 'card-' + index);
    span = $('<span>' + letter + '</span>');
    card.append(span);

    $('#board').append(card);

    if ((index + 1) % 5 === 0) {
      $('#board').append('<br style="clear: both;">');
    }
  });
}

$(document).ready(function(){
  var small = 10;
  var m = new Memory(small);
  draw(m);

  var cards = $('.card');
  cards.children('span').detach();

  m.reveal($('#card-0'));

});

