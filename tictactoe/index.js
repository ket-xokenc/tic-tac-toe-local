field.addEventListener("click", addClassToCell);
const values = ["ch", "r"];
let currentClass = "ch";

var listOfMoves = [];
let currentPosition;
function clearAll() {
  document.querySelectorAll(".row");
}

function addClassToCell(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.add(currentClass);
    // write current element to list
    listOfMoves.push({
      id: event.target.dataset.id,
      class: currentClass
    });
    currentPosition = listOfMoves.length - 1;
    currentClass = values.filter(function(item) {
      return item !== currentClass;
    })[0];

    checkUndoAvailable();
    // checkRedoAvailable(); 
  }
}

function redoAvailable() {
  const undoBtn = document.querySelector(".undo-btn");
  // if(listOfMoves.length != 0) {
  undoBtn.removeAttribute("disabled");
  // }
}

function undoAvailable() {
  const redoBtn = document.querySelector(".redo-btn");
  redoBtn.removeAttribute("disabled");
}

document.querySelector(".undo-btn").addEventListener("click", undoAvailable);
document.querySelector(".redo-btn").addEventListener("click", redoAvailable);

function checkUndoAvailable() {
  if (listOfMoves.length != 0) {
    const undoBtn = document.querySelector(".undo-btn");
    undoBtn.removeAttribute("disabled");
  }
}

function checkRedoAvailable() {
  if (currentPosition == listOfMoves.length -1) {
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
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
    }
    checkRedoAvailable(); 
  }
}

// console.log(buttons);
function addListenersToButtons() {
  const buttonsList = document.querySelectorAll(".btn");
  for (let i = 0; i < buttonsList.length; i++) {
    if (
      buttonsList[i].classList.contains("undo-btn") ||
      buttonsList[i].classList.contains("redo-btn")
    ) {
      buttonsList[i].addEventListener("click", undoRedo);
    } else if (buttonsList[i].classList.contains("restart-btn")) {
      // function to clear listOfMoves and field
    }
  }
}

addListenersToButtons();
