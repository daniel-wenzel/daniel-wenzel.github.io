var API = "https://7jl5syf5i1.execute-api.eu-west-1.amazonaws.com/dev/move?"


function aiMove() {
  var truncatedFen = game.fen().match(/(\w+\/)+\w*/)[0]
  var color = game.turn()

  ajaxMove(truncatedFen, color)
}

function ajaxMove(truncatedFen, color) {
  var xhttp = new XMLHttpRequest();
  var url=API+"color="+color+"&fen="+truncatedFen
//  game.move("e6")
  xhttp.onreadystatechange = function() {
    console.log(this.readyState)
    if (this.readyState == 4 && this.status >= 300) {
      alert("could not get move!")
      console.log(this.status)
      console.log(this.responseText)
      return;
    }
    if (this.readyState == 4) {
      var moveString=this.responseText
      console.log(moveString)
      var move=parseMove(moveString)
      var move=game.move(move, {sloppy: true})
      if (move === null) {
        console.log("ai made invalid move. Fall back to random move. The show must go on")
        var moves = game.moves();
        game.move(moves[Math.floor(Math.random() * moves.length)]);
      }
      updateStatus();
      board.position(game.fen());
      //console.log(game.move(move, {sloppy: true}))
    }
  };
  //console.log("GET "+url)
  xhttp.open("GET", url, true);
  xhttp.send();
}

function parseMove(move) {
  move = move.replace(/"/g, '');
  var parts=move.split(' ')
  return {
    from: parts[0].trim(),
    to: parts[1].trim(),
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  }
}
