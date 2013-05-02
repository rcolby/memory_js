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
    _.each(subset, function(i) {that.winningCombos.push([indexOf, lastIndexOf]);}
  }
  initialize();
  return that;
}

$(document).ready(function(){
  var small = 10;
  var m = new Memory(small);

});