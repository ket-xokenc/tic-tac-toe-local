document.querySelector(".field").addEventListener("click", addClassToCell);
const classesForMove = ["ch", "r"];
let currentClass = "ch";

var listOfMoves = [];
let currentPosition = -1;

function addClassToCell(event) {
  if (event.target.classList.contains("cell")) {
    // add class to cell
    event.target.classList.add(currentClass);
    listOfMoves = listOfMoves.slice(0, currentPosition + 1);
    // write move {id : '0', class: 'ch'}
    listOfMoves[currentPosition + 1] = {
      id: event.target.dataset.id,
      class: currentClass
    };
    currentPosition += 1;
    // save move to localStorage
    saveMovesToStorage();
    // check available buttons undo, redo
    checkRedoAvailable();
    checkUndoAvailable();
    // check current move for win
    checkWinner(currentClass);
    // change class to next
    currentClass = checkMoveClass();
  }
}

function checkMoveClass() {
  if (currentPosition != -1) {
    let lastMoveClass = listOfMoves[currentPosition].class;
    currentClass = classesForMove.filter(function(element) {
      return element != lastMoveClass;
    })[0];
  } else {
    // start game with cross
    currentClass = "ch";
  }
  return currentClass;
}

function undoAvailable() {
  const undoBtn = document.querySelector(".undo-btn");
  undoBtn.removeAttribute("disabled");
}

function redoAvailable() {
  const redoBtn = document.querySelector(".redo-btn");
  redoBtn.removeAttribute("disabled");
}

document.querySelector(".undo-btn").addEventListener("click", redoAvailable);
document.querySelector(".redo-btn").addEventListener("click", undoAvailable);

function checkUndoAvailable() {
  const undoBtn = document.querySelector(".undo-btn");
  switch (currentPosition) {
    case -1:
      undoBtn.setAttribute("disabled", true);
      break;
    case 8:
      undoBtn.setAttribute("disabled", true);
      break;
    default:
      undoBtn.removeAttribute("disabled");
      break;
  }
}

function checkRedoAvailable() {
  const redoBtn = document.querySelector(".redo-btn");
  if (currentPosition == listOfMoves.length - 1) {
    redoBtn.setAttribute("disabled", true);
  } else {
    redoBtn.removeAttribute("disabled");
  }
}

function undoRedo(event) {
  if (event.target.classList.contains("undo-btn")) {
    // code to undo moves
    if (currentPosition != 0) {
      let currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.remove(listOfMoves[currentPosition].class);
      currentPosition -= 1;
    } else {
      // we are at first element
      let currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      // delete this move
      currentElementMove.classList.remove(listOfMoves[currentPosition].class);
      currentPosition = -1;
      // disable undo btn
      event.target.setAttribute("disabled", true);
    }
  } else {
    currentPosition += 1;
    currentElementMove = document.querySelector(
      "#c-" + listOfMoves[currentPosition].id
    );
    currentElementMove.classList.add(listOfMoves[currentPosition].class);
    currentClass = checkMoveClass();
    saveMovesToStorage();
    checkRedoAvailable();
  }
  currentClass = checkMoveClass();
  saveMovesToStorage();
}

function addListenersToButtons() {
  const undoBtn = document.querySelector(".undo-btn");
  const redoBtn = document.querySelector(".redo-btn");
  const restartBtn = document.querySelector(".restart-btn");

  undoBtn.addEventListener("click", undoRedo);
  redoBtn.addEventListener("click", undoRedo);
  restartBtn.addEventListener("click", restartGame);
}

function restartGame() {
  document.querySelector(".field").addEventListener("click", addClassToCell);
  document.querySelector('.undo-btn').addEventListener('click', undoRedo);
  document.querySelector('.redo-btn').addEventListener('click', undoRedo);
  listOfMoves = [];
  currentPosition = -1;
  const cellsList = document.querySelectorAll(".cell");
  // reset all cells to start positions
  cellsList.forEach(element => (element.className = "cell"));
  // delete win message
  document.querySelector(".won-title").classList.add("hidden");
  checkMoveClass();
  checkUndoAvailable();
  localStorage.clear();
}

addListenersToButtons();

function checkWinner(currentClass) {
  // filter array by class of last move
  let currentClassMoves = JSON.parse(
    localStorage.getItem("listOfMoves")
  ).filter(el => {
    return el.class == currentClass;
  });

  // list of win positions and directions
  const winPositionsList = [
    { indexes: "012", direction: "horizontal" },
    { indexes: "345", direction: "horizontal" },
    { indexes: "678", direction: "horizontal" },
    { indexes: "036", direction: "vertical" },
    { indexes: "147", direction: "vertical" },
    { indexes: "258", direction: "vertical" },
    { indexes: "048", direction: "diagonal-right" },
    { indexes: "246", direction: "diagonal-left" }
  ];

  winPositionsList.some(function(element) {
    let winMoves = currentClassMoves.filter(function(move) {
      return element.indexes.includes(move.id);
    });
    // there are 3 win moves
    if (winMoves.length == element.indexes.length) {
      gameOverHandler(currentClass);
      crossOutWinCells(winMoves, element.direction);
      localStorage.clear();
      return true;
    } else if (
      winMoves.length != element.indexes.length &&
      listOfMoves.length == 9
    ) {
      // the draw situation
      gameOverHandler();
      localStorage.clear();
    }
  });
}

function gameOverHandler(currentClass) {
  document.querySelector(".won-title").classList.remove("hidden");
  let wonMessage = document.querySelector(".won-message");
  let field = document.querySelector('.field');
  field.removeEventListener('click', addClassToCell);
  document.querySelector('.undo-btn').removeEventListener('click', undoRedo);
  document.querySelector('.redo-btn').removeEventListener('click', undoRedo);
  document.querySelector('.undo-btn').setAttribute('disabled', true);
  document.querySelector('.redo-btn').setAttribute('disabled', true);
  switch (currentClass) {
    case "ch":
      wonMessage.innerHTML = "Crosses won!";
      break;
    case "r":
      wonMessage.innerHTML = "Toes won!";
      break;
    default:
      wonMessage.innerHTML = "It's a draw!";
      break;
  }
  return;
}

function crossOutWinCells(winMoves, direction) {
  let cellsList = document.querySelectorAll(".cell");
  cellsList.forEach(function(cell) {
    if (
      winMoves.some(function(winMove) {
        return winMove.id == cell.dataset.id;
      })
    ) {
      cell.classList.add("win", direction);
    }
  });
}

function saveMovesToStorage() {
  localStorage.setItem("listOfMoves", JSON.stringify(listOfMoves));
  localStorage.setItem('currentPosition', currentPosition);
}

function restoreGame() {
  currentPosition = Number(localStorage.getItem('currentPosition'));
  if (localStorage.getItem("listOfMoves")) {
    listOfMoves = JSON.parse(localStorage.getItem("listOfMoves"));
    let cellsList = document.querySelectorAll(".cell");
    
    for (let i = 0; i <= currentPosition; i++) {
      cellsList.forEach(function(element) {
        if (element.dataset.id == listOfMoves[i].id) {
          element.classList.add(listOfMoves[i].class);
        }
      });
    }
    currentClass = checkMoveClass();
    checkRedoAvailable();
    checkUndoAvailable();
  }
}

document.addEventListener("DOMContentLoaded", restoreGame);
