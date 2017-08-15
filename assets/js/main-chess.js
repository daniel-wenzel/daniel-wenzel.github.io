var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen')
  statusAni = document.querySelector('#status-ani')

var playerColor = 'w'

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
      (game.turn() !== playerColor)) {
    return false;
  }
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
  aiMove();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  console.log("update game status")
  var status = 'Please make a move';

  var moveColor = 'you';

  statusAni.classList.remove('loader')
  statusAni.classList.add('yourmove')

  if (game.turn() === 'b') {
    moveColor = 'the ai';
    status = 'Ai is computing a move'
    statusAni.classList.add('loader')
    statusAni.classList.remove('yourmove')
  } else if (game.in_check() === true) {
    status += ', you are in check';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = moveColor === 'you'? 'Game over, you are in checkmate.' : 'Congratulations, the computer is in checkmate!';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  statusEl.html(status);
  //fenEl.html(game.fen());
  //updatePGN()
};

function updatePGN() {
  var pgn=document.querySelector("#gameHistory")
  var moves=game.pgn().match(/\d+\.( \S+){1,2}/g)
  console.log(moves)
  console.log(game.pgn())
  if (!moves) return
  var newestMove=moves[moves.length-1]

  var el=document.querySelector("#move-"+(moves.length-1))
  if (!el) {
    el = document.createElement("DIV");
    el.appendChild(document.createTextNode(newestMove))
    el.setAttribute("id", "move-"+(moves.length-1))
    el.setAttribute("class", "historyMove")
    pgn.appendChild(el)
  }
  else {
    el.innerText = newestMove
  }
}
var cfg = {
  draggable: true,
  position: 'start',
  pieceTheme: 'assets/img/chesspieces/wikipedia/{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);

updateStatus();
