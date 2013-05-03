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

  that.hideAll = function () {
    for (var i = 0; i < that.matrix.length; i += 1) {
      that.hide($("#card-" + i));
    }
  };

  // takes two cardEl elements, which should already be revealed
  that.checkForMatch = function (cardEl1, cardEl2) {
    if (!cardEl2) {
      return false;
    }

    var index1 = getIndex(cardEl1);
    var index2 = getIndex(cardEl2);
    var cardObj1 = that.matrix[index1];
    var cardObj2 = that.matrix[index2];

    // var hideStuff = function () {
    //   that.hide(cardEl1);
    //   that.hide(cardEl2);
    // };

    if (cardObj1.faceValue === cardObj2.faceValue) {
      cardObj1.paired = true;
      cardObj2.paired = true;
      that.hideAll();
      return true;
    }
    else {
      // that.hide(cardEl1);
      // that.hide(cardEl2);
      // // cardTimer = setTimeout(hideStuff, 1000);
      // cardObj1.faceUp = false;
      // cardObj2.faceUp = false;
      return false;
    }
  };

  // cardEl must be a jquery element with an id of e.g. "card-0"
  function getIndex(cardEl) {
    return (cardEl.attr("id").split("-"))[1];
  }

  that.getNonPairedVisibleCardEls = function () {
    var cardEls = [];

    for (var i = 0; i < that.matrix.length; i += 1) {
      if (that.matrix[i].faceUp && !that.matrix[i].paired) {
        cardEls.push($('#card-' + i));
      }
    }
    return cardEls;
  };

  that.getNumPairedCards = function () {
    var number = 0;
    _.each(that.matrix, function (card) {
      if (card.paired) {
        number += 1;
      }
    });
    return number;
  };

  that.getNumRevealedCards = function () {
    var number = 0;
    _.each(that.matrix, function (card) {
      if (card.faceUp) {
        number += 1;
      }
    });
    return number;
  };

  initialize();
  return that;
}

function draw(memory) {
  var card;
  var span;

  $('#board').empty();

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

  var games = {
    "Small": 10,
    "Medium": 20,
    "Large": 40
  };

  var clickCounter, m, stopwatch, timer, cardTimer;
  stopwatch = new Stopwatch();
  stopwatch.resolution = 1000;

  $('button').on("click", function (event) {
    var size = $(event.target).text();
    m = new Memory(games[size]);

    draw(m);

    var cards = $('.card');
    cards.children('span').detach();

    $(".information").removeClass('hidden');

    clickCounter = 0;
    maxClicks = 0;
    stopwatch.reset();
    stopwatch.start();
    timer = setInterval( function () { $('.timer').html(stopwatch.toString()); }, 1000 );
  });

  $('#board').on("click", ".card", function (event) {

    // only increment the click counters when clicking on a face down non-matched card
    if (!$(event.target).hasClass("matched") && $(event.target).hasClass("face-down")) {
      maxClicks += 1;
      if (!(maxClicks === 3)) {
        clickCounter += 1;
      }
    }

    m.reveal($(this));

    var newClicks = m.getNonPairedVisibleCardEls();

    if (that.checkForMatch(newClicks[0], newClicks[1])) {
      newClicks[0].addClass("matched");
      newClicks[1].addClass("matched");
    }
    else if (maxClicks === 3) {
      m.hideAll();
      maxClicks = 0;
    }

    $('.information .click-count').html(clickCounter);

    if (m.matrix.length === m.getNumPairedCards()) {
      clearInterval(timer);
      stopwatch.stop();
      $('.information').append('<h1>Congrats!</h1>');
    }
  });

});