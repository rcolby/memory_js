// var uniChars = "🐮🐗🐵🐒🐴🐑🐘🐼🐧🐦🐤🐥🐣🐔🐍🐢🐛🐝🐜🐞🐌🐙🐚🐠🐟🐬🐳🐋ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var that;

function Card(faceValue) {
  this.faceValue = faceValue;
  this.faceUp = false;
  this.paired = false;
}

function Memory(size) {
  that = this;

  that.size = size;

  that.matrix = [];
  // stores cards in the matrix array as a card object:
  /* var card = {
    "faceValue" : "A",
    "faceUp" : false,
    "paired" : false
  };*/

  // that.winningCombos = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var subset = characters.substring(0, size/2);

  function initialize() {
    _.each(subset, function(letter) {
      that.matrix.push(new Card(letter));
      that.matrix.push(new Card(letter));
    });

    that.matrix = _.shuffle(that.matrix);

    // _.each(subset, function(letter) {
    //   var lettersMatrix = _.pluck(that.matrix, 'faceValue');
    //   that.winningCombos.push([_.indexOf(lettersMatrix, letter), _.lastIndexOf(lettersMatrix, letter)]);
    // });
  }

  // cardEl must be a jquery element with an id of e.g. "card-0"
  that.reveal = function (cardEl) {
    var index = getIndex(cardEl);
    var letter = that.matrix[index].faceValue;
    that.matrix[index].faceUp = true;

    cardEl.empty();
    cardEl.html(letter);
    cardEl.addClass("face-up");
    cardEl.removeClass("face-down");
  };

  // cardEl must be a jquery element with an id of e.g. "card-0"
  that.hide = function (cardEl) {
    var index = getIndex(cardEl);
    var cardObj = that.matrix[index];

    // if the card is paired, we want it to still show
    if (!cardObj.paired) {
      that.matrix[index].faceUp = false;
      cardEl.empty();
      cardEl.addClass("face-down");
      cardEl.removeClass("face-up");
    }
  };

  // takes two cardEl elements, which should already be revealed
  that.checkForMatch = function (cardEl1, cardEl2) {
    var index1 = getIndex(cardEl1);
    var index2 = getIndex(cardEl2);
    var cardObj1 = that.matrix[index1];
    var cardObj2 = that.matrix[index2];

    if (cardObj1.faceValue === cardObj2.faceValue) {
      cardObj1.paired = true;
      cardObj2.paired = true;
      // return true;
    }
    else {
      that.hide(cardEl1);
      that.hide(cardEl2);
      // return false;
    }
  };

  // cardEl must be a jquery element with an id of e.g. "card-0"
  function getIndex(cardEl) {
    return (cardEl.attr("id").split("-"))[1];
  }

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

  $('#board').on("click", ".card", function () { m.reveal($(this)); } );
  // $('#search-results').on("click", "li.result", displayMovie);

});

