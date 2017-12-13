document.querySelector(".field").addEventListener("click", addClassToCell);
const classesForMove = ["ch", "r"];
let currentClass = "ch";

var listOfMoves = [];
let currentPosition = -1;

function addClassToCell(event) {
  if (event.target.classList.contains("cell")) {
    // add class to cell
    event.target.classList.add(currentClass);
    // write move {id : '0', class: 'ch'}
    listOfMoves[currentPosition + 1] = {
      id: event.target.dataset.id,
      class: currentClass
    };
    currentPosition += 1;
    // save move to localStorage
    saveMovesToStorage();
    // check current move for win
    checkWinner(currentClass);
    // change class to next
    currentClass = checkMoveClass();
    // check available buttons undo, redo
    checkRedoAvailable();
    checkUndoAvailable();
  }
}

function checkMoveClass() {
  if (currentPosition != -1) {
    let lastMoveClass = listOfMoves[currentPosition].class;
    currentClass = classesForMove.filter(function(element) {
      return element != lastMoveClass;
    })[0];
  } else {
    // начинаем всегда с крестика
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
  switch (listOfMoves.length) {
    case 0:
      undoBtn.setAttribute("disabled", true);
      break;
    case 9:
      undoBtn.setAttribute("disabled", true);
      break;
    default:
      undoBtn.removeAttribute("disabled");
      break;
  }
}

function checkRedoAvailable() {
  if (currentPosition == listOfMoves.length - 1) {
    const redoBtn = document.querySelector(".redo-btn");
    redoBtn.setAttribute("disabled", true);
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
      let currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.remove(listOfMoves[currentPosition].class);
      currentPosition = -1;
      event.target.setAttribute("disabled", true);
    }
    console.log(currentPosition);
    console.log(listOfMoves);
  } else {
    // code to redo moves
    if (currentPosition == listOfMoves.length - 1) {
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
      document.querySelector(".redo-btn").setAttribute("disabled", true);
      currentPosition = listOfMoves.length - 1;
    } else if (currentPosition == -1) {
      currentPosition = 0;
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
    } else {
      currentPosition += 1;
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      // currentElementMove = document.querySelector(
      //   "#c-" + listOfMoves[currentPosition].id
      // );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
    }
    currentClass = checkMoveClass();
    // saveMovesToStorage();
    // saveMovesToStorage();
    // console.log(currentPosition);
    // console.log(listOfMoves);
    checkRedoAvailable();
  }
  currentClass = checkMoveClass();
  // localStorage.setItem("listOfMoves", JSON.stringify(listOfMoves));
  saveMovesToStorage();
}

function addListenersToButtons() {
  const undoBtn = document.querySelector('.undo-btn');
  const redoBtn = document.querySelector('.redo-btn');
  const restartBtn = document.querySelector('.restart-btn');
  undoBtn.addEventListener('click', undoRedo);
  redoBtn.addEventListener('click', undoRedo);
  restartBtn.addEventListener('click', restartGame);
}

function restartGame() {
  listOfMoves = [];
  currentPosition = -1;
  const cellsList = document.querySelectorAll(".cell");
  cellsList.forEach(element => (element.className = "cell"));
  document.querySelector(".won-title").classList.add("hidden");
  checkMoveClass();
  checkUndoAvailable();
  localStorage.clear();
}

addListenersToButtons();

function checkWinner(currentClass) {
  let currentClassMoves = JSON.parse(
    localStorage.getItem("listOfMoves")
  ).filter(el => {
    return el.class == currentClass;
  });
  const winObj = [
    { indexes: "012", direction: "horizontal" },
    { indexes: "345", direction: "horizontal" },
    { indexes: "678", direction: "horizontal" },
    { indexes: "036", direction: "vertical" },
    { indexes: "147", direction: "vertical" },
    { indexes: "258", direction: "vertical" },
    { indexes: "048", direction: "diagonal-right" },
    { indexes: "246", direction: "diagonal-left" }
  ];
  winObj.some(function(element) {
    let arr = currentClassMoves.filter(function(move) {
      return element.indexes.includes(move.id);
    });
    if (arr.length == element.indexes.length) {
      showWonMessage(currentClass);
      checkCellsForWon(arr, element.direction);
      localStorage.clear();
      return true;
    } else if (arr.length != 3 && listOfMoves.length == 9) {
      showWonMessage();
      localStorage.clear();
    }
  });
}

function showWonMessage(currentClass) {
  document.querySelector(".won-title").classList.remove("hidden");
  let wonMessage = document.querySelector(".won-message");
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
}

function checkCellsForWon(arr, direction) {
  let cellsList = document.querySelectorAll(".cell");
  cellsList.forEach(function(element) {
    if (
      arr.some(function(el) {
        return el.id == element.dataset.id;
      })
    ) {
      element.classList.add("win", direction);
    }
  });
}

function saveMovesToStorage() {
  let newListOfMoves = listOfMoves.slice(0, currentPosition + 1);
  //запишем его в хранилище по ключу "listOfMoves"
  localStorage.setItem("listOfMoves", JSON.stringify(newListOfMoves));
}

//очищаем все хранилище, когда игра закончилась
// localStorage.clear()

document.addEventListener("DOMContentLoaded", restoreGame);

function restoreGame() {
  listOfMoves = JSON.parse(localStorage.getItem("listOfMoves"));
  let cellsList = document.querySelectorAll(".cell");

  for (let i = 0; i < listOfMoves.length; i++) {
    cellsList.forEach(function(element) {
      if (element.dataset.id == listOfMoves[i].id) {
        element.classList.add(listOfMoves[i].class);
      }
    });
  }
  currentPosition = listOfMoves.length - 1;
  currentClass = checkMoveClass();
}
